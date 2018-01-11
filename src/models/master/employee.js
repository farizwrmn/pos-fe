import modelExtend from 'dva-model-extend'
import { query, queryField, add, edit, remove } from '../../services/master/employee'
import { query as querySequence, increase as increaseSequence } from '../../services/sequence'
import { pageModel } from './../common'
import { message } from 'antd'

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
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/master/employee') {
          dispatch({
            type: 'querySequenceEmployee',
          })
        }
      })
    },
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
              total: data.total,
            },
          },
        })
      }
    },

    * querySequenceEmployee({ payload = {} }, { call, put }) {
      const seqDetail = {
        seqCode: 'EMP',
        type: 1
      }
      const sequence = yield call(querySequence, seqDetail)
      if (sequence.success) {
        const item = {employeeId: sequence.data}
        yield put({ type: 'updateState', payload: { sequence: sequence.data } })
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
        type: 1, // storeId
      }
      const sequence = yield call(querySequence, seqDetail)
      const employeeData = {
        employeeId: sequence.data,
        ...payload.data,
      }
      let data = {}
      if (sequence.data !== null) {
        data = yield call(add, { id: sequence.data, data: employeeData })
        if (data.success) {
          yield put({ type: 'query' })
          const employeeIncrease = yield call(increaseSequence, 'EMP')
          if (employeeIncrease.success) {
            success(sequence.data)
          } else {
            console.log('employeeIncrease :', employeeIncrease.message)
            throw data
          }
          yield put({
            type: 'querySequenceEmployee'
          })
        } else {
          throw data
          console.log('data :', data.message)
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
      } else {
        throw data
      }
    },

    * lovForUser ({ payload }, { call, put }) {
      const data = yield call(queryField, { fields: 'employeeId,employeeName,email,positionName', for: 'user' })
      if ( data.success ) {
        const employees = data.data
        const totalData = data.data.length
        yield put({
          type: 'changeTab',
          payload: {
            listLovEmployee: employees,
            pagination: {
              total: totalData,
            },
          },
        })
      } else {
        console.log('not success')
      }
    },
  },

  reducers: {

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
        show: 1,
      }
      return { ...state, ...defaultState}
    },

  },
})
