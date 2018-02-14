import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { lstorage } from 'utils'
import { query, queryField, add, edit, remove } from '../../services/master/employee'
import { query as querySequence, increase as increaseSequence } from '../../services/sequence'
import { pageModel } from './../common'

const success = (id) => {
  message.success(`Employee ${id} has been saved`)
}

export default modelExtend(pageModel, {
  namespace: 'employee',

  state: {
    list: [],
    listLovEmployee: [],
    currentItem: {},
    modalType: 'add',
    display: 'none',
    isChecked: false,
    selectedRowKeys: [],
    activeKey: '0',
    sequence: '',
    disable: '',
    show: 1,
    newItem: false
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        switch (location.pathname) {
          case '/master/employee':
            dispatch({
              type: 'querySequenceEmployee'
            })
            dispatch({
              type: 'updateState',
              payload: {
                newItem: false,
                activeKey: '0'
              }
            })
            break
          case '/report/service/history':
            dispatch({
              type: 'query'
            })
            break
          default:
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * querySequenceEmployee ({ payload = {} }, { call, put }) {
      const seqDetail = {
        seqCode: 'EMP',
        type: lstorage.getCurrentUserStore()
      }
      const sequence = yield call(querySequence, seqDetail)
      if (sequence.success) {
        yield put({ type: 'updateState', payload: { sequence: sequence.data, ...payload } })
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.employee)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put }) {
      const seqDetail = {
        seqCode: 'EMP',
        type: lstorage.getCurrentUserStore() // storeId
      }
      const sequence = yield call(querySequence, seqDetail)
      const employeeData = {
        employeeId: sequence.data,
        ...payload.data
      }
      let data = {}
      if (sequence.data !== null) {
        data = yield call(add, { id: sequence.data, data: employeeData })
        if (data.success) {
          yield put({ type: 'query' })
          const employeeIncrease = yield call(increaseSequence, seqDetail)
          if (employeeIncrease.success) {
            success(sequence.data)
          } else {
            console.log('employeeIncrease :', employeeIncrease.message)
            throw data
          }
          yield put({
            type: 'querySequenceEmployee'
          })
          yield put({ type: 'updateState', payload: { newItem: true } })
        } else {
          throw data
        }
      } else {
        console.log('employeeId = ', sequence.data)
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ employee }) => employee.currentItem.employeeId)
      const newEmployee = { ...payload, id }
      const data = yield call(edit, newEmployee)
      if (data.success) {
        yield put({ type: 'query' })
        success(id)
        yield put({ type: 'updateState', payload: { newItem: true } })
      } else {
        throw data
      }
    },
    * lovForUser ({ payload = {} }, { call, put }) {
      const data = yield call(queryField, { fields: 'employeeId,employeeName,email,positionName', for: 'user' })

      if (data.success) {
        const employees = data.data
        const totalData = data.data.length
        yield put({
          type: 'querySuccessEmployee',
          payload: {
            listLovEmployee: employees,
            pagination: {
              total: totalData
            },
            ...payload
          }
        })
      } else {
        console.log('not success')
      }
    }
  },

  reducers: {

    querySuccessEmployee (state, action) {
      const { list, listLovEmployee, pagination } = action.payload
      return {
        ...state,
        listEmployee: list,
        listLovEmployee,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },
    switchIsChecked (state, { payload }) {
      return { ...state, isChecked: !state.isChecked, display: payload }
    },

    changeTab (state, { payload }) {
      return { ...state, ...payload }
    },

    resetItem (state, { payload }) {
      return { ...state, ...payload }
    },

    resetEmployeeList (state) {
      const defaultState = {
        list: [],
        currentItem: {},
        modalType: 'add',
        display: 'none',
        isChecked: false,
        selectedRowKeys: [],
        // activeKey: '0',
        sequence: '',
        disable: '',
        show: 1
      }
      return { ...state, ...defaultState }
    }

  }
})
