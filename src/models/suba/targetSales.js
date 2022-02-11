import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { query, add, edit, remove } from '../../services/suba/targetSales'
import { pageModel } from '../common'

const success = (messages) => {
  message.success(messages)
}

export default modelExtend(pageModel, {
  namespace: 'targetSales',

  state: {
    currentItem: {},
    list: [],
    activeKey: '0',
    disable: '',
    advancedForm: true,
    modalType: 'add',
    modalEdit: { visible: false, item: {} },
    pagination: {
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, ...other } = location.query
        const { pathname } = location
        if (pathname === '/master/product/targetSales') {
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
      const data = yield call(query, { ...payload, relationship: 1 })
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            list: data.data
          }
        })
      }
    },

    * add ({ payload }, { call, put }) {
      const data = yield call(add, payload)
      if (data.success) {
        success('Target Sales has been saved')
        const { pathname, query } = location
        yield put(routerRedux.push({
          pathname,
          query: {
            ...query,
            page: 1,
            activeKey: '1'
          }
        }))
      } else {
        const current = Object.assign({}, payload.id, payload.data)
        yield put({
          type: 'updateState',
          payload: {
            currentItem: current
          }
        })
        throw data
      }
    },

    * edit ({ payload }, { call, put }) {
      const data = yield call(edit, payload)
      if (data.success) {
        yield put({
          type: 'targetSales/updateState',
          payload: {
            modalType: 'add',
            activeKey: '0',
            currentItem: {},
            disable: 'disabled'
          }
        })
        const { pathname, query } = location
        yield put(routerRedux.push({
          pathname,
          query: {
            ...query,
            page: 1,
            activeKey: '1'
          }
        }))
      } else {
        throw data
      }
    },

    * delete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            modalEdit: { visible: false, key: '', title: '' }
          }
        })
        yield put({
          type: 'query'
        })
      } else {
        throw data
      }
    }
  },

  reducers: {
    updateState (state, { payload }) {
      return { ...state, ...payload }
    }
  }
})
