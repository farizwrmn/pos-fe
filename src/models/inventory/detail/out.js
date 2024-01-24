import pathToRegexp from 'path-to-regexp'
import { Modal } from 'antd'
import { lstorage } from 'utils'
import { routerRedux } from 'dva/router'
import { queryEntryList } from 'services/payment/bankentry'
import { MUOUT } from 'utils/variable'
import { queryByTrans, queryDetail, editPrice, queryPrice, queryPriceList, postTrans, voidTrans } from '../../../services/transferStockOut'

export default {

  namespace: 'transferOutDetail',

  state: {
    itemCancel: {},
    showPrint: false,
    data: [],
    listAccounting: [],
    listDetail: [],
    listAmount: [],
    listPaymentOpts: [],
    modalVisible: false,
    disableConfirm: false,
    modalCancelVisible: false,
    modalEditVisible: false,
    currentItem: {}
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { deliveryOrderNo } = location.query
        const match = pathToRegexp('/inventory/transfer/out/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'transferOutDetail/updateState',
            payload: {
              showPrint: false
            }
          })
          if (deliveryOrderNo) {
            dispatch({
              type: 'queryDetail',
              payload: {
                deliveryOrderNo,
                storeId: lstorage.getCurrentUserStore()
              }
            })
          } else {
            dispatch({
              type: 'queryDetail',
              payload: {
                transNo: decodeURIComponent(match[1]),
                storeId: lstorage.getCurrentUserStore()
              }
            })
          }
        }
      })
    }
  },

  effects: {
    * editTrans ({ payload }, { call, put }) {
      const response = yield call(queryPriceList, {
        storeId: payload.data.storeId,
        transNo: payload.data.transNo
      })
      if (response.success && response.data && response.data[0]) {
        for (let key in response.data) {
          const item = response.data[key]
          const filteredPrice = response.data
            // eslint-disable-next-line eqeqeq
            .filter(filtered => filtered.productId == item.productId)
          const filteredLatest = response.price
            // eslint-disable-next-line eqeqeq
            .filter(filtered => filtered.productId == item.productId)
          let masterCostPrice = 0
          const masterProduct = response.product
            // eslint-disable-next-line eqeqeq
            .filter(filtered => filtered.id == item.productId)
          if (masterProduct && masterProduct[0]) {
            masterCostPrice = masterProduct[0].costPrice
          }

          yield put({
            type: 'transferOutDetail/editPrice',
            payload: {
              data: {
                storeId: item.storeId,
                transNo: item.transNo,
                productId: item.productId,
                purchasePrice: item && item.qty && item.qty > 0 && filteredPrice && filteredPrice[0]
                  ? (filteredPrice[0].purchasePrice > 0 ? Math.ceil(filteredPrice[0].purchasePrice) : masterCostPrice) : 0,
                latestPrice: filteredLatest && filteredLatest[0] ? Math.ceil(filteredLatest[0].purchasePrice) : 0
              },
              break: true
            }
          })
        }
        if (payload.data && payload.data.deliveryOrderNo) {
          yield put({
            type: 'queryDetail',
            payload: {
              deliveryOrderNo: payload.data.deliveryOrderNo,
              storeId: response.data[0].storeId
            }
          })
        } else {
          yield put({
            type: 'queryDetail',
            payload: {
              transNo: response.data[0].transNo,
              storeId: response.data[0].storeId
            }
          })
        }
      }
    },

    * editListPrice ({ payload }, { call, put }) {
      const response = yield call(queryPrice, {
        storeId: payload.currentItem.storeId,
        transNo: payload.currentItem.transNo,
        productId: payload.currentItem.productId
      })
      if (response && response.success && response.data) {
        const newCurrentItem = {
          ...payload.currentItem,
          purchasePrice: response.data.purchasePrice
        }
        yield put({
          type: 'updateState',
          payload: {
            currentItem: newCurrentItem,
            modalEditVisible: true
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload
        })
      }
    },

    * postTrans ({ payload }, { call, put }) {
      const response = yield call(postTrans, payload.data)
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            modalEditVisible: false,
            currentItem: {}
          }
        })
        if (payload.data && payload.data.deliveryOrderNo) {
          yield put({
            type: 'queryDetail',
            payload: {
              deliveryOrderNo: payload.data.deliveryOrderNo,
              storeId: payload.data.storeId
            }
          })
        } else {
          yield put({
            type: 'queryDetail',
            payload: {
              transNo: payload.data.transNo,
              storeId: payload.data.storeId
            }
          })
        }
        if (payload.resetFields) payload.resetFields()
      } else {
        throw response
      }
    },

    * editPrice ({ payload }, { call, put }) {
      if (!payload.data.latestPrice) {
        payload.data.latestPrice = 0
      }
      const response = yield call(editPrice, payload.data)
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            modalEditVisible: false,
            currentItem: {}
          }
        })
        if (payload.break) {
          return
        }
        if (payload.data && payload.data.deliveryOrderNo) {
          yield put({
            type: 'queryDetail',
            payload: {
              deliveryOrderNo: payload.data.deliveryOrderNo,
              storeId: payload.data.storeId
            }
          })
        } else {
          yield put({
            type: 'queryDetail',
            payload: {
              transNo: payload.data.transNo,
              storeId: payload.data.storeId
            }
          })
        }
        if (payload.resetFields) payload.resetFields()
      } else {
        throw response
      }
    },

    * queryDetail ({ payload }, { call, put }) {
      payload.storeId = lstorage.getCurrentUserStore()
      const invoiceInfo = yield call(queryByTrans, payload)
      const data = yield call(queryDetail, payload)
      const dataInvoice = []
      const dataDetail = []
      dataInvoice.push(invoiceInfo.mutasi)

      if (invoiceInfo.mutasi) {
        for (let n = 0; n < data.mutasi.length; n += 1) {
          dataDetail.push({
            no: n + 1,
            id: data.mutasi[n].id,
            storeId: data.mutasi[n].storeId,
            transNo: data.mutasi[n].transNo,
            productId: data.mutasi[n].productId,
            productCode: data.mutasi[n].productCode,
            productName: data.mutasi[n].productName,
            qty: data.mutasi[n].qty,
            latestPrice: data.mutasi[n].latestPrice,
            purchasePrice: data.mutasi[n].purchasePrice
          })
        }
        if (data.success) {
          let listAccounting = []
          const reconData = yield call(queryEntryList, {
            transactionId: invoiceInfo.mutasi.id,
            transactionType: MUOUT,
            type: 'all'
          })
          if (reconData && reconData.data) {
            listAccounting = listAccounting.concat(reconData.data)
          }
          yield put({
            type: 'querySuccess',
            payload: {
              data: dataInvoice
            }
          })
          yield put({
            type: 'updateState',
            payload: {
              listDetail: dataDetail,
              listAccounting
            }
          })
        }
      } else {
        Modal.warning({
          title: 'Something went wrong',
          content: 'data is not found'
        })
        yield put(routerRedux.push('/inventory/transfer/out'))
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
        yield put(routerRedux.push('/inventory/transfer/out'))
        Modal.info({
          title: 'Transaction has been canceled'
        })
      } else {
        Modal.warning({
          title: 'Something went wrong',
          content: data.message
        })
        yield put({
          type: 'updateState',
          payload: {
            disableConfirm: false
          }
        })
        throw data
      }
    }
  },

  reducers: {
    querySuccess (state, { payload }) {
      const { data } = payload
      return {
        ...state,
        data
      }
    },
    updateState (state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
