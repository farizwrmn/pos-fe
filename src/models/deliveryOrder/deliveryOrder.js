import { message } from 'antd'
import {
  query,
  queryDetail,
  queryTransferOut,
  getAutoReplenishRawId,
  finish,
  add,
  remove,
  edit,
  printListDeliveryOrder
} from 'services/deliveryOrder/deliveryOrder'
import { queryHeader } from 'services/transfer/autoReplenishSubmission'
import moment from 'moment'
import { queryLov } from 'services/transferStockOut'
import { directPrinting } from 'services/master/paymentOption/paymentCostService'
import { lstorage } from 'utils'
import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'

const success = () => {
  message.success('Success')
}

export default {
  namespace: 'deliveryOrder',

  state: {
    list: [],
    listAllProduct: [],
    modalBoxNumberVisible: false,
    latestBoxNumber: 1,
    listTransferOut: [],
    activeKey: '0',
    currentItem: {},
    modalVisible: false,
    modalEditVisible: false,
    show: false,
    checked: false,
    modalType: 'add',
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
      showSizeChanger: true
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname, query } = location
        const { storeIdReceiver } = query

        if (pathname === '/delivery-order') {
          dispatch({
            type: 'query',
            payload: {
              type: 'all',
              storeId: lstorage.getCurrentUserStore(),
              storeIdReceiver
              // relationship: 1
              // page,
              // pageSize,
              // q: null
            }
          })
        }
        const match = pathToRegexp('/delivery-order-detail/:id').exec(location.pathname)
          || pathToRegexp('/delivery-order-packer/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryDetail',
            payload: {
              id: decodeURIComponent(match[1])
            }
          })

          dispatch({
            type: 'queryTransferOut',
            payload: {
              active: 1,
              deliveryOrderId: decodeURIComponent(match[1])
            }
          })
        }

        const matchAutoReplenishRoute = pathToRegexp('/inventory/transfer/auto-replenish-submission/:id').exec(location.pathname)
        if (matchAutoReplenishRoute) {
          dispatch({
            type: 'getAutoReplenishRawId',
            payload: {
              id: decodeURIComponent(matchAutoReplenishRoute[1])
            }
          })
          dispatch({
            type: 'printList',
            payload: {
              transId: decodeURIComponent(matchAutoReplenishRoute[1])
            }
          })
        }
      })
    }
  },

  effects: {
    * getAutoReplenishRawId ({ payload = {} }, { put, call }) {
      try {
        const response = yield call(getAutoReplenishRawId, payload)
        if (response.data) {
          yield put({
            type: 'updateState',
            payload: {
              currentItem: response.data
            }
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    * printBoxNumber ({ payload = {} }, { put }) {
      const { boxNumber, detail } = payload
      const template = [
        {
          alignment: 'two',
          text: '',
          rightText: ''
        },
        {
          alignment: 'center',
          text: 'Delivery Order',
          rightText: ''
        },
        {
          alignment: 'center',
          text: `Box: ${boxNumber}`
        },
        {
          alignment: 'center',
          text: `Ref: ${detail.transNo}`,
          rightText: ''
        },
        {
          alignment: 'center',
          text: `Description: ${detail.description}`,
          rightText: ''
        },
        {
          alignment: 'center',
          text: `Store: ${detail.storeName} ke ${detail.storeNameReceiver}`,
          rightText: ''
        },
        {
          alignment: 'center',
          text: moment().format('ddd, DD MMM YYYY'),
          rightText: ''
        }
      ]
      yield put({
        type: 'directPrinting',
        payload: template
      })
      yield put(routerRedux.push(`/delivery-order-packer/${detail.id}`))
      yield put({
        type: 'updateState',
        payload: {
          modalBoxNumberVisible: false,
          latestBoxNumber: 1
        }
      })
      // yield put(routerRedux.push)
    },
    * printList ({ payload = {} }, { put, call }) {
      try {
        const response = yield call(printListDeliveryOrder, payload)
        if (response.success) {
          yield put({
            type: 'updateState',
            payload: {
              listAllProduct: response.data
            }
          })
          if (response.data && response.data.length === 0) {
            message.warning('data empty')
          }
        } else {
          throw response
        }
      } catch (error) {
        throw error
      }
    },
    * showBoxNumberModal ({ payload }, { call, put }) {
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
    },

    * directPrinting ({ payload }, { call }) {
      try {
        yield call(directPrinting, payload)
      } catch (error) {
        throw error
      }
    },
    * switchIsChecked ({ payload = {} }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          checked: payload
        }
      })
    },
    * query ({ payload = {} }, { call, put }) {
      // type=all&status=0&active=1
      payload.type = 'all'
      payload.status = '0'
      payload.active = '1'
      const response = yield call(query, payload)
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            list: response.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: response.total
            }
          }
        })
      }
    },
    * queryDetail ({ payload = {} }, { call, put }) {
      const response = yield call(queryDetail, payload)
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: response.data
          }
        })
      }
    },
    * queryTransferOut ({ payload = {} }, { call, put }) {
      const response = yield call(queryTransferOut, payload)
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listTransferOut: response.data
          }
        })
      }
    },

    * updateAsFinished ({ payload = {} }, { call }) {
      const response = yield call(finish, payload)
      if (response && response.success) {
        message.success('Success update as Finished')
        yield call(queryHeader, {
          storeIdReceiver: payload.storeIdReceiver,
          storeId: payload.storeId
        })
        window.close()
      } else {
        throw response
      }
    },

    * add ({ payload = {} }, { call, put }) {
      const response = yield call(add, payload)
      if (response && response.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            currentItem: response.data
          }
        })
      }
    },
    * delete ({ payload = {} }, { call, put, select }) {
      const response = yield call(remove, payload)
      const pagination = yield select(({ deliveryOrder }) => deliveryOrder.pagination)
      const { current, pageSize } = pagination
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: response.data
          }
        })
        yield put({ type: 'query', payload: { ...payload, page: current, pageSize } })
      } else {
        throw response
      }
    },
    * edit ({ payload = {} }, { call, put }) {
      const response = yield call(edit, payload)
      if (response && response.success) {
        if (payload.resetFields) {
          payload.resetFields()
        }
        success()
        yield put({
          type: 'updateState',
          payload: {
            currentItem: {},
            modalType: 'add',
            activeKey: '0'
          }
        })
        yield put({ type: 'queryByStore' })
      } else {
        message.error("can't edit data")
      }
    },
    * editItem ({ payload = {} }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          currentItem: payload,
          modalType: 'edit',
          activeKey: '0'
        }
      })
    },
    * queryByStore ({ payload = {} }, { put }) {
      payload.edit = 0
      yield put({ type: 'query', payload: { type: 'all', storeId: lstorage.getCurrentUserStore() } })
    },
    * openModal ({ payload = {} }, { put }) {
      payload.updated = 0
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: true
        }
      })
      yield put({ type: 'queryByStore' })
    },
    * closeModal ({ payload = {} }, { put }) {
      payload.updated = 0
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: false
        }
      })
    },
    * openModalEdit ({ payload = {} }, { put }) {
      payload.updated = 0
      yield put({
        type: 'updateState',
        payload: {
          modalEditVisible: true
        }
      })
    },
    * closeModalEdit ({ payload = {} }, { put }) {
      payload.updated = 0
      yield put({
        type: 'updateState',
        payload: {
          modalEditVisible: false
        }
      })
    }
  },

  reducers: {
    updateState (state, { payload }) {
      return { ...state, ...payload }
    },
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
    }
  }
}
