import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { lstorage } from 'utils'
import { queryTransferOut, queryTransferOutDetail, add } from 'services/transfer/returnToDc'
import { pageModel } from 'models/common'

const success = () => {
  message.success('Return to DC has been saved')
}

const checkExists = (index, list) => {
  const filteredList = list.filter(filtered => filtered.productId === index)
  if (filteredList && filteredList.length > 0) {
    return filteredList[0]
  }
  return false
}

export default modelExtend(pageModel, {
  namespace: 'returnToDc',

  state: {
    currentItem: {},
    selectedTransfer: {},
    listItem: [],
    listTransferOutDetail: [],
    listProduct: [],
    modalProductVisible: false,
    pagination: {
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        if (pathname === '/return-to-dc') {
          dispatch({
            type: 'updateState',
            payload: {
              selectedTransfer: {},
              listItem: [],
              listProduct: [],
              listTransferOutDetail: []
            }
          })
        }
      })
    }
  },

  effects: {
    * addItem ({ payload = {} }, { select, put }) {
      const listItem = yield select(({ returnToDc }) => returnToDc.listItem)
      const exists = checkExists(payload.item.productId, listItem)
      if (exists) {
        throw new Error('Item already exists')
      }
      const newListItem = [
        ...listItem
      ]
      newListItem.push({
        productId: payload.item.productId,
        productCode: payload.item.productCode,
        productName: payload.item.productName,
        qty: payload.item.qty
      })
      yield put({
        type: 'updateState',
        payload: {
          modalProductVisible: false,
          listItem: newListItem
            .map((item, index) => ({ no: index + 1, ...item }))
        }
      })
    },
    * searchTransferOutDetail ({ payload = {} }, { select, put }) {
      const listTransferOutDetail = yield select(({ returnToDc }) => returnToDc.listTransferOutDetail)
      const { searchText } = payload
      const reg = new RegExp(searchText, 'gi')
      let newData = listTransferOutDetail.map((record) => {
        const match = record.productCode.match(reg) || record.productName.match(reg)
        if (!match) {
          return null
        }
        return {
          ...record
        }
      }).filter(record => !!record)
      yield put({
        type: 'updateState',
        payload: {
          listProduct: newData
        }
      })
    },

    * queryTransferOut ({ payload = {} }, { call, put }) {
      payload.storeId = lstorage.getCurrentUserStore()
      const response = yield call(queryTransferOut, payload)
      if (response.success && response.data && response.data.length > 0) {
        yield put({
          type: 'updateState',
          payload: {
            selectedTransfer: response.data[0]
          }
        })
        yield put({
          type: 'returnToDc/queryTransferOutDetail',
          payload: {
            transNo: payload.transNo,
            storeId: response.data[0].storeId
          }
        })
      } else {
        message.error('Transfer not found')
      }
    },

    * queryTransferOutDetail ({ payload = {} }, { call, put }) {
      const response = yield call(queryTransferOutDetail, payload)
      if (response.success && response.data && response.data.length > 0) {
        yield put({
          type: 'updateState',
          payload: {
            listTransferOutDetail: response.data,
            listProduct: response.data
          }
        })
      } else {
        message.error('Transfer not found')
      }
    },

    * add ({ payload }, { call, put }) {
      const response = yield call(add, payload.data)
      if (response.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            selectedTransfer: {},
            listItem: [],
            listTransferOutDetail: []
          }
        })
      } else {
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
