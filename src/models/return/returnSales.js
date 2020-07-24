import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { lstorage } from 'utils'
import { query, add, edit, remove } from 'services/return/returnSales'
import { query as querySequence } from 'services/sequence'
import { queryDetail as queryPosDetail } from 'services/payment'
import { pageModel } from './../common'

const success = () => {
  message.success('Account Code has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'returnSales',

  state: {
    listItem: [],
    listProduct: [],
    list: [],
    currentItem: {},
    currentItemList: {},
    modalType: 'add',
    activeKey: '0',
    modalEditItemVisible: false,
    modalProductVisible: false,
    modalInvoiceVisible: false,
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
        if (pathname === '/transaction/return-sales') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          dispatch({
            type: 'querySequence',
            payload: {
              seqCode: 'RJJ',
              type: lstorage.getCurrentUserStore() // diganti dengan StoreId
            }
          })
          if (activeKey === '1') dispatch({ type: 'query', payload: other })
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

    * delete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * getInvoiceDetailPurchase ({ payload }, { select, call, put }) {
      const currentItem = yield select(({ returnSales }) => returnSales.currentItem)
      yield put({
        type: 'updateState',
        payload: {
          listProduct: [],
          listItem: []
        }
      })
      const response = yield call(queryPosDetail, {
        id: payload.transNo,
        type: 'print'
      })
      if (response.success && response.pos) {
        const listProduct = response.pos.filter(filtered => filtered.typeCode === 'P')
        yield put({
          type: 'updateItem',
          payload: {
            reference: payload.id,
            referenceNo: payload.transNo
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            listProduct,
            modalInvoiceVisible: false,
            currentItem: {
              ...currentItem,
              reference: payload.id,
              referenceNo: payload.transNo
            }
          }
        })
      } else {
        throw response
      }
    },

    * addItem ({ payload }, { select, put }) {
      const listItem = yield select(({ returnSales }) => returnSales.listItem)
      const exists = listItem.filter(filtered => filtered.id === payload.item.id)
      if (exists && exists.length > 0) {
        message.warning('Product already exists')
        return
      }
      const newListItem = [
        ...listItem
      ]
      const newData = {
        no: listItem.length + 1,
        ...payload.item,
        originalQty: payload.item.qty
      }
      newListItem.push(newData)
      yield put({
        type: 'updateState',
        payload: {
          listItem: newListItem,
          modalProductVisible: false
        }
      })
      // yield put({
      //   type: 'updateState',
      //   payload: {
      //     currentItemList: newData,
      //     modalEditItemVisible: true
      //   }
      // })
    },

    * editItem ({ payload }, { select, put }) {
      const listItem = yield select(({ returnSales }) => returnSales.listItem)
      const exists = listItem.filter(filtered => filtered.id === payload.item.id)
      if (exists && exists.length > 0) {
        const { item } = payload
        if (item.qty > item.originalQty) {
          message.warning('Qty of return sales is bigger than sales')
          return
        }
        const newListItem = listItem.map((item) => {
          if (item.id === payload.item.id) {
            return ({
              ...item,
              ...payload.item
            })
          }
          return item
        })
        yield put({
          type: 'updateState',
          payload: {
            listItem: newListItem,
            currentItemList: {},
            modalEditItemVisible: false
          }
        })
      } else {
        message.warning('Product not exists')
      }
    },

    * deleteItem ({ payload }, { select, put }) {
      const listItem = yield select(({ returnSales }) => returnSales.listItem)
      const exists = listItem.filter(filtered => filtered.id === payload.item.id)
      if (exists && exists.length > 0) {
        const newListItem = listItem
          .filter(filtered => filtered.id !== payload.item.id)
          .map((item, index) => {
            return ({
              ...item,
              no: index + 1
            })
          })
        yield put({
          type: 'updateState',
          payload: {
            listItem: newListItem,
            currentItemList: {},
            modalEditItemVisible: false
          }
        })
      } else {
        message.warning('Product not exists')
      }
    },

    * add ({ payload }, { call, put }) {
      const data = yield call(add, payload)
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
      const id = yield select(({ accountCode }) => accountCode.currentItem.id)
      const newCounter = { ...payload, id }
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

    * querySequence ({ payload }, { call, put }) {
      yield put({ type: 'resetState' })
      const data = yield call(querySequence, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: {
              transNo: data.data,
              storeId: lstorage.getCurrentUserStore()
            },
            listStore: lstorage.getListUserStores()
          }
        })
      } else {
        throw (data)
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
