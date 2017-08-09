import modelExtend from 'dva-model-extend'
import { query, queryField, add, edit, remove } from '../services/employees'
import { pageModel } from './common'
import { config } from 'utils'
const { disableMultiSelect } =  config

export default modelExtend(pageModel, {
  namespace: 'employee',

  state: {
    list: [],
    listLovEmployee: [],
    currentItem: {},
    addItem: {},
    modalVisible: false,
    searchVisible: false,
    modalType: 'add',
    disableItem: {},
    selectedRowKeys: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/master/employee') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }
      })
    },
  },

  effects: {

    *query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 5,
              total: data.total,
            },
          },
        })
        yield put({ type: 'jobposition/lov'})
      }
    },

    *'delete' ({ payload }, { call, put, select }) {
      const data = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.employee)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *'deleteBatch' ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *add ({ payload }, { call, put }) {
      const data = yield call(add, { id: payload.id, data: payload.data })
      if (data.success) {
        yield put({ type: 'modalHide' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *edit ({ payload }, { select, call, put }) {
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
    *lovForUser ({ payload }, { call, put }) {
      const data = yield call(queryField, { fields: 'employeeId,employeeName,email,positionName', for: 'user' })

      if ( data.success ) {
        const employees = data.data
        const totalData = data.data.length
        yield put({
          type: 'querySuccess',
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

    querySuccess (state, action) {
      const { list, listLovEmployee, pagination } = action.payload
      return { ...state,
        list,
        listLovEmployee,
        pagination: {
          ...state.pagination,
          ...pagination,
        } }
    },
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    modalShow (state, { payload }) {
      return { ...state, ...payload, modalVisible: true,
        disableItem: { employeeId: payload.modalType === 'add' ? false : true}
      }
    },
    modalPopoverClose (state) {
      return { ...state, visiblePopoverCity: false }
    },
    chooseCity (state, action) {
      return { ...state, ...action.payload, visiblePopoverCity: false }
    },
    modalPopoverVisibleCity (state, action) {
      return { ...state, ...action.payload, visiblePopoverCity: true }
    },
    modalHide (state) {
      return { ...state, modalVisible: false }
    },
    searchShow (state) {
      return { ...state, searchVisible: true }
    },
    searchHide (state) {
      return { ...state, searchVisible: false }
    },
  },
})
