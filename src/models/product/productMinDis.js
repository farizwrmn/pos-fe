import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { lstorage } from 'utils'
import { query, edit } from 'services/product/productMinDis'
import { pageModel } from 'models/common'

const success = () => {
  message.success('Mindis has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'productMinDis',

  state: {
    currentItem: {},
    modalEditMindisVisible: false,
    modalEditMindisItem: {},
    modalType: 'add',
    activeKey: '0',
    list: [],
    pagination: {
      pageSizeOptions: ['50', '100', '500', '1000'],
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, ...other } = location.query
        const { pathname } = location
        if (pathname === '/stock-mindis') {
          dispatch({ type: 'query', payload: other })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const response = yield call(query, {
        ...payload,
        storeId: lstorage.getCurrentUserStore()
      })
      if (response.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: response.data,
            pagination: {
              current: Number(response.page) || 1,
              pageSize: Number(response.pageSize) || 10,
              total: response.total
            }
          }
        })
      }
    },

    * edit ({ payload }, { call, put }) {
      const response = yield call(edit, payload.data)
      if (response.success) {
        success()
        yield put({ type: 'query', payload: payload.otherQuery })
        yield put({
          type: 'updateState',
          payload: {
            modalEditMindisVisible: false,
            modalEditMindisItem: {}
          }
        })
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
