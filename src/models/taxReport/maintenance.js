import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { queryPos, queryPurchase } from 'services/taxReport/maintenance'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'taxReportMaintenance',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    list: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ history }) {
      history.listen(() => { })
    }
  },

  effects: {

    * queryPos ({ payload = {} }, { call }) {
      const data = yield call(queryPos, payload)
      if (data.success) {
        message.error('Sales success to generate')
      } else {
        message.error('Sales failed to generate')
      }
    },

    * queryPurchase ({ payload = {} }, { call }) {
      const data = yield call(queryPurchase, payload)
      if (data.success) {
        message.error('Purchase success to generate')
      } else {
        message.error('Purchase failed to generate')
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
