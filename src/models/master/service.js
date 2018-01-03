import modelExtend from 'dva-model-extend'
import { query, queryServiceType, add, edit, remove } from '../../services/master/service'
import { pageModel } from './../common'
import { message } from 'antd'

const success = () => {
  message.success('Service has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'service',

  state: {
    currentItem: {},
    modalType: 'add',
    display: 'none',
    isChecked: false,
    selectedRowKeys: [],
    activeKey: '0',
    disable: '',
    listServiceType: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/master/service') {
        //   const payload = location.query
          dispatch({
            type: 'queryServiceType',
          })
        }
      })
    },
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, { serviceCode: payload.service })
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

    * queryServiceType ({ payload = {} }, { call, put }) {
      const data = yield call(queryServiceType, payload)
      if (data) {
        yield put({
          type: 'querySuccessServiceType',
          payload: {
            listServiceType: data.data,
          },
        })
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.service)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put }) {
      const data = yield call(add, { id: payload.id, data: payload.data })
      if (data.success) {
        yield put({ type: 'query' })
        success()
      } else {
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ service }) => service.currentItem.serviceCode)
      const newService = { ...payload, id }
      const data = yield call(edit, newService)
      if (data.success) {
        yield put({ type: 'query' })
        success()
      } else {
        throw data
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

    querySuccessServiceType (state, action) {
      const { listServiceType } = action.payload
      return { ...state, listServiceType }
    },

  },
})
