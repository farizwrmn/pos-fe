import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { Modal, message } from 'antd'
import { lstorage } from 'utils'
import { query as querySequence } from 'services/sequence'
import { query, add, edit, remove } from 'services/payment/journalentry'
import { pageModel } from 'common'

const success = () => {
  message.success('Journal entry has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'journalentry',

  state: {
    currentItem: {},
    currentItemList: {},
    modalType: 'add',
    inputType: null,
    activeKey: '0',
    listCash: [],
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
        const { activeKey, ...other } = location.query
        const { pathname } = location
        if (pathname === '/journal-entry') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') {
            dispatch({ type: 'query', payload: other })
          } else {
            dispatch({ type: 'querySequence' })
          }
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccessCounter',
          payload: {
            listCash: data.data,
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
        seqCode: 'JE',
        type: lstorage.getCurrentUserStore(),
        ...payload
      }
      const data = yield call(querySequence, invoice)
      const currentItem = yield select(({ journalentry }) => journalentry.currentItem)
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
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            listItem: []
          }
        })
        const userId = lstorage.getStorageKey('udi')[1]
        yield put({
          type: 'pos/loadDataPos',
          payload: {
            cashierId: userId,
            status: 'O'
          }
        })
        yield put({ type: 'querySequence' })
        Modal.success({
          title: 'Transaction success',
          content: 'Transaction has been saved'
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload.oldValue
          }
        })
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ journalentry }) => journalentry.currentItem.id)
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
    }
  },

  reducers: {
    querySuccessCounter (state, action) {
      const { listCash, pagination } = action.payload
      return {
        ...state,
        listCash,
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
