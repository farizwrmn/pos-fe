import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { lstorage } from 'utils'
import { query as queryParameter } from 'services/utils/parameter'
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
    listReason: [],
    modalProductVisible: false,
    modalEditProductVisible: false,
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
          dispatch({
            type: 'queryReason'
          })
        }
      })
    }
  },

  effects: {
    * queryReason (payload, { call, put }) {
      const response = yield call(queryParameter, {
        paramCode: 'returnToDcReason',
        type: 'all',
        order: 'sort'
      })
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listReason: response.data
          }
        })
      } else {
        throw response
      }
    },
    * addItem ({ payload = {} }, { select, put }) {
      const listItem = yield select(({ returnToDc }) => returnToDc.listItem)
      const listReason = yield select(({ returnToDc }) => returnToDc.listReason)
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
        transferQty: payload.item.qty,
        qty: payload.item.qty,
        description: listReason && listReason[0] ? listReason[0].paramValue : undefined
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

    * deleteItem ({ payload }, { select, put }) {
      const listItem = yield select(({ returnToDc }) => returnToDc.listItem)
      if (!payload.item) {
        message.error('Require item in payload')
        return
      }
      const exists = checkExists(payload.item.productId, listItem)
      if (exists) {
        yield put({
          type: 'updateState',
          payload: {
            modalEditProductVisible: false,
            currentItem: {},
            listItem: listItem
              .filter(filtered => filtered.no !== payload.item.no)
              .map((item, index) => ({ ...item, no: index + 1 }))
          }
        })
        message.success('Success delete item')
        return
      }
      throw new Error('Item not found')
    },

    * editItem ({ payload }, { select, put }) {
      const listItem = yield select(({ returnToDc }) => returnToDc.listItem)
      if (!payload.item) {
        message.error('Require item in payload')
        return
      }
      const exists = checkExists(payload.item.productId, listItem)
      if (exists) {
        if (payload.item.qty > exists.transferQty) {
          message.error('Qty is more than requested')
          return
        }
        yield put({
          type: 'updateState',
          payload: {
            listItem: listItem.map((item) => {
              if (item.no === payload.item.no) {
                return payload.item
              }
              return item
            }),
            modalEditProductVisible: false
          }
        })
        message.success('Success edit item')
        return
      }
      throw new Error('Item not found')
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
      const response = yield call(add, {
        data: {
          ...payload.data,
          storeId: lstorage.getCurrentUserStore()
        },
        detail: payload.detail
      })
      if (response.success) {
        if (response.data && response.data.transNo && (payload.data && !payload.data.deliveryOrder)) {
          window.open(`/inventory/transfer/out/${encodeURIComponent(response.data.transNo)}`, '_blank')
        }
        success()
        yield put({
          type: 'updateState',
          payload: {
            selectedTransfer: {},
            listItem: [],
            listTransferOutDetail: []
          }
        })
        if (payload.reset) {
          payload.reset()
        }
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
