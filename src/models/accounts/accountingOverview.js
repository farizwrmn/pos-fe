import modelExtend from 'dva-model-extend'
import { pageModel } from 'models/common'

export default modelExtend(pageModel, {
  namespace: 'accountingOverview',

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
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        const { activeKey } = location.query
        if (pathname === '/accounting-overview') {
          dispatch({
            type: 'resetState'
          })
          if (activeKey) {
            dispatch({
              type: 'updateState',
              payload: {
                activeKey
              }
            })
          }
        }
      })
    }
  },

  effects: {

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
