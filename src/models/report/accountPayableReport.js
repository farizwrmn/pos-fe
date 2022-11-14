import modelExtend from 'dva-model-extend'
import { queryTrans, querySupplier } from 'services/report/accountPayableReport'
import { pageModel } from 'models/common'
import moment from 'moment'

export default modelExtend(pageModel, {
  namespace: 'accountPayableReport',

  state: {
    currentItem: {},
    to: moment().format('YYYY-MM-DD'),
    modalType: 'add',
    activeKey: '0',
    listTrans: []
  },

  subscriptions: {
  },

  effects: {
    * queryTrans ({ payload = {} }, { call, put }) {
      const data = yield call(queryTrans, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listTrans: data.data,
            to: payload.to
          }
        })
      } else {
        throw data
      }
    },

    * querySupplier ({ payload = {} }, { call, put }) {
      const data = yield call(querySupplier, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listTrans: data.data
          }
        })
      } else {
        throw data
      }
    }
  },

  reducers: {
    updateState (state, { payload }) {
      return { ...state, ...payload }
    },

    setListNull (state) {
      return { ...state, listTrans: [] }
    },

    changeTab (state, { payload }) {
      const { key } = payload
      return {
        ...state,
        activeKey: key,
        modalType: 'add',
        currentItem: {}
      }
    },

    editItem (state, { payload }) {
      const { item } = payload
      return {
        ...state,
        modalType: 'edit',
        activeKey: '0',
        currentItem: item
      }
    }
  }
})
