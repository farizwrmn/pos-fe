import * as cashierService from '../services/payment'
import * as cashierTransService from '../services/cashier'
import * as creditChargeService from '../services/creditCharge'

import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { Modal } from 'antd'

const { queryLastTransNo, create } = cashierService
const { updateCashierTrans } = cashierTransService
const { listCreditCharge, getCreditCharge } = creditChargeService

export default {

  namespace: 'payment',
  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    isMotion: localStorage.getItem('antdAdminUserIsMotion') === 'true',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Records`,
      current: 1,
      total: null,
    },
    grandTotal: 0,
    creditCardNo: '',
    creditCardTotal: 0,
    creditCharge: 0,
    creditChargeAmount: 0,
    netto: 0,
    totalPayment: 0,
    totalChange: 0,
    lastTransNo: '',
    posMessage: '',
    modalCreditVisible: false,
    listCreditCharge: [],
    creditCardType: '',
  },

  subscriptions: {

  },


  effects: {
    *create ({ payload }, { call, put }) {
      var manualFormat = '000000'
      var curTransNo = '000001'
      var transNo

      const data = yield call(queryLastTransNo, payload.periode)
      let newData = data.transNo

      if ( data.success ) {

        if ( newData.transNo == null ) {
          transNo = 'GI' + payload.transDate + curTransNo
        }
        else {
          transNo = 'GI' + payload.transDate + manualFormat.substr(1, (6 - (parseInt(newData.transNo) + 1).toString().length)) + (parseInt(newData.transNo) + 1)
        }

        var detailPOS
        var arrayProd = []

        const dataPos = JSON.parse(localStorage.getItem('cashier_trans'))

        for (var key in dataPos) {
          arrayProd.push({
            'transNo': transNo,
            'productId': dataPos[key].barcode,
            'productName': dataPos[key].name,
            'qty': dataPos[key].qty,
            'sellingPrice': dataPos[key].price,
            'discount': dataPos[key].discount,
            'disc1': dataPos[key].disc1,
            'disc2': dataPos[key].disc2,
            'disc3': dataPos[key].disc3,
            'total': dataPos[key].total
          })
        }

        detailPOS = {"dataPos": arrayProd,
          "transNo": transNo,
          "memberCode": payload.memberCode,
          "technicianId": payload.technicianId,
          "cashierNo": payload.curCashierNo,
          "cashierId": payload.cashierId,
          "shift": payload.curShift,
          "transDate": payload.transDate2,
          "transTime": payload.transTime,
          "total": payload.grandTotal,
          "creditCardNo": payload.creditCardNo,
          "creditCardType": payload.creditCardType,
          "creditCardCharge": payload.creditCardCharge,
          "totalCreditCard": payload.totalCreditCard,
          "discount": payload.totalDiscount,
          "rounding": payload.rounding,
          "paid": payload.totalPayment,
          "change": payload.totalChange}

        //console.log(JSON.stringify(detailPOS))

        const data_create = yield call(create, detailPOS)

        if (data_create.success) {
          const data_cashier_trans_update = yield call(updateCashierTrans, {"total": (parseInt(payload.grandTotal) - parseInt(payload.totalDiscount) + parseInt(payload.rounding)),
                                                                            "totalCreditCard": payload.totalCreditCard,
                                                                            "status": "O",
                                                                            "cashierNo": payload.curCashierNo,
                                                                            "shift": payload.curShift,
                                                                            "transDate": payload.transDate2,})

          if ( data_cashier_trans_update.success ) {
            yield put({
              type: 'successPost',
              payload: {
                posMessage: 'Data has been saved',
              },
            })

            yield put({ type: 'stock/setAllNull' })

            const modal = Modal.info({
              title: 'Information',
              content: 'Transaction has been saved...!',
            })

            setTimeout(() => modal.destroy(), 1000)

            yield put(routerRedux.push('/cashier'))
          }

        } else {
          Modal.error({
            title: 'Error Saving Payment',
            content: 'Your Data not saved, please contact your IT Support',
          })

          //throw data_create
        }
      }
    },

    *listCreditCharge ({ payload }, {put, call}) {
      const data = yield call(listCreditCharge, payload)
      let newData = data.creditCharges

      let DICT_FIXED = (function () {
        let fixed = []
        for (let id in newData) {
          if ({}.hasOwnProperty.call(newData, id)) {
            fixed.push({
              value: newData[id].creditCode,
              label: newData[id].creditDesc,
            })
          }
        }

        return fixed
      }())

      if (data.success) {
        yield put({
          type: 'listSuccess',
          payload: {
            listCreditCharge: DICT_FIXED,
          },
        })
      }
    },

    *getCreditCharge ({ payload }, { call, put }) {
      const data = yield call(getCreditCharge, payload.creditCode)
      let newData = data.creditCharges

      if ( data.success ) {
        yield put({
          type: 'getCreditChargeSuccess',
          payload: {
            creditCharge: newData.creditCharge,
            netto: payload.netto,
            creditCardType: payload.creditCode,
          },
        })
      }
      else {
        throw data
      }
    },
  },

  reducers: {
    successPost (state, action) {
      const { posMessage } = action.payload
      localStorage.removeItem('cashier_trans')
      return { ...state,
        posMessage: posMessage,
        totalPayment: 0,
        totalChange: 0,
        lastTransNo: '',
        inputPayment: '',
        creditCardTotal: 0,
        creditCharge: 0,
        creditChargeAmount: 0,
        creditCardNo: 0,
        creditCardType: '',
        modalCreditVisible: false, }
    },

    listSuccess (state, action) {
      const { listCreditCharge } = action.payload
      return {
        ...state,
        listCreditCharge: listCreditCharge,
      }
    },

    getCreditChargeSuccess (state, action) {
      const { creditCharge, netto, creditCardType } = action.payload
      return {
        ...state,
        creditCharge: creditCharge,
        creditChargeAmount: (parseInt(netto) * parseInt(creditCharge)) / 100,
        creditCardTotal: (parseInt(netto) + ((parseInt(netto) * parseInt(creditCharge)) / 100)),
        creditCardType: creditCardType,
      }
    },

    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    showModal (state, action) {
      return { ...state, ...action.payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

    showCreditModal (state, action) {
      return { ...state, ...action.payload, modalCreditVisible: true }
    },

    hideCreditModal (state) {
      return { ...state, modalCreditVisible: false }
    },

    setCurTotal (state, action) {
      return { ...state,
              inputPayment: 0,
              totalPayment: 0,
              totalChange: 0 }
    },

    changePayment (state, action) {
      return { ...state,
               inputPayment: action.payload.totalPayment,
               totalPayment: action.payload.totalPayment,
               totalChange: (action.payload.totalPayment - action.payload.netto) }
    },

    setCashPaymentNull (state, action) {
      return { ...state, inputPayment: 0, totalPayment: 0, totalChange: 0}
    },

    setCreditCardPaymentNull (state, action) {
      return { ...state, creditCardTotal: 0, creditCharge: 0, creditChargeAmount: 0, creditCardNo: 0, creditCardType: '', }
    },

    setCreditCardNo (state, action) {
      return { ...state, creditCardNo: action.payload.creditCardNo, }
    }
  }
}
