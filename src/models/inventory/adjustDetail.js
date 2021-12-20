import modelExtend from 'dva-model-extend'
import { lstorage } from 'utils'
import { queryEntryList } from 'services/payment/bankentry'
import {
  JOURNALENTRY
} from 'utils/variable'
import { queryById } from 'services/payment/journalentry'
import { pageModel } from 'common'
import pathToRegexp from 'path-to-regexp'

export default modelExtend(pageModel, {
  namespace: 'adjustDetail',

  state: {
    data: {},
    listDetail: [],
    listAccounting: [],
    currentItem: {},
    currentItemList: {},
    modalType: 'add',
    modalItemType: 'add',
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
        const match = pathToRegexp('/transaction/adjust/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryDetail',
            payload: {
              id: decodeURIComponent(match[1]),
              storeId: lstorage.getCurrentUserStore(),
              match
            }
          })
        }
      })
    }
  },

  effects: {
    * queryDetail ({ payload = {} }, { call, put }) {
      const data = yield call(queryById, payload)
      if (data.success && data.data) {
        const { purchase, journalEntryDetail, ...other } = data.data
        let listAccounting = []
        if (payload && payload.match && other && other.id) {
          const reconData = yield call(queryEntryList, {
            transactionId: other.id,
            transactionType: JOURNALENTRY,
            type: 'all'
          })
          if (reconData && reconData.data) {
            listAccounting = listAccounting.concat(reconData.data)
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            data: other,
            listDetail: journalEntryDetail,
            listAccounting
          }
        })
      } else {
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
