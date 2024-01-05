import modelExtend from 'dva-model-extend'
import { queryDetail } from 'services/deliveryOrder/deliveryOrderPacker'
import deliveryOrderStorage from 'utils/storage/deliveryOrder'
import deliveryOrderCartStorage from 'utils/storage/deliveryOrderCart'
import { lstorage } from 'utils'
import { Modal } from 'antd'
import { pageModel } from 'models/common'
import pathToRegexp from 'path-to-regexp'

export default modelExtend(pageModel, {
  namespace: 'deliveryOrderPacker',

  state: {
    currentItem: {},
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
    * addItemByBarcode ({ payload = {} }, { select, put }) {
      const { qty, barcode } = payload
      const deliveryOrder = yield select(({ deliveryOrderPacker }) => deliveryOrderPacker.deliveryOrder)
      const listItem = yield select(({ deliveryOrderPacker }) => deliveryOrderPacker.listItem)
      if (deliveryOrder && deliveryOrder.id) {
        const { deliveryOrderDetail } = deliveryOrder
        const filteredDeliveryOrderDetail = deliveryOrderDetail.filter(filtered => filtered.barCode01 === barcode)
        if (filteredDeliveryOrderDetail && filteredDeliveryOrderDetail[0]) {
          let currentListItem = [
            {
              time: new Date().valueOf(),
              ...filteredDeliveryOrderDetail[0],
              qty
            }
          ]
          currentListItem = currentListItem.concat(listItem)
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
