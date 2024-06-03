import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { queryById as queryProductById } from 'services/master/productstock'
import { query, queryListDetail, add, edit, remove } from 'services/repacking/standardRecipe'
import { pageModel } from 'models/common'

const success = () => {
  message.success('Standard Recipe has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'standardRecipe',

  state: {
    detail: [],
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    modalMemberTierVisible: false,
    modalMemberTierItem: {},
    modalMemberTierType: 'add',
    list: [],
    pagination: {
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, ...other } = location.query
        const { pathname } = location
        if (pathname === '/standard-recipe') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') dispatch({ type: 'query', payload: other })
        }
      })
    }
  },

  effects: {
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

    * addRecipe ({ payload = {} }, { select, call, put }) {
      const detail = yield select(({ standardRecipe }) => standardRecipe.detail)
      const response = yield call(queryProductById, { id: payload.productCode })
      if (response && response.success && response.data) {
        yield put({
          type: 'standardRecipe/updateState',
          payload: {
            modalMemberTierVisible: false,
            modalMemberTierType: 'add',
            detail: detail
              .filter(filtered => filtered.productCode !== payload.productCode)
              .concat({
                productName: response.data.productName,
                productCode: response.data.productCode,
                productId: response.data.id,
                qty: payload.qty
              }).sort((a, b) => a.productCode - b.productCode)
          }
        })
      } else {
        throw new Error('Product Not Found')
      }
    },

    * loadList ({ payload }, { call, put }) {
      const response = yield call(queryListDetail, { transId: payload.id })
      yield put({
        type: 'productstock/query',
        payload: {
          id: payload.productId
        }
      })
      if (response && response.success && response.data && response.data.length > 0) {
        yield put({
          type: 'updateState',
          payload: {
            detail: response.data
          }
        })
      } else {
        throw response
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
      if (payload.data && payload.data.detail && payload.data.detail.length === 0) {
        throw new Error('Detail is empty')
      }
      const response = yield call(add, payload.data)
      if (response.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            detail: []
          }
        })
        yield put({
          type: 'query'
        })
        yield put({
          type: 'querySequence'
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
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ standardRecipe }) => standardRecipe.currentItem.id)
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
