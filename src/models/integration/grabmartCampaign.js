import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { lstorage } from 'utils'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { query, queryById, add, uploadGrabmartCampaign, edit, remove } from 'services/integration/grabmartCampaign'
import { query as queryAlwaysOn, add as addAlwaysOn, remove as removeAlwaysOn } from 'services/grabmart/alwaysOnProduct'
import { pageModel } from '../common'

const success = () => {
  message.success('Grabmart campaign has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'grabmartCampaign',

  state: {
    currentItem: {},
    data: {},
    listAlwaysOn: [],
    listDetail: [],
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
        const match = pathToRegexp('/integration/grabmart-campaign/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryDetail',
            payload: {
              id: decodeURIComponent(match[1]),
              storeId: lstorage.getCurrentUserStore()
            }
          })
        }
        if (pathname === '/integration/grabmart-campaign') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') {
            dispatch({ type: 'query', payload: other })
          }
          if (activeKey === '0' || activeKey === '2') {
            dispatch({ type: 'queryAlwaysOn' })
          }
        }
      })
    }
  },

  effects: {
    * queryDetail ({ payload = {} }, { call, put }) {
      const data = yield call(queryById, payload)
      if (data.success && data.data) {
        const { purchase, campaignMapProduct, ...other } = data.data
        yield put({
          type: 'updateState',
          payload: {
            data: other,
            listDetail: campaignMapProduct || []
          }
        })
      } else {
        throw data
      }
    },

    * queryAlwaysOn (payload, { call, put }) {
      const response = yield call(queryAlwaysOn, {
        type: 'all'
      })
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listAlwaysOn: response.data
          }
        })
      } else {
        throw response
      }
    },

    * addAlwaysOn ({ payload }, { call, put }) {
      const data = yield call(addAlwaysOn, payload.data)
      if (data.success) {
        yield put({
          type: 'queryAlwaysOn'
        })
        message.success('Success add product')
        if (payload.reset) {
          payload.reset()
        }
      } else {
        throw data
      }
    },

    * uploadGrabmart ({ payload }, { call, put }) {
      const data = yield call(uploadGrabmartCampaign, payload.data)
      if (data.success) {
        yield put({
          type: 'queryDetail',
          payload: {
            id: payload.data.campaignId,
            storeId: lstorage.getCurrentUserStore()
          }
        })
        message.success('Success upload to grabmart')
        if (payload.reset) {
          payload.reset()
        }
      } else {
        message.success(data.data.message)
      }
    },

    * deleteAlwaysOn ({ payload }, { call, put }) {
      const data = yield call(removeAlwaysOn, payload)
      if (data.success) {
        message.success('Success delete product')
        yield put({ type: 'queryAlwaysOn' })
      } else {
        throw data
      }
    },

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

    * delete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put }) {
      const data = yield call(add, payload.data)
      if (data.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {}
          }
        })
        yield put({
          type: 'query'
        })
        yield put(routerRedux.push({
          pathname: `/integration/grabmart-campaign/${data.data.id}`
        }))
        if (payload.reset) {
          payload.reset()
        }
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ grabmartCampaign }) => grabmartCampaign.currentItem.id)
      const newCounter = { ...payload.data, id }
      const data = yield call(edit, newCounter)
      if (data.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            activeKey: '1'
          }
        })
        const { pathname } = location
        yield put(routerRedux.push({
          pathname,
          query: {
            activeKey: '1'
          }
        }))
        yield put({ type: 'query' })
        if (payload.reset) {
          payload.reset()
        }
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        throw data
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
