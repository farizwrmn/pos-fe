import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { query, add, edit, remove } from 'services/procurement/purchaseSafetyStock'
import { queryDC as queryDistributionCenter, queryStore } from 'services/procurement/purchaseDistribution'
import { pageModel } from 'models/common'
import { lstorage } from 'utils'

const success = () => {
  message.success('Safety Stock has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'purchaseSafetyStock',

  state: {
    currentItem: {},
    listDistributionCenter: [],
    listStore: [],
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
        if (pathname === '/transaction/procurement/safety') {
          dispatch({
            type: 'getDistributionCenterList',
            payload: {
              storeId: lstorage.getCurrentUserStore()
            }
          })
        }
      })
    }
  },

  effects: {

    * getDistributionCenterList ({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          listDistributionCenter: [],
          listStore: []
        }
      })
      const response = yield call(queryDistributionCenter, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listDistributionCenter: response.listDC,
            listStore: response.listStore
          }
        })
      } else {
        throw response
      }
    },

    * query ({ payload = {} }, { call, put }) {
      const response = yield call(query, payload)
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

    * delete ({ payload }, { call, put }) {
      const response = yield call(remove, payload)
      if (response.success) {
        yield put({ type: 'query' })
      } else {
        throw response
      }
    },

    * add ({ payload }, { call, put }) {
      const listStore = yield call(queryStore, {
        purchaseStoreId: payload.purchaseStoreId
      })
      if (listStore.success
        && payload.purchaseStoreId
        && payload.from
        && payload.to
        && listStore.data
        && listStore.data.length > 0) {
        const response = yield call(add, {
          purchaseStoreId: payload.purchaseStoreId,
          salesStoreId: listStore.data.map(item => item.storeId),
          from: payload.from,
          to: payload.to
        })
        if (response.success) {
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
          throw response
        }
      } else {
        message.error(`Parameter Error, DC: ${payload.purchaseStoreId} FROM: ${payload.from} TO: ${payload.from} STORE: ${listStore.data && listStore.data.length}`)
        throw listStore
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ purchaseSafetyStock }) => purchaseSafetyStock.currentItem.id)
      const newCounter = { ...payload.data, id }
      const response = yield call(edit, newCounter)
      if (response.success) {
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
