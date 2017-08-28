import * as cashierService from '../services/payment'
import * as cashierTransService from '../services/cashier'
import * as creditChargeService from '../services/creditCharge'
import { editPoint as updateMemberPoint} from '../services/customers'

import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { Modal } from 'antd'
import moment from 'moment'
const { queryLastTransNo, create, createDetail } = cashierService
const { updateCashierTrans, createCashierTrans, getCashierNo } = cashierTransService
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
    lastMeter: 0,
    modalCreditVisible: false,
    listCreditCharge: [],
    creditCardType: '',
    policeNo: '',
  },

  subscriptions: {

  },
//confirm payment

  effects: {
    *create ({ payload }, { call, put }) {
      var datatrans
      var dataLast
      console.log('payload');
      function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
      }
      var data = yield call(queryLastTransNo, payload.periode)

      console.log('data', data)
      datatrans= [`FJ${moment().format('MMYY')}0000`]

      let newData = datatrans
      if (data.data.length > 0){
        dataLast = data.data
      }
      else {
        dataLast = datatrans
      }

      var parseTransNo = dataLast.reduce(function(prev, current) {
          return (prev.transNo > current.transNo) ? prev : current
      })

      // var dataCodeMember = yield call(queryCode, payload.memberCode)
      // console.log('dataCodeMember.member.point', dataCodeMember.data.point);
      // const pointTotal = parseInt(payload.point) + parseInt(dataCodeMember.data.point)
      // console.log('dataCodeMember', dataCodeMember, 'pointTotal', pointTotal)
      // yield call(updateMembers, {id: payload.memberCode, point: pointTotal})

      var lastNo = parseTransNo.transNo ? parseTransNo.transNo : parseTransNo
      lastNo = lastNo.replace(/[^a-z0-9]/gi,'')
      console.log(lastNo)
      var newMonth = lastNo.substr(2,4)
      var lastTransNo = lastNo.substr(lastNo.length - 4)
      var sendTransNo = parseInt(lastTransNo) + 1
      var padding = pad(sendTransNo,4)




      if ( data.success ) {
        if (newMonth==`${moment().format('MMYY')}`){
          var transNo = `FJ${moment().format('MMYY')}${padding}`
        } else {
          var transNo = `FJ${moment().format('MMYY')}0001`
        }
        var arrayProd = []

        const dataPos = JSON.parse(localStorage.getItem('cashier_trans'))
        if (transNo.indexOf('FJ') > -1) {
          transNo = transNo.substring(0, 2) + '/' + transNo.substring(2,6) + '/' + transNo.substring(6,10)
        }
        console.log('transNo = ', transNo)
        for (var key in dataPos) {
          arrayProd.push({
            'transNo': transNo,
            'productId': dataPos[key].code,
            'productName': dataPos[key].name,
            'qty': dataPos[key].qty,
            'sellingPrice': dataPos[key].price,
            'discount': dataPos[key].discount,
            'disc1': dataPos[key].disc1,
            'disc2': dataPos[key].disc2,
            'disc3': dataPos[key].disc3
          })
        }

        const detailPOS = {"dataPos": arrayProd,
          "transNo": `FJ${moment().format('MMYY')}${padding}`,
          "memberCode": payload.memberCode,
          "technicianId": payload.technicianId,
          "cashierNo": payload.curCashierNo,
          "cashierId": payload.cashierId,
          "shift": payload.curShift,
          "transDate": `${moment().format('YYYYMMDD')}`,
          "transTime": payload.transTime,
          "total": payload.grandTotal,
          "lastMeter": localStorage.getItem('lastMeter') ? localStorage.getItem('lastMeter') : payload.lastMeter ? payload.lastMeter : 0,
          "creditCardNo": payload.creditCardNo,
          "creditCardType": payload.creditCardType,
          "creditCardCharge": payload.creditCardCharge,
          "totalCreditCard": payload.totalCreditCard,
          "discount": payload.totalDiscount,
          "rounding": payload.rounding,
          "paid": payload.totalPayment,
          "policeNo": localStorage.getItem('memberUnit') ? localStorage.getItem('memberUnit') : payload.policeNo,
          "change": payload.totalChange
        }
        const point = parseInt(payload.grandTotal / 10000)
        console.log('point', point)

        const data_create = yield call(create, detailPOS)
        if (data_create.success) {
          const data_cashier_trans_update = yield call(updateCashierTrans, {"total": (parseInt(payload.grandTotal) - parseInt(payload.totalDiscount) + parseInt(payload.rounding)),
                                                                            "totalCreditCard": payload.totalCreditCard,
                                                                            "status": "O",
                                                                            "cashierNo": payload.curCashierNo,
                                                                            "shift": payload.curShift,
                                                                            "transDate": payload.transDate2,})
          yield call (createDetail, { "data": arrayProd, "transNo": `FJ${moment().format('MMYY')}${padding}`})
          if ( data_cashier_trans_update.success ) {
            yield call (updateMemberPoint, { point: point, memberCode: payload.memberId })
            yield put({
              type: 'successPost',
              payload: {
                posMessage: 'Data has been saved',
              },
            })

            yield put({ type: 'pos/setAllNull' })

            const modal = Modal.info({
              title: 'Information',
              content: 'Transaction has been saved...!',
            })

            setTimeout(() => modal.destroy(), 1000)
          }

        } else {
          Modal.error({
            title: 'Error Saving Payment',
            content: 'Your Data not saved',
          })
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
      localStorage.removeItem('member')
      localStorage.removeItem('memberUnit')
      localStorage.removeItem('lastMeter')
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

    setLastMeter (state, action) {
      return { state, policeNo: action.payload.policeNo, lastMeter: action.payload.lastMeter}
    },

    setPoliceNo (state, action) {
      localStorage.setItem('memberUnit', action.payload.policeNo)
      return { state, policeNo: action.payload.policeNo}
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
