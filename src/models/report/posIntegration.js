import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { lstorage } from 'utils'
import { queryEmbeddedUrl } from 'services/report/pos'
import { pageModel } from 'models/common'

const success = () => {
  message.success('Load report...')
}

export default modelExtend(pageModel, {
  namespace: 'reportPosIntegration',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    iframeUrl: null,
    list: [],
    pagination: {
      current: 1
    }
  },

  subscriptions: {},

  effects: {

    * queryEmbeddedUrl ({ payload = {} }, { call, put }) {
      payload.storeId = lstorage.getCurrentUserStore()
      const response = yield call(queryEmbeddedUrl, payload)
      if (response.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            iframeUrl: response.data
          }
        })
      } else {
        throw response
      }
    }
  },

  reducers: {
    querySuccess (state, action) {
      const { list, pagination } = action.payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    updateState (state, { payload }) {
      return { ...state, ...payload }
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
