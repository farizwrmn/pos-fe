import modelExtend from 'dva-model-extend'
import { query, queryField, add, edit, remove } from '../../services/master/jobposition'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'jobposition',

  state: {
    list: [],
    listLovJobPosition: [],
    currentItem: {},
    addItem: {},
    modalVisible: false,
    searchVisible: false,
    modalType: 'add',
    disableItem: {},
    selectedRowKeys: []
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/master/employee/jobposition') {
          dispatch({
            type: 'query',
            payload: location.query
          })
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
              pageSize: Number(payload.pageSize) || 5,
              total: data.total
            }
          }
        })
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

    * deleteBatch ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put }) {
      const data = yield call(add, { id: payload.id, data: payload.data })
      if (data.success) {
        yield put({ type: 'modalHide' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const employeeId = yield select(({ employee }) => employee.currentItem.employeeId)
      const newEmployee = { ...payload, employeeId }
      const data = yield call(edit, newEmployee)
      if (data.success) {
        yield put({ type: 'modalHide' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
    * lov ({ payload = {} }, { call, put }) {
      const data = yield call(queryField, { fields: 'id,positionName', for: 'employee' })

      if (data.success) {
        const dataLov = data.data
        const totalData = data.data.length
        yield put({
          type: 'querySuccessLov',
          payload: {
            listLovJobPosition: dataLov,
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

    querySuccess (state, action) {
      const { list, listLovEmployee, pagination } = action.payload
      return { ...state,
        list,
        listLovEmployee,
        pagination: {
          ...state.pagination,
          ...pagination
        } }
    },
    querySuccessLov (state, action) {
      const { listLovJobPosition, pagination } = action.payload
      return { ...state,
        listLovJobPosition,
        pagination: {
          ...state.pagination,
          ...pagination
        } }
    },
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    modalShow (state, { payload }) {
      return { ...state,
        ...payload,
        modalVisible: true,
        disableItem: { employeeId: payload.modalType !== 'add' }
      }
    },
    modalHide (state) {
      return { ...state, modalVisible: false }
    },
    searchShow (state) {
      return { ...state, searchVisible: true }
    },
    searchHide (state) {
      return { ...state, searchVisible: false }
    }
  }
})
