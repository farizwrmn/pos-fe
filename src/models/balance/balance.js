import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { lstorage } from 'utils'
import { BALANCE_TYPE_AWAL, BALANCE_TYPE_TRANSACTION } from 'utils/variable'
import moment from 'moment'
import { query, queryById, add, edit, remove, approve } from '../../services/balance/balance'
import { query as queryDetail } from '../../services/balance/balanceDetail'
import {
  getActive,
  open,
  closed as closeBalance
} from '../../services/balance/balanceProcess'
import { pageModel } from '../common'

const success = () => {
  message.success('Balance has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'balance',

  state: {
    currentItem: {},
    modalType: 'add',
    display: 'none',
    isChecked: false,
    currentDate: moment(),
    selectedRowKeys: [],
    modalApproveVisible: false,
    modalDetailVisible: false,
    listBalance: [],
    activeKey: '0',
    disable: '',
    show: 1,
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
        const match = pathToRegexp('/balance/invoice/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'queryById', payload: { id: match[1] } })
        }
        if (pathname === '/balance/current') {
          dispatch({
            type: 'active',
            payload: {
              countClosing: 1
            }
          })
        }
        if (pathname === '/balance/closing'
          || pathname === '/transaction/pos') {
          dispatch({
            type: 'active',
            payload: {
              countClosing: 1
            }
          })
        }
        if (pathname === '/balance/dashboard') {
          dispatch({
            type: 'query',
            payload: {
              relationship: 1,
              approvement: 1
            }
          })
        }

        if (pathname === '/balance/history') {
          dispatch({
            type: 'query',
            payload: {
              relationship: 1,
              history: 1,
              storeId: lstorage.getCurrentUserStore()
            }
          })
        }
      })
    }
  },

  effects: {
    * queryById ({ payload = {} }, { call, put }) {
      const data = yield call(queryById, payload.id)
      if (data.success && data.data) {
        const { purchase, bankEntryDetail, ...other } = data.data
        yield put({
          type: 'updateState',
          payload: {
            currentItem: other
          }
        })
      } else {
        throw data
      }
    },
    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            listBalance: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * active ({ payload = {} }, { call, put }) {
      const response = yield call(getActive)
      if (response && response.success) {
        let detail = {}
        let countClosing = 0
        if (response.data && response.data.id) {
          if (payload && payload.countClosing) {
            countClosing = payload.countClosing
          }
          detail = yield call(queryDetail, { countClosing, balanceId: response.data.id, relationship: 1, balanceType: BALANCE_TYPE_AWAL })
        }

        yield put({
          type: 'updateState',
          payload: {
            currentItem: {
              ...response.data, detail: detail.data
            } || {}
          }
        })

        yield put({
          type: 'activeDetail',
          payload: {
            countClosing
          }
        })
      } else {
        throw response
      }
    },

    * activeDetail ({ payload = {} }, { call, put, select }) {
      const currentItem = yield select(({ balance }) => balance.currentItem)
      const response = yield call(getActive)
      if (response && response.success) {
        let detail = {}
        if (response.data && response.data.id) {
          detail = yield call(queryDetail, { countClosing: payload.countClosing, balanceId: response.data.id, relationship: 1, balanceType: BALANCE_TYPE_TRANSACTION })
        }

        yield put({
          type: 'updateState',
          payload: {
            currentItem: {
              ...currentItem, transaction: detail.data
            } || {}
          }
        })
      } else {
        throw response
      }
    },

    * approve ({ payload }, { call, put }) {
      const response = yield call(approve, payload)
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: {},
            modalApproveVisible: false
          }
        })
        yield put({
          type: 'query',
          payload: {
            relationship: 1,
            approvement: 1
          }
        })
      } else {
        throw response
      }
    },

    * open ({ payload }, { call, put }) {
      const response = yield call(open, payload)
      if (response && response.success) {
        yield put({
          type: 'active'
        })
        yield put(routerRedux.push('/transaction/pos'))
      } else {
        throw response
      }
    },

    * closed ({ payload }, { call, put }) {
      const response = yield call(closeBalance, payload)
      if (response && response.success) {
        yield put({
          type: 'active'
        })
        window.open(`/balance/invoice/${payload.data.balanceId}`, '_blank')
        yield put(routerRedux.push('/balance/current'))
      } else {
        throw response
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(models => models.balance)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put }) {
      const data = yield call(add, { id: payload.id, data: payload.data })
      if (data.success) {
        // yield put({ type: 'query' })
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {}
          }
        })
      } else {
        let current = Object.assign({}, payload.id, payload.data)
        yield put({
          type: 'updateState',
          payload: {
            currentItem: current
          }
        })
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ balance }) => balance.currentItem.id)
      const newSupplier = { ...payload, id }
      const data = yield call(edit, newSupplier)
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
      } else {
        let current = Object.assign({}, payload.id, payload.data)
        yield put({
          type: 'updateState',
          payload: {
            currentItem: current
          }
        })
        throw data
      }
    }
  },

  reducers: {
    querySuccess (state, action) {
      const { listBalance, pagination } = action.payload
      return {
        ...state,
        list: listBalance,
        listBalance,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    switchIsChecked (state, { payload }) {
      return { ...state, isChecked: !state.isChecked, display: payload }
    },

    changeTab (state, { payload }) {
      return { ...state, ...payload }
    },

    resetItem (state, { payload }) {
      return { ...state, ...payload }
    },

    resetSupplierList (state) {
      return { ...state, list: [], listBalance: [], pagination: { total: 0 } }
    },

    refreshView (state) {
      return {
        ...state,
        modalType: 'add',
        currentItem: {}
      }
    }
  }
})
