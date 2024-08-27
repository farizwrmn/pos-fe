import modelExtend from 'dva-model-extend'
import { query, queryById, queryProductByCode, queryBundleByCode } from 'services/transaction/posCustomerOrder'
import { pageModel } from 'models/common'
import { query as queryStorePrice } from 'services/storePrice/stockExtraPriceStore'
import { directPrinting } from 'services/payment'
import moment from 'moment'
import lstorage from 'utils/lstorage'
import { Modal } from 'antd'
import { TYPE_PEMBELIAN_UMUM } from '../../utils/variable'
import pesananDiterima from '../../../public/mp3/diterima_orderan.mp3'

export default modelExtend(pageModel, {
  namespace: 'posCashierOrder',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    list: [],
    orders: [],
    orderDetail: { data: [], detail: {} },
    pagination: {
      current: 1
    },
    printStatuses: {}
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, ...other } = location.query
        const { pathname } = location
        if (pathname === '/master/account') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') dispatch({ type: 'query', payload: other })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const response = yield call(query, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            orders: response.data
          }
        })
      }
    },

    * playMp3 ({ payload = {} }, { call }) {
      const response = yield call(query, payload)
      if (response.success) {
        if (response.data && response.data.length > 0) {
          try {
            // eslint-disable-next-line no-undef
            const audio = new Audio(pesananDiterima)
            audio.play()
          } catch (error) {
            console.log('Error on audio', error)
          }
        }
      }
    },

    * processPayment ({ payload = {} }, { call, put }) {
      const listPaymentShortcut = lstorage.getPaymentShortcut()
      // const memberUnit = localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')) : {}
      try {
        localStorage.removeItem('cashier_trans')
        localStorage.removeItem('service_detail')
        localStorage.removeItem('consignment')
        localStorage.removeItem('payShortcutSelected')
        localStorage.removeItem('grabmartOrder')
        localStorage.removeItem('member')
        localStorage.removeItem('memberUnit')
        localStorage.removeItem('mechanic')
        localStorage.removeItem('lastMeter')
        localStorage.removeItem('workorder')
        localStorage.removeItem('woNumber')
        localStorage.removeItem('voucher_list')
        lstorage.removeQrisImage()
        lstorage.removeDynamicQrisImage()
        lstorage.removeQrisMerchantTradeNo()
        lstorage.removeDynamicQrisPosTransId()
        lstorage.removeDynamicQrisPosTransNo()
        localStorage.removeItem('bundle_promo')
        localStorage.removeItem('payShortcutSelected')
        yield put({
          type: 'pos/querySequenceReference'
        })
        yield put({
          type: 'pos/setAllNull'
        })
        yield put({
          type: 'pospromo/setAllNull'
        })
        yield put({
          type: 'pos/setPaymentShortcut'
        })
        yield put({
          type: 'pos/getGrabmartOrder'
        })
        yield put({
          type: 'pos/setDefaultMember'
        })
        yield put({
          type: 'pos/setDefaultEmployee'
        })
        yield put({
          type: 'hidePaymentModal'
        })
        yield put({
          type: 'pos/getDynamicQrisLatestTransaction',
          payload: {
            storeId: lstorage.getCurrentUserStore()
          }
        })
      } catch (e) {
        Modal.error({
          title: 'Error, Something Went Wrong!',
          content: `Cache is not cleared correctly :${e}`
        })
      }

      localStorage.setItem('typePembelian', TYPE_PEMBELIAN_UMUM)
      localStorage.setItem('dineInTax', 0)
      yield put({
        type: 'pos/updateState',
        payload: {
          modalConfirmVisible: true,
          typePembelian: TYPE_PEMBELIAN_UMUM,
          dineInTax: 0
        }
      })

      const response = yield call(queryById, payload)
      if (response.success
        && response.data
        && response.data.length > 0
        && response.detail
        && response.detail.id) {
        lstorage.setExpressOrder({
          orderTag: response.detail.orderTag,
          firstName: response.detail.firstName,
          phoneNumber: response.detail.phoneNumber,
          orderShortNumber: response.detail.orderShortNumber,
          id: response.detail.id
        })
        const expressShortcut = listPaymentShortcut.filter(filtered => filtered.typeCode === 'KX')
        if (expressShortcut && expressShortcut[0]) {
          const selectedPaymentShortcut = expressShortcut[0]
          const dineInTax = selectedPaymentShortcut.dineInTax
          const consignmentPaymentType = selectedPaymentShortcut.consignmentPaymentType

          localStorage.setItem('dineInTax', dineInTax)
          localStorage.setItem('typePembelian', consignmentPaymentType)

          yield put({
            type: 'pos/changeDineIn',
            payload: {
              dineInTax,
              typePembelian: consignmentPaymentType,
              selectedPaymentShortcut
            }
          })

          yield put({
            type: 'pos/updateState',
            payload: {
              dineInTax,
              typePembelian: consignmentPaymentType
            }
          })

          yield put({
            type: 'pos/setPaymentShortcut',
            payload: {
              item: selectedPaymentShortcut
            }
          })
        }

        for (let key in response.data) {
          const product = response.data[key]
          if (product.productCode.includes('KKKPRM')) {
            // chooseBundle
            const responseBundle = yield call(queryBundleByCode, product)
            if (responseBundle.success && responseBundle.data) {
              yield put({
                type: 'pospromo/addPosPromo',
                payload: {
                  bundleId: responseBundle.data.id,
                  currentBundle: lstorage.getBundleTrans(),
                  currentProduct: lstorage.getCashierTrans(),
                  currentService: lstorage.getServiceTrans()
                }
              })
            }
          } else {
            // chooseProduct
            const responseProduct = yield call(queryProductByCode, product)
            console.log('responseProduct', responseProduct)
            if (responseProduct.success && responseProduct.data) {
              const listStorePrice = yield call(queryStorePrice, {
                productId: responseProduct.data.id,
                storeId: lstorage.getCurrentUserStore()
              })
              if (listStorePrice && listStorePrice.success) {
                responseProduct.data.storePrice = listStorePrice.data
              }
              yield put({
                type: 'pos/chooseProduct',
                payload: {
                  item: responseProduct.data,
                  qty: product.qty,
                  type: 'barcode'
                }
              })
            }
          }
        }
        console.log('response', response)
      } else {
        throw response
      }
    },

    * orderDetail ({ payload = {} }, { call, put }) {
      const response = yield call(queryById, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            orderDetail: response
          }
        })
      }
    },

    * printInvoice ({ payload = {} }, { call, put, select }) {
      const response = yield call(queryById, payload)
      console.log('response', response)
      let listDetail = []

      const printStatuses = yield select(state => state.posCashierOrder.printStatuses)
      const isPrinted = printStatuses[response.detail.transNo] ? printStatuses[response.detail.transNo] : false

      for (let key in response.data) {
        const item = response.data[key]
        listDetail = listDetail.concat([
          {
            alignment: 'two', style: 'subtitle', text: item.productName, rightText: ''
          },
          {
            alignment: 'two', style: 'subtitle', text: item.productCode, rightText: ''
          }
        ])
        if (item.memo != null && item.memo !== '') {
          const listMemo = item.memo.split(';')
          for (let keyMemo in listMemo) {
            listDetail = listDetail.concat([
              {
                alignment: 'two', style: 'subtitle', text: `${listMemo[keyMemo]}`.trim(), rightText: ''
              }
            ])
          }
        }
        listDetail = listDetail.concat([
          {
            alignment: 'two', style: 'subtitle', text: `Qty: ${item.qty}`, rightText: ''
          },
          {
            alignment: 'line', text: ''
          }
        ])
      }

      const printStatus = isPrinted ? 'Copy' : ''

      yield put({
        type: 'directPrinting',
        payload: {
          url: 'http://localhost:8080/api/message?printerName=EXPRESS&paperWidth=58',
          data: ([
            {
              alignment: 'two', style: 'subtitle', text: '', rightText: ''
            },
            {
              style: 'title', alignment: 'left', text: 'K3EXPRESS'
            }
          ]).concat(printStatus !== '' ? [{
            alignment: 'left', style: 'title', text: `${printStatus}`
          }] : []).concat([
            {
              alignment: 'line', text: ''
            },
            {
              alignment: 'two', style: 'subtitle', text: `No: ${response.detail.transNo}`, rightText: ''
            },
            {
              alignment: 'two', style: 'subtitle', text: `Date: ${moment(response.detail.createdAt).format('YYYY-MM-DD, HH:mm')}`, rightText: ''
            },
            {
              alignment: 'two', style: 'subtitle', text: `Note: ${response.detail.addressName}`, rightText: ''
            },
            {
              alignment: 'line', text: ''
            },
            {
              alignment: 'two', style: 'subtitle', text: 'Item', rightText: ''
            },
            {
              alignment: 'line', text: ''
            }
          ]).concat(listDetail).concat([
            {
              alignment: 'two', style: 'subtitle', text: `Total: ${response.data.reduce((prev, next) => prev + next.qty, 0)}`, rightText: ''
            }])
            .concat(response.detail.orderShortNumber && response.detail.orderShortNumber !== '' ? [{
              style: 'title', alignment: 'center', text: response.detail.orderShortNumber
            }] : [])
            .concat(response.detail.firstName && response.detail.firstName !== '' ? [{
              style: 'subtitle', alignment: 'left', text: `Customer: ${response.detail.firstName}`
            }] : [])
            .concat(response.detail.phoneNumber && response.detail.phoneNumber !== '' ? [{
              style: 'subtitle', alignment: 'left', text: `Phone Number: ${response.detail.phoneNumber}`
            }] : [])
            .concat(response.detail.orderTag && response.detail.orderTag !== '' ? [{
              style: 'subtitle', alignment: 'left', text: `Tag No: ${response.detail.orderTag}`
            }] : [])
        }
      })

      if (!isPrinted) {
        yield put({
          type: 'updatePrintStatus',
          payload: {
            transNo: response.detail.transNo,
            isPrinted: true
          }
        })
      }
    },

    * directPrinting ({ payload }, { call }) {
      try {
        console.log('directPrinting', payload)
        yield call(directPrinting, payload)
      } catch (error) {
        throw error
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
    },

    resetOrderDetail (state) {
      return {
        ...state,
        orderDetail: {
          data: [],
          detail: {}
        }
      }
    },

    updatePrintStatus (state, { payload }) {
      return {
        ...state,
        printStatuses: {
          ...state.printStatuses,
          [payload.transNo]: payload.isPrinted
        }
      }
    }
  }
})
