import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message, Modal } from 'antd'
import { lstorage } from 'utils'
import { query as querySequence } from 'services/sequence'
import { queryById, voidTrans, query, add, edit, remove } from 'services/payable/payableForm'
import pathToRegexp from 'path-to-regexp'
import { pageModel } from '../common'

const success = () => {
  message.success('Payable Form has been saved')
}

const checkExists = (index, list) => {
  const filteredList = list.filter(filtered => filtered.transNo === index)
  if (filteredList && filteredList.length > 0) {
    return filteredList[0]
  }
  return false
}

export default modelExtend(pageModel, {
  namespace: 'payableForm',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    list: [],
    listItem: [],
    currentItemList: {},
    modalVisible: false,
    modalCancelVisible: false,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, ...payload } = location.query
        const { pathname } = location
        const match = pathToRegexp('/accounts/payable-form/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryDetail',
            payload: {
              id: decodeURIComponent(match[1]),
              storeId: lstorage.getCurrentUserStore()
            }
          })
        }
        if (pathname === '/accounts/payable-form') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') {
            dispatch({ type: 'query', payload })
          } else {
            dispatch({ type: 'updateState', payload: { listItem: [] } })
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
        const { purchase, payable, payableReturn, ...other } = data.data
        yield put({
          type: 'updateState',
          payload: {
            data: other,
            listDetail: payable.concat(payableReturn)
          }
        })
      } else {
        throw data
      }
    },

    * voidTrans ({ payload }, { call, put }) {
      // console.log('payload', payload)
      const data = yield call(voidTrans, payload)
      if (data.success) {
        if (data.success) {
          yield put({
            type: 'updateState',
            payload: {
              modalCancelVisible: false,
              disableConfirm: false
            }
          })
        }
        yield put(routerRedux.push('/accounts/payable-form'))
        Modal.info({
          title: 'Transaction has been canceled'
        })
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
      const data = yield call(add, payload)
      if (data.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            currentItemList: {},
            listItem: []
          }
        })
        yield put({ type: 'query' })
        if (payload.reset) {
          payload.reset()
        }
        yield put({ type: 'querySequence' })
        message.success('Success save data')
      } else {
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ payableForm }) => payableForm.currentItem.id)
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
        message.success('Success edit data')
        yield put({ type: 'querySequence' })
      } else {
        throw data
      }
    },

    * querySequence ({ payload = {} }, { select, call, put }) {
      const invoice = {
        seqCode: 'PPAY',
        type: lstorage.getCurrentUserStore(),
        ...payload
      }
      const data = yield call(querySequence, invoice)
      const currentItem = yield select(({ payableForm }) => payableForm.currentItem)
      const transNo = data.data
      yield put({
        type: 'updateState',
        payload: {
          currentItem: {
            ...currentItem,
            transNo
          }
        }
      })
    },

    * addItem ({ payload = {} }, { select, put }) {
      const listItem = yield select(({ payableForm }) => payableForm.listItem)
      if (!payload.item) {
        message.error('Require item in payload')
        return
      }
      const newList = [
        ...listItem
      ]
      newList.push({
        ...payload.item,
        amount: payload.item.paymentTotal
      })
      const exists = checkExists(payload.item.transNo, listItem)
      if (exists) {
        throw new Error('Item already exists')
      }
      if (payload.item.paymentTotal <= 0) {
        if (!payload.item.returnPurchaseDetail) {
          throw new Error('Item already paid')
        }
      }
      yield put({
        type: 'purchase/hideProductModal'
      })
      yield put({
        type: 'returnPurchase/updateState',
        payload: {
          modalReturnVisible: false
        }
      })
      yield put({
        type: 'updateState',
        payload: {
          listItem: newList
            .map((item, index) => ({ no: index + 1, ...item }))
        }
      })
      message.success('Success add item')
    },

    * editItem ({ payload }, { select, put }) {
      const listItem = yield select(({ payableForm }) => payableForm.listItem)
      if (!payload.item) {
        message.error('Require item in payload')
        return
      }
      console.log('payload.item', payload.item, listItem)
      const exists = checkExists(payload.item.transNo, listItem)
      if (exists) {
        yield put({
          type: 'updateState',
          payload: {
            listItem: listItem.map((item) => {
              if (item.no === payload.item.no) {
                return payload.item
              }
              return item
            }),
            modalVisible: false
          }
        })
        message.success('Success edit item')
        return
      }
      throw new Error('Item not found')
    },

    * deleteItem ({ payload }, { select, put }) {
      const listItem = yield select(({ payableForm }) => payableForm.listItem)
      if (!payload.item) {
        message.error('Require item in payload')
        return
      }
      const exists = checkExists(payload.item.transNo, listItem)
      if (exists) {
        yield put({
          type: 'updateState',
          payload: {
            modalVisible: false,
            currentItemList: {},
            listItem: listItem
              .filter(filtered => filtered.no !== payload.item.no)
              .map((item, index) => ({ ...item, no: index + 1 }))
          }
        })
        message.success('Success delete item')
        return
      }
      throw new Error('Item not found')
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

    setEdit (state, { payload }) {
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
