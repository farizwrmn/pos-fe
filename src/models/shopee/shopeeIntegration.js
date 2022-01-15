import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { setCode } from 'services/shopee/shopeeApi'
import { routerRedux } from 'dva/router'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'shopeeIntegration',

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
        const { activeKey, ...other } = location.query
        const { pathname } = location
        if (pathname === '/integration/shopee/set-code') {
          dispatch({
            type: 'setCode',
            payload: {
              code: other.code,
              shop_id: other.shop_id
            }
          })
        }
      })
    }
  },

  effects: {

    * setCode ({ payload = {} }, { call, put }) {
      const data = yield call(setCode, {
        ...payload,
        type: 'all'
      })
      yield put({
        type: 'updateState',
        payload: {
          setCodeMessage: data.message
        }
      })
      message.info('Success login shopee')
      yield put(routerRedux.push({
        pathname: '/integration/shopee/set-code'
      }))
      yield put(routerRedux.push({
        pathname: '/dashboard'
      }))
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
