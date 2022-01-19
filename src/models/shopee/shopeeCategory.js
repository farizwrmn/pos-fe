import { message } from 'antd'
import modelExtend from 'dva-model-extend'
import { query, queryBrand, queryLogistic, queryRecommend } from 'services/shopee/shopeeCategory'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'shopeeCategory',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    list: [],
    listRecommend: [],
    listLogistic: [],
    lastProductName: undefined,
    listBrand: [],
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
        if (pathname === '/stock') {
          dispatch({
            type: 'query',
            payload: {
              type: 'all'
            }
          })
          dispatch({
            type: 'queryLogistic',
            payload: {
              type: 'all'
            }
          })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * queryBrand ({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          listBrand: []
        }
      })
      const data = yield call(queryBrand, {
        type: 'all',
        ...payload
      })
      if (data.success
        && data.response
        && data.response.brand_list
        && data.response.brand_list.length > 0) {
        yield put({
          type: 'updateState',
          payload: {
            listBrand: data.response.brand_list
          }
        })
      } else if (data.success
        && data.response
        && data.response.brand_list
        && data.response.brand_list.length === 0) {
        message.error('Brand not found')
      } else {
        throw data
      }
    },

    * queryLogistic ({ payload = {} }, { call, put }) {
      const data = yield call(queryLogistic, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listLogistic: data.data
          }
        })
      }
    },

    * queryRecommend ({ payload = {} }, { select, call, put }) {
      const lastProductName = yield select(({ productstock }) => productstock.lastProductName)
      if (lastProductName !== payload.productName) {
        yield put({
          type: 'updateState',
          payload: {
            listRecommend: []
          }
        })
        const data = yield call(queryRecommend, payload)
        if (data.success && data.response && data.response.category_id) {
          yield put({
            type: 'updateState',
            payload: {
              listRecommend: data.response.category_id,
              lastProductName: payload.productName
            }
          })
        }
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
