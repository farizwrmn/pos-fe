import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { Modal, message } from 'antd'
import { lstorage } from 'utils'
import pathToRegexp from 'path-to-regexp'
import { query as querySequence } from 'services/sequence'
import { queryById, query, queryId, add, edit, remove } from 'services/transfer/transferInvoice'
import { query as queryDetail } from 'services/transfer/transferInvoiceDetail'
import { queryCost } from 'services/transferStockOut'
import { pageModel } from '../common'

const success = () => {
  message.success('Transfer Invoice has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'transferInvoice',

  state: {
    data: {},
    listDetail: [],
    listStore: [],
    currentItem: {},
    currentItemList: {},
    modalType: 'add',
    modalItemType: 'add',
    modalPaymentVisible: false,
    inputType: null,
    activeKey: '0',
    list: [],
    modalVisible: false,
    listItem: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, edit, ...other } = location.query
        const { pathname } = location
        const match = pathToRegexp('/inventory/transfer/invoice/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryDetail',
            payload: {
              id: decodeURIComponent(match[1]),
              storeId: lstorage.getCurrentUserStore()
            }
          })
        }
        if (pathname === '/inventory/transfer/invoice') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') {
            dispatch({ type: 'query', payload: other })
          }

          if (activeKey === '2') {
            dispatch({
              type: 'query',
              payload: {
                ...other,
                forPayment: 1
              }
            })
          }

          if (edit && edit !== '' && edit !== '0') {
            dispatch({
              type: 'setEdit',
              payload: {
                edit
              }
            })
          } else {
            dispatch({ type: 'querySequence' })
          }
        }
      })
    }
  },

  effects: {
    * queryDetail ({ payload = {} }, { call, put }) {
      const data = yield call(queryById, payload)
      if (data.success && data.data) {
        const { purchase, transferInvoiceDetail, ...other } = data.data
        yield put({
          type: 'updateState',
          payload: {
            data: other,
            listDetail: transferInvoiceDetail
          }
        })
      } else {
        throw data
      }
    },

    * query ({ payload = {} }, { call, put }) {
      const { edit, ...other } = payload
      const data = yield call(query, other)
      if (data) {
        yield put({
          type: 'querySuccessCounter',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * querySequence ({ payload = {} }, { select, call, put }) {
      const invoice = {
        seqCode: 'TINV',
        type: lstorage.getCurrentUserStore(),
        ...payload
      }
      const data = yield call(querySequence, invoice)
      const currentItem = yield select(({ transferInvoice }) => transferInvoice.currentItem)
      const transNo = data.data
      yield put({
        type: 'updateState',
        payload: {
          currentItem: {
            ...currentItem,
            storeId: lstorage.getCurrentUserStore(),
            transNo
          },
          listStore: lstorage.getListUserStores()
        }
      })
    },

    * addItem ({ payload }, { select, call, put }) {
      const listItem = yield select(({ transferInvoice }) => transferInvoice.listItem)
      const data = yield call(queryDetail, {
        transferId: payload.data.id
      })
      const cost = yield call(queryCost, {
        transNo: payload.data.transNo,
        storeId: payload.data.storeId,
        storeIdReceiver: payload.data.storeIdReceiver
      })
      if (!cost.success) {
        throw cost
      }
      if (data.success) {
        if (data.data.length === 0) {
          const newListItem = ([]).concat(listItem)
          const amount = cost.data ? cost
            .data
            .reduce(
              (prev, next) => prev + (parseFloat(next.purchasePrice) * parseFloat(next.qty)),
              0) : 0
          if (amount === 0) {
            throw new Error('Transfer total is 0')
          }
          newListItem.push({
            ...payload.data,
            no: (listItem || []).length + 1,
            chargePercent: 0,
            chargeNominal: 0,
            amount
          })
          yield put({
            type: 'updateState',
            payload: {
              listLovVisible: false,
              modalVisible: false,
              modalItemType: 'add',
              listItem: newListItem,
              currentItemList: {}
            }
          })
          message.success('success add item')
        } else {
          message.warning('transfer already used')
        }
      } else {
        throw data
      }
    },

    * setEdit ({ payload }, { call, put }) {
      const data = yield call(queryId, { id: payload.edit, relationship: 1 })
      if (data.success) {
        const { transferInvoiceDetail, ...currentItem } = data.data
        console.log('transferInvoiceDetail', transferInvoiceDetail)
        yield put({
          type: 'updateState',
          payload: {
            currentItem,
            listStore: lstorage.getListUserStores(),
            modalType: 'edit',
            listItem: transferInvoiceDetail ?
              transferInvoiceDetail.map((item, index) => ({
                no: index + 1,
                ...item
              }))
              : []
          }
        })
      } else {
        throw data
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

    * add ({ payload = {} }, { call, put }) {
      const { oldValue } = payload
      yield put({
        type: 'updateState',
        payload: {
          currentItem: oldValue
        }
      })
      const data = yield call(add, payload)
      if (data.success) {
        success()
        payload.reset()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            listItem: []
          }
        })
        yield put({ type: 'querySequence' })
        yield put({ type: 'query' })
        Modal.success({
          title: 'Transaction success',
          content: 'Transaction has been saved'
        })
      } else {
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ transferInvoice }) => transferInvoice.currentItem.id)
      const newCounter = { ...payload, id }
      const data = yield call(edit, newCounter)
      if (data.success) {
        success()
        payload.reset()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            listItem: [],
            activeKey: payload.forPayment ? '2' : '1'
          }
        })
        const { pathname } = location
        if (payload.forPayment) {
          yield put(routerRedux.push({
            pathname,
            query: {
              activeKey: '2'
            }
          }))
          yield put({
            type: 'updateState',
            payload: {
              modalPaymentVisible: false
            }
          })
          yield put({
            type: 'query',
            payload: {
              forPayment: 1
            }
          })
        } else {
          yield put(routerRedux.push({
            pathname,
            query: {
              activeKey: '1'
            }
          }))
          yield put({ type: 'query' })
        }
      } else {
        throw data
      }
    }
  },

  reducers: {
    querySuccessCounter (state, action) {
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

    updateCurrentItem (state, { payload }) {
      const { currentItem } = state
      return { ...state, currentItem: { ...currentItem, ...payload } }
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
