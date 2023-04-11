import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import pathToRegexp from 'path-to-regexp'
import { querySupplier, query, queryId, add, edit, remove } from 'services/procurement/purchaseReceive'
import { getDenominatorDppInclude, getDenominatorPPNInclude, getDenominatorPPNExclude } from 'utils/tax'
import { query as getPurchaseOrder } from 'services/procurement/purchaseOrder'
import { pageModel } from 'models/common'
import { lstorage } from 'utils'

const success = () => {
  message.success('Purchase Receive has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'purchaseReceive',

  state: {
    currentItem: {},
    modalEditVisible: false,
    modalEditItem: {},
    modalType: 'add',
    activeKey: '0',
    listTrans: [],
    listDetail: [],
    listItem: [],
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
        if (pathname === '/transaction/procurement/receive') {
          dispatch({
            type: 'queryHeader'
          })
        }
        const match = pathToRegexp('/transaction/procurement/receive/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'updateState',
            payload: {
              currentItem: [],
              listItem: []
            }
          })
          dispatch({
            type: 'queryPurchaseOrder',
            payload: {
              id: match[1]
            }
          })
        }
      })
    }
  },

  effects: {

    * queryPurchaseOrder ({ payload = {} }, { call, put }) {
      const response = yield call(queryId, {
        id: payload.id
      })
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: response.data
          }
        })
        yield put({
          type: 'queryPurchaseOrderDetail',
          payload: {
            header: response.data,
            transNoId: payload.id
          }
        })
      } else {
        throw response
      }
    },

    * queryPurchaseOrderDetail ({ payload = {} }, { call, put }) {
      const response = yield call(query, {
        transNoId: payload.transNoId,
        type: 'all'
      })
      if (response.success && response.data) {
        yield put({
          type: 'changeTotalData',
          payload: {
            header: payload.header,
            listItem: response.data.map((item, index) => ({
              ...item,
              no: index + 1
            }))
          }
        })
      } else {
        throw response
      }
    },

    * receive ({ payload = {} }, { call, put }) {
      const response = yield call(edit, payload)
      if (response.success) {
        yield put({
          type: 'queryPurchaseOrder',
          payload: {
            id: payload.id
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            modalEditVisible: false,
            modalEditItem: {}
          }
        })
      } else {
        throw response
      }
    },

    * changeTotalData ({ payload = {} }, { put }) {
      const { listItem, header } = payload
      let ppnType = header.taxType
      const totalPrice = listItem.reduce((prev, next) => prev + ((((next.receivedQty * next.purchasePrice) * (1 - ((next.discPercent / 100)))) - next.discNominal) * (1 - (header.discInvoicePercent / 100))), 0)
      const dataProduct = listItem
      for (let key = 0; key < dataProduct.length; key += 1) {
        const discItem = ((((dataProduct[key].receivedQty * dataProduct[key].purchasePrice) * (1 - ((dataProduct[key].discPercent / 100)))) - dataProduct[key].discNominal) * (1 - (header.discInvoicePercent / 100)))
        dataProduct[key].portion = totalPrice > 0 ? discItem / totalPrice : 0
        const totalDpp = parseFloat(discItem - (header.discInvoiceNominal * dataProduct[key].portion))
        if (header.deliveryFee && header.deliveryFee !== '' && header.deliveryFee > 0) {
          dataProduct[key].deliveryFee = dataProduct[key].portion * header.deliveryFee
        } else {
          dataProduct[key].deliveryFee = 0
        }
        dataProduct[key].DPP = parseFloat(totalDpp / (ppnType === 'I' ? getDenominatorDppInclude() : 1))
        dataProduct[key].PPN = parseFloat((ppnType === 'I' ? totalDpp / getDenominatorPPNInclude() : ppnType === 'S' ? (dataProduct[key].DPP * getDenominatorPPNExclude()) : 0))
        dataProduct[key].total = parseFloat(dataProduct[key].DPP + dataProduct[key].PPN)
      }
      yield put({
        type: 'updateState',
        payload: {
          listItem: dataProduct
        }
      })
    },

    * queryHeader (payload, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          listTrans: []
        }
      })
      const response = yield call(querySupplier, {
        storeId: lstorage.getCurrentUserStore()
      })
      if (response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            listTrans: response.data
          }
        })
      } else {
        throw response
      }
    },

    * queryDetail ({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          listDetail: []
        }
      })
      const response = yield call(getPurchaseOrder, {
        storeId: lstorage.getCurrentUserStore(),
        supplierId: payload.supplierId,
        type: 'all',
        status: 1
      })
      if (response.success && response.data) {
        yield put({
          type: 'updateState',
          payload: {
            listDetail: response.data.map((item, index) => ({
              ...item,
              no: index + 1
            }))
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
      yield put({
        type: 'changeTotalData',
        payload: {
          header: payload.data,
          listItem: payload.listItem
        }
      })
      const response = yield call(add, {
        transNoId: payload.transNoId,
        ...payload.data,
        storeId: lstorage.getCurrentUserStore()
      })
      if (response.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            listItem: [],
            currentItem: {}
          }
        })
        yield put(routerRedux.push('/transaction/procurement/receive'))
        if (payload.reset) {
          payload.reset()
        }
      } else {
        throw response
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ purchaseInvoice }) => purchaseInvoice.currentItem.id)
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
