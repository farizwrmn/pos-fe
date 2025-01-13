import modelExtend from 'dva-model-extend'
import { queryDetail, queryTransferOutDetail } from 'services/deliveryOrder/deliveryOrderPacker'
import deliveryOrderStorage from 'utils/storage/deliveryOrder'
import deliveryOrderCartStorage from 'utils/storage/deliveryOrderCart'
import { queryLov, add as submitTransferOut } from 'services/transferStockOut'
import { lstorage, alertModal } from 'utils'
import { message, Modal } from 'antd'
import { pageModel } from 'models/common'
import pathToRegexp from 'path-to-regexp'

const { stockMinusAlert } = alertModal

const error = (err) => {
  message.error(typeof err.message === 'string' ? err.message : err.detail)
}

export default modelExtend(pageModel, {
  namespace: 'deliveryOrderPacker',

  state: {
    currentItem: {},
    listTransferOutHistory: [],
    latestBoxNumber: 1,
    modalBoxNumberVisible: false,
    deliveryOrder: {},
    listItem: [],
    modalType: 'add',
    activeKey: '0',
    list: [],
    pagination: {
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/delivery-order-packer/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryHistory',
            payload: {
              id: match[1]
            }
          })

          dispatch({
            type: 'queryDetail',
            payload: {
              id: decodeURIComponent(match[1]),
              storeId: lstorage.getCurrentUserStore()
            }
          })
        }
      })
    }
  },

  effects: {
    * queryHistory ({ payload }, { call, put }) {
      const response = yield call(queryTransferOutDetail, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listTransferOutHistory: response.data
          }
        })
      } else {
        throw response
      }
    },

    * groupingDeliveryOrderCart (payload, { select, put }) {
      const listItem = yield select(({ deliveryOrderPacker }) => deliveryOrderPacker.listItem)
      const deliveryOrder = yield select(({ deliveryOrderPacker }) => deliveryOrderPacker.deliveryOrder)
      let result = []
      listItem.reduce((res, value) => {
        if (!res[value.productId]) {
          res[value.productId] = { ...value, orderQty: 0 }
          result.push(res[value.productId])
        }
        res[value.productId].orderQty += value.orderQty
        return res
      }, {})
      yield put({
        type: 'saveDeliveryOrderCart',
        payload: {
          transNo: deliveryOrder.transNo,
          listItem: result.map((item) => {
            if (item.orderQty >= item.qty) {
              return ({ ...item, checklist: true })
            }
            return item
          })
        }
      })
      message.success('Grouping is success')
    },

    * loadDeliveryOrderCart ({ payload = {} }, { call, put }) {
      const { transNo } = payload
      const listItemResponse = yield call(deliveryOrderCartStorage.load, {
        transNo
      })
      let listItem = listItemResponse && listItemResponse.listItem ? listItemResponse.listItem : []
      listItem = listItem.map((item, index) => ({ ...item, no: listItem.length - index }))
      yield put({
        type: 'updateState',
        payload: {
          listItem
        }
      })
    },

    * saveDeliveryOrderCart ({ payload = {} }, { call, put }) {
      const { transNo, listItem } = payload
      yield call(deliveryOrderCartStorage.saveLocal, {
        transNo,
        listItem
      })
      yield put({
        type: 'loadDeliveryOrderCart',
        payload: {
          transNo
        }
      })
    },

    * deleteDeliveryOrderCart (payload, { select, put }) {
      const deliveryOrder = yield select(({ deliveryOrderPacker }) => deliveryOrderPacker.deliveryOrder)
      yield put({
        type: 'saveDeliveryOrderCart',
        payload: {
          transNo: deliveryOrder.transNo,
          listItem: []
        }
      })
    },

    * deleteDeliveryOrderCartItem ({ payload = {} }, { select, put }) {
      const { time } = payload
      const deliveryOrder = yield select(({ deliveryOrderPacker }) => deliveryOrderPacker.deliveryOrder)
      const listItem = yield select(({ deliveryOrderPacker }) => deliveryOrderPacker.listItem)
      yield put({
        type: 'saveDeliveryOrderCart',
        payload: {
          transNo: deliveryOrder.transNo,
          listItem: listItem.filter(filtered => filtered.time !== time)
        }
      })
    },

    * addItemByBarcode ({ payload = {} }, { select, put }) {
      const { orderQty, barcode } = payload
      const deliveryOrder = yield select(({ deliveryOrderPacker }) => deliveryOrderPacker.deliveryOrder)
      const listTransferOutHistory = yield select(({ deliveryOrderPacker }) => deliveryOrderPacker.listTransferOutHistory)
      const listItem = yield select(({ deliveryOrderPacker }) => deliveryOrderPacker.listItem)
      if (deliveryOrder && deliveryOrder.id) {
        const { deliveryOrderDetail } = deliveryOrder
        const filteredDeliveryOrderDetail = deliveryOrderDetail.filter(filtered => filtered.barCode01 === barcode)
        if (filteredDeliveryOrderDetail && filteredDeliveryOrderDetail[0]) {
          let currentListItem = [
            {
              time: new Date().valueOf(),
              ...filteredDeliveryOrderDetail[0],
              orderQty
            }
          ]
          currentListItem = currentListItem.concat(listItem)
          let totalRequestPerProduct = 0
          if (deliveryOrder && deliveryOrder.deliveryOrderDetail && deliveryOrder.deliveryOrderDetail.length > 0) {
            totalRequestPerProduct = deliveryOrder.deliveryOrderDetail
              .filter(filtered => filtered.barCode01 === barcode)
              .reduce((prev, next) => prev + next.qty, 0)
          }
          const totalCartPerProduct = currentListItem
            .filter(filtered => filtered.barCode01 === barcode)
            .reduce((prev, next) => prev + next.orderQty, 0)
          const totalHistory = listTransferOutHistory && listTransferOutHistory.length > 0
            ? listTransferOutHistory.filter(filtered => filtered.barCode01 === barcode)
              .reduce((prev, next) => prev + next.qty, 0) : 0
          if ((totalCartPerProduct + totalHistory) > totalRequestPerProduct) {
            Modal.error({
              title: 'Qty is over request',
              content: 'Please check your item request'
            })
            return
          }
          yield put({
            type: 'saveDeliveryOrderCart',
            payload: {
              transNo: deliveryOrder.transNo,
              listItem: currentListItem
            }
          })
        } else {
          Modal.error({
            title: 'Product Not Found',
            content: 'This product is not in this delivery order'
          })
        }
      }
    },

    * queryDetail ({ payload = {} }, { call, put }) {
      const response = yield call(queryDetail, payload)
      if (!navigator.onLine) {
        const deliveryOrder = yield call(deliveryOrderStorage.load, { transNo: response.data.transNo })
        if (deliveryOrder.id) {
          yield put({
            type: 'updateState',
            payload: {
              deliveryOrder
            }
          })
        }
      }
      if (response.success && response.data && response.data.id) {
        const responsePouch = yield call(deliveryOrderStorage.saveLocal, response.data)
        if (responsePouch && responsePouch.ok) {
          const deliveryOrder = yield call(deliveryOrderStorage.load, { transNo: response.data.transNo })
          // TODO insert into pouchdb
          yield put({
            type: 'loadDeliveryOrderCart',
            payload: {
              transNo: deliveryOrder.transNo
            }
          })
          deliveryOrder.deliveryOrderDetail = deliveryOrder.deliveryOrderDetail.map((item, index) => ({ ...item, no: index + 1 }))
          yield put({
            type: 'updateState',
            payload: {
              deliveryOrder
            }
          })
        }
      } else {
        const deliveryOrder = yield call(deliveryOrderStorage.load, { transNo: response.data.transNo })
        if (deliveryOrder.id) {
          yield put({
            type: 'loadDeliveryOrderCart',
            payload: {
              transNo: deliveryOrder.transNo
            }
          })
          deliveryOrder.deliveryOrderDetail = deliveryOrder.deliveryOrderDetail.map((item, index) => ({ ...item, no: index + 1 }))
          yield put({
            type: 'updateState',
            payload: {
              deliveryOrder
            }
          })
        }
        throw response
      }
    },

    * submitTransferOut ({ payload = {} }, { select, call, put }) {
      const { boxNumber, totalColly = 1 } = payload
      const deliveryOrder = yield select(({ deliveryOrderPacker }) => deliveryOrderPacker.deliveryOrder)
      yield put({
        type: 'deliveryOrderPacker/groupingDeliveryOrderCart'
      })
      const listItemResponse = yield call(deliveryOrderCartStorage.load, {
        transNo: deliveryOrder.transNo
      })
      let listItem = listItemResponse && listItemResponse.listItem ? listItemResponse.listItem : []
      listItem = listItem.map((item, index) => ({ ...item, no: listItem.length - index }))

      const response = yield call(submitTransferOut, {
        transNo: deliveryOrder.transNo,
        storeId: deliveryOrder.storeId,
        data: {
          deliveryOrder: 0,
          deliveryOrderId: deliveryOrder.id,
          deliveryOrderNo: deliveryOrder.transNo,
          boxNumber,
          employeeId: 1,
          storeId: deliveryOrder.storeId,
          storeIdReceiver: deliveryOrder.storeIdReceiver,
          totalColly,
          transNo: deliveryOrder.transNo,
          transType: 'MUOUT'
        },
        detail: listItem.map((item) => {
          return ({
            no: item.no,
            productId: item.productId,
            productCode: item.productCode,
            productName: item.productName,
            transType: 'MUOUT',
            qty: item.orderQty,
            description: null
          })
        })
      })
      if (response.success) {
        message.success('Success generate Transfer Out')
        yield put({
          type: 'deliveryOrderPacker/deleteDeliveryOrderCart'
        })
        yield put({
          type: 'deliveryOrderPacker/updateState',
          payload: {
            modalBoxNumberVisible: false
          }
        })
        if (response.data && response.data.transNo) {
          window.open(`/inventory/transfer/out/${encodeURIComponent(response.data.transNo)}`, '_blank')
        }
      } else {
        // throw response
        error(response)
        if (response && typeof response.message === 'object') {
          stockMinusAlert(response.message)
        }
      }
    },

    * showBoxNumberModal ({ payload = {} }, { call, put }) {
      const { detail } = payload
      let latestBoxNumber = 1
      if (detail && detail.id) {
        const response = yield call(queryLov, { deliveryOrderId: detail.id, pageSize: 1 })
        try {
          if (response.success && response.data && response.data.length > 0) {
            if (response.data && response.data.length > 0) {
              latestBoxNumber = response.data[response.data.length - 1].boxNumber
            }
          }
        } catch (error) {
          console.log('Not found latestBoxNumber')
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          latestBoxNumber,
          modalBoxNumberVisible: true
        }
      })
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
