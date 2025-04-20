import { Modal, message } from 'antd'
import { posTotal, lstorage, isElectron, variables, alertModal } from 'utils'
import { query as queryEdc } from 'services/master/paymentOption/paymentMachineService'
import {
  query as queryCost,
  queryPosDirectPrinting,
  directPrinting
} from 'services/master/paymentOption/paymentCostService'
import {
  getDenominatorDppInclude,
  getDenominatorPPNInclude,
  getDenominatorPPNExclude
} from 'utils/tax'
import { routerRedux } from 'dva/router'
import { queryCancel as cancelDynamicQrisPayment } from 'services/payment/paymentTransactionService'
import { APPVERSION } from 'utils/config.company'
import { prefix } from 'utils/config.main'
import {
  directPrinting as directPrintingPrint,
  queryDetail,
  queryDetailConsignment,
  queryById as queryInvoiceById,
  queryPos as queryaPos
} from 'services/payment'
import { queryByCode as queryMemberCode } from 'services/master/customer'
import { queryMechanicByCode as queryMechanicCode } from 'services/master/employee'
import { query as queryOpts } from 'services/payment/paymentOptions'
import { queryPaymentInvoice } from 'services/payment/payment'
import {
  rearrangeDirectPrintingQris,
  rearrangeDirectPrinting
} from 'utils/posinvoice'
import moment from 'moment'
import { currencyFormatter, numberFormatter } from 'utils/string'
import {
  groupProduct,
  chooseOnePaymentType
} from '../routes/transaction/invoice/utils'
import * as cashierService from '../services/payment'
import * as creditChargeService from '../services/creditCharge'
import { query as querySequence } from '../services/sequence'
import { query as querySetting } from '../services/setting'
import { TYPE_PEMBELIAN_DINEIN, TYPE_PEMBELIAN_UMUM } from '../utils/variable'
import { getDateTime } from '../services/setting/time'

const { stockMinusAlert } = alertModal
const {
  getCashierTrans,
  getPosReference,
  getConsignment,
  removeQrisImage,
  setDynamicQrisImage,
  setQrisMerchantTradeNo,
  setDynamicQrisPosTransId,
  setDynamicQrisPosTransNo,
  removeDynamicQrisImage,
  removeQrisMerchantTradeNo,
  removeDynamicQrisPosTransId,
  removeDynamicQrisPosTransNo,
  setDynamicQrisTimeLimit,
  getQrisPaymentTimeLimit,
  setCurrentPaymentTransactionId,
  removeCurrentPaymentTransactionId,
  setPosLockTransaction
} = lstorage
const { getSetting } = variables

const { create } = cashierService
const { listCreditCharge, getCreditCharge } = creditChargeService

export default {
  namespace: 'payment',
  state: {
    listQueryPosDirectPrinting: [],
    currentItem: {},
    modalVisible: false,
    modalPaymentConfirmVisible: false,
    taxInfo: {},
    modalType: 'add',
    selectedRowKeys: [],
    isMotion: localStorage.getItem('antdAdminUserIsMotion') === 'true',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Records`,
      current: 1,
      total: null
    },
    numberToString: 0,
    grandTotal: 0,
    settingInvoice: {},
    creditCardNo: '',
    creditCardTotal: 0,
    typeTrans: ['C'],
    creditCharge: 0,
    creditChargeAmount: 0,
    netto: 0,
    print: '',
    company: [],
    companyInfo: {},
    lastTransNo: '',
    totalPayment: 0,
    totalChange: 0,
    posMessage: '',
    lastMeter: 0,
    modalCreditVisible: false,
    paymentModalVisible: false,
    paymentTransactionId: null,
    paymentTransactionInvoiceWindow: null,
    paymentTransactionLimitTime: null,
    listCreditCharge: [],
    listAmount: [],
    creditCardType: '',
    policeNo: '',
    itemPayment: {},
    usingWo: false,
    woNumber: localStorage.getItem('woNumber')
      ? localStorage.getItem('woNumber')
      : null
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (
          location.pathname === '/transaction/pos' ||
          location.pathname === '/transaction/pos/payment' ||
          location.pathname === '/transaction/pos/history'
        ) {
          let settingInvoice = {}
          try {
            settingInvoice = JSON.parse(getSetting('Invoice'))
          } catch (error) {
            console.warn('error settingInvoice', error)
          }
          dispatch({
            type: 'setLastTrans',
            payload: { seqCode: 'INV', type: lstorage.getCurrentUserStore() }
          }) // type diganti storeId
          dispatch({
            type: 'updateState',
            payload: {
              listAmount: [],
              itemPayment: {},
              settingInvoice
            }
          })
          dispatch({
            type: 'pos/setCurTotal'
          })
        }
      })
    }
  },
  // confirm payment

  effects: {
    * directPrinting ({ payload }, { call }) {
      try {
        yield call(directPrinting, payload)
      } catch (error) {
        throw error
      }
    },
    * queryPosDirectPrinting ({ payload }, { call, put }) {
      try {
        const data = yield call(queryPosDirectPrinting, payload)
        // direct print
        yield put({
          type: 'directPrinting',
          payload: data.data
        })
      } catch (error) {
        throw error
      }
    },
    * create ({ payload }, { select, call, put }) {
      setPosLockTransaction(true)
      const appVersion = APPVERSION
      const { curTotalPayment, curNetto } = payload
      const memberInformation = yield select(
        ({ pos }) => pos.memberInformation
      )
      const posDescription = yield select(({ pos }) => pos.posDescription)
      const typeTrans = yield select(({ payment }) => payment.typeTrans)
      if (!memberInformation || JSON.stringify(memberInformation) === '{}') {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Member Not Found...!'
        })
        setTimeout(() => modal.destroy(), 1000)
        return
      }
      if (
        memberInformation.memberPendingPayment === '1'
          ? false
          : parseInt(curTotalPayment, 0) < parseInt(curNetto, 0)
      ) {
        Modal.error({
          title: 'Payment pending restricted',
          content: 'This member type cannot allow to pending'
        })
        return
      }
      if (typeTrans.toString().length === 0) {
        Modal.warning({
          title: 'Payment method',
          content: 'Your Payment method is empty'
        })
        return
      }

      const product = getCashierTrans()
      const service = localStorage.getItem('service_detail')
        ? JSON.parse(localStorage.getItem('service_detail'))
        : []
      // const workorder = localStorage.getItem('workorder') ? JSON.parse(localStorage.getItem('workorder')) : {}
      const dataPos = product.concat(service)
      let checkProductId = false
      for (let n = 0; n < dataPos.length; n += 1) {
        if (dataPos[n].productId === 0) {
          checkProductId = true
          break
        }
      }
      if (checkProductId) {
        console.log(checkProductId)
        Modal.error({
          title: 'Payment',
          content: 'Something Wrong with Product'
        })
        return
      }

      const invoice = {
        seqCode: 'INV',
        type: lstorage.getCurrentUserStore()
      }
      const transNo = yield call(querySequence, invoice)
      const date = yield call(getDateTime, {
        id: 'timestamp'
      })
      if (date.success) {
        if (transNo.data === null) {
          Modal.error({
            title: 'Something went wrong',
            content: `Cannot read transaction number, message: ${transNo.data}`
          })
        } else if (payload.address === undefined) {
          Modal.error({
            title: 'Payment Fail',
            content: 'Address is Undefined'
          })
        } else if (payload.memberId === undefined) {
          Modal.error({
            title: 'Payment Fail',
            content: 'Member Id is Undefined'
          })
        } else if (payload.policeNo === undefined) {
          Modal.error({
            title: 'Payment Fail',
            content: 'Unit is Undefined'
          })
        } else {
          let arrayProd = []
          let reference = getPosReference()
          if (!reference) {
            Modal.error({
              title: 'Refresh the browser',
              content: 'Refresh the browser'
            })
            return
          }
          const product = getCashierTrans()
          const consignment = getConsignment()
          const consignmentTotal =
            consignment && consignment.length > 0
              ? consignment.reduce((prev, next) => prev + next.total, 0)
              : 0
          const dineInTax = localStorage.getItem('dineInTax')
            ? Number(localStorage.getItem('dineInTax'))
            : 0
          const typePembelian = localStorage.getItem('typePembelian')
            ? Number(localStorage.getItem('typePembelian'))
            : 0
          const service = localStorage.getItem('service_detail')
            ? JSON.parse(localStorage.getItem('service_detail'))
            : []
          const dataPos = product.concat(service)
          const dataBundle = localStorage.getItem('bundle_promo')
            ? JSON.parse(localStorage.getItem('bundle_promo'))
            : []
          const trans = transNo.data
          const storeId = lstorage.getCurrentUserStore()
          const companySetting = JSON.parse(
            payload.setting.Company || '{}'
          ).taxType

          // Akan di ganti variables
          for (let key = 0; key < dataPos.length; key += 1) {
            const totalPrice = ((
              (dataPos[key].price * dataPos[key].qty) * // price * qty
              (1 - (dataPos[key].disc1 / 100)) * // -disc1
              (1 - (dataPos[key].disc2 / 100)) * // -disc2
              (1 - (dataPos[key].disc3 / 100))) - // -disc3
              dataPos[key].discount) // -discount
            const dpp = totalPrice / (companySetting === 'I' ? getDenominatorDppInclude() : 1)
            const ppn = (companySetting === 'I' ? totalPrice / getDenominatorPPNInclude() : companySetting === 'S' ? totalPrice * getDenominatorPPNExclude() : 0)
            arrayProd.push({
              storeId,
              transNo: trans,
              categoryCode: dataPos[key].categoryCode,
              bundleId: dataPos[key].bundleId,
              bundleName: dataPos[key].bundleName,
              bundleCode: dataPos[key].bundleCode,
              hide: dataPos[key].hide,
              replaceable: dataPos[key].replaceable,
              employeeId: dataPos[key].employeeId,
              employeeName: dataPos[key].employeeName,
              productId: dataPos[key].productId,
              productCode: dataPos[key].code,
              productName: dataPos[key].name,
              qty: dataPos[key].qty,
              typeCode: dataPos[key].typeCode,
              oldValue: dataPos[key].oldValue,
              newValue: dataPos[key].newValue,
              retailPrice: dataPos[key].retailPrice,
              distPrice01: dataPos[key].distPrice01,
              distPrice02: dataPos[key].distPrice02,
              distPrice03: dataPos[key].distPrice03,
              distPrice04: dataPos[key].distPrice04,
              distPrice05: dataPos[key].distPrice05,
              distPrice06: dataPos[key].distPrice06,
              distPrice07: dataPos[key].distPrice07,
              distPrice08: dataPos[key].distPrice08,
              distPrice09: dataPos[key].distPrice09,
              sellingPrice: dataPos[key].price,
              DPP: dpp,
              PPN: ppn,
              discount: dataPos[key].discount,
              disc1: dataPos[key].disc1,
              disc2: dataPos[key].disc2,
              disc3: dataPos[key].disc3,
              totalPrice
            })
          }
          const grandTotal = arrayProd.reduce(
            (cnt, o) => cnt + o.totalPrice,
            0
          )
          const newArrayProd = arrayProd.map((x) => {
            const portion = x.totalPrice / grandTotal
            const discountLoyalty = portion * (payload.useLoyalty || 0)
            const totalPrice = x.totalPrice - discountLoyalty
            const dpp =
              totalPrice /
              (companySetting === 'I' ? getDenominatorDppInclude() : 1)
            const ppn =
              companySetting === 'I'
                ? totalPrice / getDenominatorPPNInclude()
                : companySetting === 'S'
                  ? totalPrice * getDenominatorPPNExclude()
                  : 0
            return {
              storeId: x.storeId,
              transNo: x.transNo,
              categoryCode: x.categoryCode,
              bundleId: x.bundleId,
              bundleCode: x.bundleCode,
              bundleName: x.bundleName,
              hide: x.hide,
              replaceable: x.replaceable,
              employeeId: x.employeeId,
              employeeName: x.employeeName,
              productId: x.productId,
              productCode: x.productCode,
              productName: x.productName,
              oldValue: x.oldValue,
              newValue: x.newValue,
              retailPrice: x.retailPrice,
              distPrice01: x.distPrice01,
              distPrice02: x.distPrice02,
              distPrice03: x.distPrice03,
              distPrice04: x.distPrice04,
              distPrice05: x.distPrice05,
              distPrice06: x.distPrice06,
              distPrice07: x.distPrice07,
              distPrice08: x.distPrice08,
              distPrice09: x.distPrice09,
              qty: x.qty,
              typeCode: x.typeCode,
              sellPrice: x.sellPrice,
              sellingPrice: x.sellingPrice,
              DPP: dpp,
              PPN: ppn,
              discountLoyalty: discountLoyalty || 0,
              discount: x.discount,
              disc1: x.disc1,
              disc2: x.disc2,
              disc3: x.disc3,
              totalPrice
            }
          })
          const dineIn = (grandTotal + consignmentTotal) * (dineInTax / 100)
          let selectedPaymentShortcut = lstorage.getPaymentShortcutSelected()
          let expressOrderId = null
          let orderShortNumber = null
          if (payload.memberCode !== null) {
            if (payload.listAmount && payload.listAmount.length > 0) {
              const filterExpress = payload.listAmount.filter(
                filtered => filtered.typeCode === 'KX' && filtered.cardNo
              )
              if (filterExpress && filterExpress[0]) {
                const currentExpressOrder = lstorage.getExpressOrder()
                if (currentExpressOrder) {
                  expressOrderId = currentExpressOrder.id
                  orderShortNumber = currentExpressOrder.orderShortNumber
                }
              }
            }
            const detailPOS = {
              reference,
              description: posDescription,
              dataPos: newArrayProd,
              expressOrderId,
              orderShortNumber,
              dataConsignment: consignment,
              dataBundle,
              appVersion,
              orderType:
                selectedPaymentShortcut && selectedPaymentShortcut.shortcutName
                  ? selectedPaymentShortcut.shortcutName
                  : 'Take Away',
              grabOrder: lstorage.getGrabmartOrder(),
              transNo: trans,
              taxType: companySetting,
              taxInvoiceNo: payload.taxInfo.taxInvoiceNo,
              taxDate: payload.taxInfo.taxDate,
              storeId: lstorage.getCurrentUserStore(),
              memberCode: payload.memberCode,
              discountLoyalty: payload.useLoyalty || 0,
              useLoyalty: payload.useLoyalty || 0,
              technicianId: payload.technicianId,
              transTime: payload.transTime,
              total: payload.grandTotal,
              dineInTax: dineIn,
              typePembelian:
                dineInTax === 10
                  ? TYPE_PEMBELIAN_DINEIN
                  : dineInTax === 0
                    ? typePembelian
                    : TYPE_PEMBELIAN_UMUM,
              lastMeter: localStorage.getItem('lastMeter')
                ? JSON.parse(localStorage.getItem('lastMeter')) || 0
                : 0,
              creditCardNo: payload.creditCardNo,
              creditCardType: payload.creditCardType,
              creditCardCharge: payload.creditCardCharge,
              totalCreditCard: payload.totalCreditCard,
              discount: payload.totalDiscount,
              rounding: payload.rounding,
              paid: payload.totalPayment,
              woId: localStorage.getItem('workorder')
                ? JSON.parse(localStorage.getItem('workorder')).id
                : null,
              paymentVia: payload.paymentVia,
              policeNo: localStorage.getItem('memberUnit')
                ? JSON.parse(localStorage.getItem('memberUnit')).policeNo
                : null,
              policeNoId: localStorage.getItem('memberUnit')
                ? JSON.parse(localStorage.getItem('memberUnit')).id
                : null,
              change: payload.totalChange,
              woReference: payload.woNumber,
              listAmount: payload.listAmount
            }
            yield put({
              type: 'pos/updateState',
              payload: {
                lockTransaction: true
              }
            })
            const data_create = yield call(create, detailPOS)
            if (data_create.success) {
              setPosLockTransaction(false)
              yield put({
                type: 'pos/unlockTransaction',
                payload: {}
              })
              const responsInsertPos = data_create.pos
              // const memberUnit = localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')) : {}
              try {
                localStorage.removeItem('cashier_trans')
                localStorage.removeItem('service_detail')
                localStorage.removeItem('consignment')
                localStorage.removeItem('payShortcutSelected')
                localStorage.removeItem('grabmartOrder')
                localStorage.removeItem('expressOrder')
                yield localStorage.removeItem('member')
                yield localStorage.removeItem('memberUnit')
                yield localStorage.removeItem('mechanic')
                localStorage.removeItem('lastMeter')
                localStorage.removeItem('workorder')
                localStorage.removeItem('woNumber')
                localStorage.removeItem('voucher_list')
                removeQrisImage()
                removeDynamicQrisImage()
                removeQrisMerchantTradeNo()
                removeDynamicQrisPosTransId()
                removeDynamicQrisPosTransNo()
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

              // yield put({
              //   type: 'printPayment',
              //   payload: {
              //     periode: payload.periode,
              //     // transDate: payload.transDate,
              //     // transDate2: payload.transDate2,

              //     transTime: payload.transTime,
              //     grandTotal: payload.grandTotal,
              //     totalPayment: payload.totalPayment,
              //     transDatePrint: data_create && data_create.pos && data_create.pos.transDate ? moment(data_create.pos.transDate).format('DD-MM-YYYY') : moment().format('DD-MM-YYYY'),
              //     company: localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {},
              //     gender: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].gender : 'No Member',
              //     phone: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].phone : 'No Member',
              //     address: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].address01 : 'No Member',
              //     lastMeter: localStorage.getItem('lastMeter') ? JSON.parse(localStorage.getItem('lastMeter')) || 0 : 0,
              //     lastTransNo: trans,
              //     totalChange: payload.totalChange,
              //     unitInfo: {
              //       ...memberUnit,
              //       lastCashback: responsInsertPos.lastCashback,
              //       gettingCashback: responsInsertPos.gettingCashback,
              //       discountLoyalty: responsInsertPos.discountLoyalty
              //     },
              //     totalDiscount: payload.totalDiscount,
              //     policeNo: localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')).policeNo : payload.policeNo,
              //     rounding: payload.rounding,
              //     dataPos: getCashierTrans(),
              //     dataService: localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : [],
              //     memberCode: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].id : 'No Member',
              //     memberId: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].memberCode : 'No member',
              //     memberName: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].memberName : 'No member',
              //     employeeName: localStorage.getItem('mechanic') ? JSON.parse(localStorage.getItem('mechanic'))[0].employeeName : 'No employee',
              //     technicianId: payload.technicianId,
              //     curShift: payload.curShift,
              //     printNo: 1,
              //     companyInfo: payload.companyInfo,
              //     curCashierNo: payload.curCashierNo,
              //     cashierId: payload.cashierId,
              //     userName: payload.userName,
              //     posMessage: 'Data has been saved',
              //     type: 'POS'
              //   }
              // })
              Modal.info({
                title: 'Information',
                content: 'Transaction has been saved...!'
              })
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

              // get template
              // yield put({
              //   type: 'queryPosDirectPrinting',
              //   payload: {
              //     storeId: lstorage.getCurrentUserStore(),
              //     transNo: responsInsertPos.transNo
              //   }
              // })

              if (isElectron()) {
                yield put({
                  type: 'directPrintInvoice',
                  payload: {
                    status: 'print',
                    id: responsInsertPos.id,
                    type: 'print'
                  }
                })
              } else {
                const invoiceWindow = window.open(
                  `/transaction/pos/invoice/${responsInsertPos.id}`
                )
                yield put({
                  type: 'updateState',
                  payload: {
                    paymentTransactionInvoiceWindow: invoiceWindow
                  }
                })
                if (invoiceWindow) {
                  invoiceWindow.focus()
                } else {
                  message.error('Please allow pop-up in your browser')
                }
              }
              // }
            } else {
              setPosLockTransaction(false)
              yield put({
                type: 'pos/queryLockTransaction',
                payload: {}
              })
              if (
                data_create &&
                data_create.message &&
                typeof data_create.message === 'string'
              ) {
                if (data_create.message === 'Please set your balance') {
                  yield put(routerRedux.push('/balance/current'))
                }
              }
              Modal.error({
                title: 'Error Saving Payment',
                content: `${JSON.stringify(data_create.message)}`
              })
              if (data_create.data) {
                stockMinusAlert(data_create)
              }
              throw data_create
            }
          } else {
            Modal.error({
              title: 'Member is required',
              content: 'Member and cashier information is required'
            })
          }
        }
      } else {
        Modal.error({
          title: 'Cannot get current time'
        })
      }
    },

    * directPrintInvoice ({ payload }, { call, put }) {
      try {
        const { type, status, id } = payload
        const response = yield call(queryInvoiceById, { id, storeId: lstorage.getCurrentUserStore() })
        if (response && response.success) {
          let directPrinting = []
          if (status !== 'reprint') {
            directPrinting = response.directPrinting
            if (
              response.pos &&
              response.directPrinting &&
              response.directPrinting.length > 0
            ) {
              for (let key in response.directPrinting) {
                const item = response.directPrinting[key]
                const responseDirect = yield call(directPrintingPrint, {
                  url: item.printingUrl,
                  data:
                    item.groupName === 'QRIS'
                      ? rearrangeDirectPrintingQris(response.pos, item)
                      : rearrangeDirectPrinting(response.pos, item)
                })
                console.log('responseDirect', responseDirect)
              }
            }
          }

          yield put({
            type: 'queryPosDetail',
            payload: {
              reference: payload.id,
              id: response.pos.transNo,
              data: response.pos,
              type,
              directPrinting
            }
          })
        } else {
          throw response
        }
      } catch (error) {
        throw error
      }
    },

    * queryPosDetail ({ payload }, { call }) {
      const data = yield call(queryDetail, {
        id: payload.id
      })
      const consignment = yield call(queryDetailConsignment, {
        id: payload.id
      })
      const PosData = yield call(queryaPos, payload)
      const member = payload.data.memberCode
        ? yield call(queryMemberCode, { memberCode: payload.data.memberCode })
        : {}
      const company = localStorage.getItem(`${prefix}store`)
        ? JSON.parse(localStorage.getItem(`${prefix}store`))
        : {}
      const mechanic = payload.data.technicianId
        ? yield call(queryMechanicCode, payload.data.technicianId)
        : {}

      let listAmount = []
      let listAmountInvoice = []

      if (data && PosData && PosData.success) {
        const payment = yield call(queryPaymentInvoice, {
          reference: PosData.pos.id,
          storeId: lstorage.getCurrentUserStore()
        })
        if (payment && payment.data) {
          for (let n = 0; n < payment.data.length; n += 1) {
            listAmount.push({
              no: n + 1,
              id: payment.data[n].id,
              cashierTransId: payment.data[n].cashierTransId,
              active: payment.data[n].active,
              storeId: payment.data[n].storeId,
              transDate: payment.data[n].transDate,
              transTime: payment.data[n].transTime,
              typeCode: payment.data[n].typeCode,
              cardNo: payment.data[n].cardNo,
              cardName: payment.data[n].cardName,
              chargeNominal: payment.data[n].chargeNominal,
              chargePercent: payment.data[n].chargePercent,
              chargeTotal: payment.data[n].chargeTotal,
              description: payment.data[n].description,
              paid: payment.data[n].paid || 0
            })
          }
        }
        if (payment && payment.invoice) {
          for (let n = 0; n < payment.invoice.length; n += 1) {
            listAmountInvoice.push({
              no: n + 1,
              id: payment.invoice[n].id,
              cashierTransId: payment.invoice[n].cashierTransId,
              active: payment.invoice[n].active,
              storeId: payment.invoice[n].storeId,
              transDate: payment.invoice[n].transDate,
              transTime: payment.invoice[n].transTime,
              typeCode: payment.invoice[n].typeCode,
              cardNo: payment.invoice[n].cardNo,
              cardName: payment.invoice[n].cardName,
              chargeNominal: payment.invoice[n].chargeNominal,
              chargePercent: payment.invoice[n].chargePercent,
              chargeTotal: payment.invoice[n].chargeTotal,
              description: payment.invoice[n].description,
              paid: payment.invoice[n].paid || 0
            })
          }
        }
        let dataConsignment = []
        if (
          consignment &&
          consignment.success &&
          consignment.pos &&
          consignment.pos.length > 0
        ) {
          dataConsignment = consignment.pos.map(item => ({
            code: item.productCode,
            name: item.productName,
            qty: item.qty,
            price: item.sellingPrice,
            discount: item.discount,
            disc1: 0,
            disc2: 0,
            disc3: 0,
            total: item.total
          }))
        }

        const companyData = yield call(querySetting, {
          settingCode: 'Company'
        })

        if (PosData.taxInfo && PosData.taxInfo.length > 0) {
          PosData.pos.taxInfo = PosData.taxInfo
        } else {
          PosData.pos.taxInfo = []
        }
        if (
          companyData &&
          companyData.success &&
          companyData.data &&
          companyData.data[0] &&
          companyData.data[0].settingValue
        ) {
          try {
            PosData.pos.companyInfo = JSON.parse(
              companyData.data[0].settingValue
            )
          } catch (error) {
            console.log('Error parsing companyInfo', error)
            PosData.pos.companyInfo = {}
          }
        } else {
          PosData.pos.companyInfo = {}
        }

        const payloadData = {
          posData: PosData.pos,
          listPaymentDetail: {
            dataConsignment,
            id: payload.data.transNo,
            cashierId: payload.data.cashierId,
            cashierName: PosData.pos.cashierName,
            policeNo: payload.data.policeNo,
            lastMeter: payload.data.lastMeter,
            data: data.pos,
            bundling: data.bundling,
            merk: PosData.pos.merk,
            model: PosData.pos.model,
            type: PosData.pos.type,
            year: PosData.pos.year,
            chassisNo: PosData.pos.chassisNo,
            defaultMember: PosData.pos.defaultMember,
            machineNo: PosData.pos.machineNo,
            discountLoyalty: PosData.pos.discountLoyalty, // discountLoyalty, lastCashback, gettingCashback
            lastCashback: PosData.pos.lastCashback,
            gettingCashback: PosData.pos.gettingCashback
          },
          memberPrint: member.data || '', // data member
          companyPrint: company.data || '', // data company
          mechanicPrint: mechanic.mechanic || '' // data mechanic
        }

        let dataPos = []
        let dataService = []
        for (let n = 0; n < data.pos.length; n += 1) {
          if (data.pos[n].typeCode === 'P') {
            let productId = data.pos[n].productCode
            let productName = data.pos[n].productName
            dataPos.push({
              code: productId,
              name: productName,
              qty: data.pos[n].qty,
              price: data.pos[n].sellingPrice,
              discount: data.pos[n].discount,
              disc1: data.pos[n].disc1,
              disc2: data.pos[n].disc2,
              disc3: data.pos[n].disc3,
              total: (data.pos[n].qty * data.pos[n].sellingPrice) - (data.pos[n].discount * data.pos[n].qty) -
                ((data.pos[n].qty * data.pos[n].sellingPrice) * (data.pos[n].disc1 / 100)) - (((data.pos[n].qty * data.pos[n].sellingPrice) * (data.pos[n].disc1 / 100)) * (data.pos[n].disc2 / 100)) -
                ((((data.pos[n].qty * data.pos[n].sellingPrice) * (data.pos[n].disc1 / 100)) * (data.pos[n].disc2 / 100)) * (data.pos[n].disc3 / 100))
            })
          } else if (data.pos[n].typeCode === 'S') {
            let productId = data.pos[n].serviceCode
            let productName = data.pos[n].serviceName
            dataService.push({
              code: productId,
              name: productName,
              qty: data.pos[n].qty,
              price: data.pos[n].sellingPrice,
              discount: data.pos[n].discount,
              disc1: data.pos[n].disc1,
              disc2: data.pos[n].disc2,
              disc3: data.pos[n].disc3,
              total: (data.pos[n].qty * data.pos[n].sellingPrice) - (data.pos[n].discount * data.pos[n].qty) -
                ((data.pos[n].qty * data.pos[n].sellingPrice) * (data.pos[n].disc1 / 100)) - (((data.pos[n].qty * data.pos[n].sellingPrice) * (data.pos[n].disc1 / 100)) * (data.pos[n].disc2 / 100)) -
                ((((data.pos[n].qty * data.pos[n].sellingPrice) * (data.pos[n].disc1 / 100)) * (data.pos[n].disc2 / 100)) * (data.pos[n].disc3 / 100))
            })
          }
        }

        const dataOption = yield call(queryOpts, { type: 'all' })
        let listOpts = []
        if (dataOption.success) {
          listOpts = dataOption.data
        }

        const dataa = {
          posData: payloadData.posData,
          data: payloadData.listPaymentDetail.data,
          bundling: payloadData.listPaymentDetail.bundling,
          memberPrint: payloadData.memberPrint,
          mechanicPrint: payloadData.mechanicPrint,
          companyPrint: company.data || ''
        }

        let dataPosInvoice = []
        let dataServiceInvoice = []
        let dataGroup = []
        let dataBundle = dataa.bundling
        if (dataa && dataa.data) {
          for (let n = 0; n < dataa.data.length; n += 1) {
            if (
              dataa.data[n].typeCode === 'P' &&
              dataa.data[n].bundlingId === null
            ) {
              let productId = dataa.data[n].productCode
              let productName = dataa.data[n].productName
              dataPosInvoice.push({
                no: '',
                code: productId,
                name: productName,
                bundlingId: dataa.data[n].bundlingId,
                bundlingCode: dataa.data[n].bundlingCode,
                bundlingName: dataa.data[n].bundlingName,
                qty: dataa.data[n].qty,
                price: dataa.data[n].sellingPrice,
                sellPrice: dataa.data[n].sellPrice,
                discount: dataa.data[n].discount,
                disc1: dataa.data[n].disc1,
                disc2: dataa.data[n].disc2,
                disc3: dataa.data[n].disc3,
                total: posTotal(dataa.data[n])
              })
            } else if (
              dataa.data[n].typeCode === 'S' &&
              dataa.data[n].bundlingId === null
            ) {
              let productId = dataa.data[n].serviceCode
              let productName = dataa.data[n].serviceName
              dataServiceInvoice.push({
                no: '',
                code: productId,
                name: productName,
                bundlingId: dataa.data[n].bundlingId,
                bundlingCode: dataa.data[n].bundlingCode,
                bundlingName: dataa.data[n].bundlingName,
                qty: dataa.data[n].qty,
                price: dataa.data[n].sellingPrice,
                sellPrice: dataa.data[n].sellPrice,
                discount: dataa.data[n].discount,
                disc1: dataa.data[n].disc1,
                disc2: dataa.data[n].disc2,
                disc3: dataa.data[n].disc3,
                total: posTotal(dataa.data[n])
              })
            } else if (dataa.data[n].bundlingId !== null) {
              let productId =
                dataa.data[n].productCode || dataa.data[n].serviceCode
              let productName =
                dataa.data[n].productName || dataa.data[n].serviceName
              dataGroup.push({
                no: '',
                code: productId,
                name: productName,
                bundlingId: dataa.data[n].bundlingId,
                bundlingCode: dataa.data[n].bundlingCode,
                bundlingName: dataa.data[n].bundlingName,
                qty: dataa.data[n].qty,
                price: dataa.data[n].sellingPrice,
                sellPrice: dataa.data[n].sellPrice,
                discount: dataa.data[n].discount,
                disc1: dataa.data[n].disc1,
                disc2: dataa.data[n].disc2,
                disc3: dataa.data[n].disc3,
                total: posTotal(dataa.data[n])
              })
            }
          }
        }
        for (let j = 0; j < dataServiceInvoice.length; j += 1) {
          dataServiceInvoice[j].no = j + 1
        }
        for (let k = 0; k < dataPosInvoice.length; k += 1) {
          dataPosInvoice[k].no = k + 1
        }

        const invoiceInfo = {
          dataPosInvoice,
          dataServiceInvoice,
          posData: payloadData.posData,
          dataGroup: groupProduct(dataGroup, dataBundle),
          transDatePrint: moment(
            `${payloadData.posData.transDate} ${payloadData.posData.transTime}`,
            'YYYY-MM-DD HH:mm:ss'
          ).format('DD MMM YYYY HH:mm'),
          memberId: dataa.memberPrint.memberCode,
          gender: dataa.memberPrint.gender,
          company: dataa.companyPrint,
          lastTransNo: payloadData.listPaymentDetail.id,
          consignmentNo: dataa.posData.consignmentNo,
          unitInfo: {
            ...payloadData.listPaymentDetail
          },
          storeInfo: company,
          memberName: dataa.memberPrint.memberName,
          phone: dataa.memberPrint.mobileNumber
            ? dataa.memberPrint.mobileNumber
            : dataa.memberPrint.phoneNumber,
          policeNo: payloadData.listPaymentDetail.policeNo,
          lastMeter: payloadData.listPaymentDetail.lastMeter,
          employeeName: dataa.mechanicPrint.employeeName,
          address: dataa.memberPrint.address01
            ? dataa.memberPrint.address01
            : dataa.memberPrint.address02,
          cashierId: payloadData.listPaymentDetail.cashierId,
          userName: payloadData.listPaymentDetail.cashierName,
          printNo: 'copy'
        }

        const merge = invoiceInfo.dataPosInvoice
          .concat(invoiceInfo.dataServiceInvoice)
          .concat(invoiceInfo.dataGroup)
          .concat(invoiceInfo.unitInfo.dataConsignment)
        let TotalQty = merge.reduce((cnt, o) => cnt + o.qty, 0)
        let Total = Math.round(merge.reduce((cnt, o) => cnt + o.total, 0))
        const curCharge = listAmount.reduce(
          (cnt, o) => cnt + parseFloat(o.chargeTotal),
          0
        )


        // Print To http://localhost:8080/api/message?printerName=KASIR&paperWidth=58

        let dataPosPrint = []
        if (invoiceInfo.dataPosInvoice) {
          for (let key in invoiceInfo.dataPosInvoice) {
            const item = invoiceInfo.dataPosInvoice[key]
            dataPosPrint = dataPosPrint.concat([
              {
                alignment: 'two',
                text: `${(item.name || '').substring(0, 25)} - ${item.code}`,
                rightText: ''
              },
              {
                alignment: 'two',
                text: `${numberFormatter(
                  parseInt(item.qty, 0)
                )} x @${numberFormatter(parseInt(item.total, 0) / item.qty)}`,
                rightText: `${numberFormatter(parseInt(item.total, 0))}`
              }
              // {
              //   alignment: "line",
              //   text: "",
              // },
            ])
          }
        }

        let dataServicePrint = []
        if (invoiceInfo.dataServiceInvoice) {
          for (let key in invoiceInfo.dataServiceInvoice) {
            const item = invoiceInfo.dataServiceInvoice[key]
            dataServicePrint = dataServicePrint.concat([
              {
                alignment: 'two',
                text: `${(item.name || '').substring(0, 25)} - ${item.code}`,
                rightText: ''
              }
            ])
            dataServicePrint = dataServicePrint.concat([
              {
                alignment: 'two',
                text: `${numberFormatter(
                  parseInt(item.qty, 0)
                )} x @${numberFormatter(parseInt(item.total, 0) / item.qty)}`,
                rightText: `${numberFormatter(parseInt(item.total, 0))}`
              }
              // {
              //   alignment: "line",
              //   text: "",
              // },
            ])
          }
        }

        let dataConsignmentPrint = []
        if (invoiceInfo.unitInfo.dataConsignment) {
          for (let key in invoiceInfo.unitInfo.dataConsignment) {
            const item = invoiceInfo.unitInfo.dataConsignment[key]
            dataConsignmentPrint = dataConsignmentPrint.concat([
              {
                alignment: 'two',
                text: `${(item.name || '').substring(0, 30)} - ${item.code}`,
                rightText: ''
              }
            ])
            dataConsignmentPrint = dataConsignmentPrint.concat([
              {
                alignment: 'two',
                text: `${numberFormatter(
                  parseInt(item.qty, 0)
                )} x @${numberFormatter(parseInt(item.total, 0) / item.qty)}`,
                rightText: `${numberFormatter(parseInt(item.total, 0))}`
              }
              // {
              //   alignment: "line",
              //   text: "",
              // },
            ])
          }
        }

        let dataGroupPrint = []
        if (invoiceInfo.dataGroup) {
          for (let key in invoiceInfo.dataGroup) {
            const item = invoiceInfo.dataGroup[key]
            // if (standardInvoice) {
            dataGroupPrint = dataGroupPrint.concat([
              {
                alignment: 'two',
                text: `${(item.key || '').substring(0, 25)}`,
                rightText: ''
              },
              {
                alignment: 'two',
                text: `${`${numberFormatter(item.qty)} x @${numberFormatter(
                  parseInt(item.total, 0) / item.qty
                )}`}`,
                rightText: `${numberFormatter(parseInt(item.total, 0))}`
              }
            ])
            // }
            // if (!standardInvoice) {
            //   for (let keyx in item.detail) {
            //     const itemx = item.detail[keyx];
            //     dataGroupPrint = dataGroupPrint.concat([
            //       // {
            //       //   alignment: "two",
            //       //   text: `${item.key}`,
            //       //   rightText: ``,
            //       // },
            //       {
            //         alignment: "two",
            //         text: `${itemx.qty} x ${itemx.name}`,
            //         rightText: "",
            //       },
            //     ]);
            //   }
            //   dataGroupPrint = dataGroupPrint.concat([
            //     {
            //       alignment: "two",
            //       text: `${`${numberFormatter(item.qty)} x @${numberFormatter(
            //         parseInt(item.total, 0) / item.qty
            //       )}`}`,
            //       rightText: `${numberFormatter(parseInt(item.total, 0))}`,
            //     },
            //     {
            //       alignment: "line",
            //       text: "",
            //     },
            //   ]);
            // }
          }
        }

        // total

        // Total Detail
        let listAmountPrint = []
        for (let key in listAmount) {
          const item = listAmount[key]
          listAmountPrint = listAmountPrint.concat([
            {
              alignment: 'two',
              text: `${chooseOnePaymentType(item.typeCode, listOpts)}:Rp`,
              rightText: `${numberFormatter(item.paid + item.chargeTotal)}`
            }
          ])
        }

        // PPN
        let taxPrint = []
        for (let key in PosData.taxInfo) {
          const item = PosData.taxInfo[key]
          taxPrint = taxPrint.concat([
            {
              alignment: 'two',
              text: `${item.taxName}:Rp`,
              rightText: `${item.PPN
                ? item.PPN.toLocaleString(['ban', 'id'], {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })
                : 0
              }`
            }
          ])
        }

        // Member
        let memberPrint = []
        let memberConcat = []
        let coinConcat = []

        if (invoiceInfo.unitInfo && invoiceInfo.unitInfo.id && !invoiceInfo.unitInfo.defaultMember) {
          coinConcat.concat({
            alignment: 'two',
            text: 'Coin',
            rightText: `${numberFormatter(
              invoiceInfo.unitInfo.lastCashback
            )} ${invoiceInfo.unitInfo.gettingCashback > 0
              ? ` (+${numberFormatter(
                invoiceInfo.unitInfo.gettingCashback
              )})`
              : null}`
          })
        }
        if (invoiceInfo.posData &&
          invoiceInfo.posData.orderShortNumber &&
          invoiceInfo.posData.orderShortNumber) {
          memberConcat = memberConcat.concat([
            {
              alignment: 'center',
              style: 'bold-3',
              text: `${invoiceInfo.posData &&
                invoiceInfo.posData.orderShortNumber &&
                invoiceInfo.posData.orderShortNumber
              }`,
              rightText: ''
            }
          ])
        }
        if (invoiceInfo) {
          memberPrint = memberPrint.concat([
            {
              alignment: 'line',
              text: ''
            },
            {
              alignment: 'two',
              text: 'MEMBER',
              rightText: `${invoiceInfo.memberName}`
            }])
            .concat(coinConcat)
            .concat(memberConcat)
            .concat([
              {
                alignment: 'center',
                style: 'bold-2',
                text: `${invoiceInfo.posData &&
                  invoiceInfo.posData.orderType &&
                  invoiceInfo.posData.orderType
                }`,
                rightText: ''
              },
              {
                alignment: 'line',
                text: ''
              }
            ])
        }

        // Company
        let taxInfoPrint = []
        let companyAddresConcat = []
        if (PosData.pos.companyInfo.companyAddress) {
          companyAddresConcat = companyAddresConcat.concat([
            {
              alignment: 'center',
              text: `${PosData.pos.companyInfo.companyAddress}`,
              rightText: ''
            }
          ])
        }
        if (
          PosData &&
          PosData.pos.companyInfo &&
          PosData.pos.companyInfo.companyName
        ) {
          taxInfoPrint = taxInfoPrint.concat([
            {
              alignment: 'center',
              text: `${PosData.pos.companyInfo.companyName}`,
              rightText: ''
            }
          ])
            .concat(companyAddresConcat)
            .concat([
              {
                alignment: 'center',
                text: `NPWP: ${PosData.pos.companyInfo.taxID}`,
                rightText: ''
              },
              {
                alignment: 'center',
                text: 'BARANG KENA PAJAK SUDAH TERMASUK PPN',
                rightText: ''
              },
              {
                alignment: 'center',
                text: 'KRITIK & SARAN MOHON DM di IG',
                rightText: ''
              },
              {
                alignment: 'center',
                text: `${PosData.pos.companyInfo.contact}`,
                rightText: ''
              },
              {
                alignment: 'line',
                text: ''
              }
            ])
        }

        let footerPrint = [
          {
            alignment: 'footer',
            text: ''
          }
        ]

        // merchan copy
        const mergeCopy = invoiceInfo.dataPosInvoice.concat(invoiceInfo.dataServiceInvoice).concat(invoiceInfo.dataGroup)
        let TotalCopy = mergeCopy.reduce((cnt, o) => cnt + o.total, 0)
        const cash =
          listAmount &&
          listAmount.filter(filtered => filtered.typeCode === 'C')
        const showCopy =
          (listAmount.length > 0 && cash.length === 0) ||
          (listAmount.length > 1 && cash.length > 0)

        let copyPrint = []
        if (showCopy) {
          copyPrint = copyPrint.concat([
            {
              alignment: 'center',
              style: 'subtitle',
              text: 'Merchant Copy'
            },
            {
              alignment: 'two',
              text: `${invoiceInfo.transDatePrint}`,
              rightText: ''
            },
            {
              alignment: 'two',
              text: `${PosData.pos.transNo}`,
              rightText: ''
            },
            {
              alignment: 'two',
              text: `${currencyFormatter(
                parseInt(
                  parseFloat(TotalCopy) + parseFloat(PosData.pos.dineInTax),
                  0
                )
              )}`,
              rightText: ''
            }
          ])
        }

        const payloadPrint = [
          {
            alignment: 'two',
            style: 'subtitle',
            text: '',
            rightText: ''
          }
          // {
          //   style: "title",
          //   alignment: "left",
          //   text: "K3MART",
          // },
        ]
          .concat([
            {
              alignment: 'line',
              text: ''
            },
            {
              alignment: 'two',
              text: `Cashier: ${payloadData.posData.technicianName}`,
              rightText: ''
            },
            {
              alignment: 'two',
              text: 'Invoice:',
              style: 'bold',
              rightText: `${moment(payloadData.posData.createdAt).format(
                'YYYY-MM-DD, HH:mm'
              )}`
            },
            {
              alignment: 'two',
              style: 'bold',
              text: `${payloadData.posData.transNo}`,
              rightText: ''
            },
            {
              alignment: 'line',
              text: ''
            }
          ])
          .concat(dataPosPrint)
          .concat(dataServicePrint)
          .concat(dataConsignmentPrint)
          .concat(dataGroupPrint)
          .concat([
            {
              alignment: 'line',
              text: ''
            }
          ])
          // .concat(serviceChargePrint)
          .concat([
            // {
            //   alignment: "two",
            //   text: `Charge:Rp`,
            //   rightText: `${numberFormatter(parseFloat(curCharge))}`,
            // },
            {
              alignment: 'two',
              style: 'bold-2',
              text: `Total (${numberFormatter(parseFloat(TotalQty))} items):Rp`,
              rightText: `${numberFormatter(
                parseInt(Total, 0) +
                parseFloat(PosData.pos.dineInTax || 0) +
                parseFloat(curCharge || 0)
              )}`
            }
          ])
          .concat(listAmountPrint)
          .concat([
            {
              alignment: 'two',
              text: 'Kembalian:Rp',
              rightText: `${numberFormatter(PosData.pos.change)}`
            },
            {
              alignment: 'two',
              text: 'DPP:Rp',
              rightText: `${PosData.pos.dpp
                ? PosData.pos.dpp.toLocaleString(['ban', 'id'], {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })
                : 0
              }`
            }
          ])
          .concat(taxPrint)
          .concat(memberPrint)
          .concat(taxInfoPrint)
          .concat(footerPrint)
        // .concat(copyPrint)

        // console.log("cek data payloadPrint", JSON.stringify(payloadPrint));
        yield call(directPrinting, payloadPrint)
        if (showCopy) {
          yield call(directPrinting, copyPrint)
        }
      }
    },

    * addMethodVoucher ({ payload }, { call, select, put }) {
      const { list } = payload
      const listAmount = yield select(({ payment }) => payment.listAmount)
      const listVoucher = yield select(({ pos }) => pos.listVoucher)
      const curTotal = yield select(({ pos }) => pos.curTotal)
      const data = yield call(queryEdc, {
        paymentOption: 'V'
      })
      let listPayment = []
      let listCost = []
      if (data.success) {
        listPayment = data.data
        const responseCost = yield call(queryCost, {
          machineId: listPayment[0].id,
          relationship: 1
        })
        if (responseCost && responseCost.success) {
          listCost = responseCost.data
        }
      }
      for (let key = 0; key < list.length; key += 1) {
        const item = list[key]
        item.id = key + 1
        if (
          listAmount &&
          listAmount.filter(filtered => filtered.typeCode === 'V').length !==
          listVoucher.length
        ) {
          if (listPayment && listPayment.length === 1) {
            if (listCost && listCost[0]) {
              yield put({
                type: 'addMethod',
                payload: {
                  listAmount,
                  data: {
                    id: item.id,
                    amount: item.voucherValue,
                    bank: listCost[0].id,
                    chargeNominal: 0,
                    chargePercent: 0,
                    chargeTotal: 0,
                    description: item.voucherName,
                    voucherCode: item.generatedCode,
                    voucherId: item.voucherId,
                    machine: listPayment[0].id,
                    printDate: null,
                    typeCode: 'V'
                  }
                }
              })
            }
          }
        }
      }
      yield put({ type: 'pos/setCurTotal' })

      yield put({
        type: 'payment/setCurTotal',
        payload: { grandTotal: curTotal }
      })
    },

    * setLastTrans ({ payload }, { call, put }) {
      const transNo = yield call(querySequence, payload)
      const company = yield call(querySetting, { settingCode: 'Company' })
      localStorage.setItem('transNo', transNo.data)
      yield put({
        type: 'lastTransNo',
        payload: transNo.data
      })
      if (company.success) {
        // let json = company.data[0]
        // let jsondata = JSON.stringify(eval(`(${json.settingValue})`))
        // const data = JSON.parse(jsondata)
        const tempCompany = lstorage.getCurrentUserStoreDetail()
        // console.log('company', data)
        // console.log('tempCompany', tempCompany)
        const companyInfo = {
          companyAddress: tempCompany.companyAddress01,
          companyAddress02: tempCompany.companyAddress02,
          companyName: tempCompany.companyName, // perlu store
          contact: tempCompany.companyMobileNumber,
          email: tempCompany.companyEmail, // perlu store
          taxConfirmDate: tempCompany.taxConfirmDate, // perlu store
          taxID: tempCompany.taxID, // perlu store
          taxType: tempCompany.taxType // perlu store
        }

        yield put({
          type: 'updateState',
          payload: {
            companyInfo
          }
        })
      }
    },
    * listCreditCharge ({ payload }, { put, call }) {
      const data = yield call(listCreditCharge, payload)
      let newData = data.creditCharges

      let DICT_FIXED = (function () {
        let fixed = []
        for (let id in newData) {
          if ({}.hasOwnProperty.call(newData, id)) {
            fixed.push({
              value: newData[id].creditCode,
              label: newData[id].creditDesc
            })
          }
        }

        return fixed
      }())

      if (data.success) {
        yield put({
          type: 'listSuccess',
          payload: {
            listCreditCharge: DICT_FIXED
          }
        })
      }
    },

    * getCreditCharge ({ payload }, { call, put }) {
      const data = yield call(getCreditCharge, payload.creditCode)
      let newData = data.creditCharges

      if (data.success) {
        yield put({
          type: 'getCreditChargeSuccess',
          payload: {
            creditCharge: newData.creditCharge,
            netto: payload.netto,
            creditCardType: payload.creditCode
          }
        })
      } else {
        throw data
      }
    },
    * sequenceQuery ({ payload }, { call, put }) {
      const data = yield call(querySequence, payload)
      let sequenceData = {}
      if (data.success) {
        if (payload.seqCode) {
          sequenceData = {
            usingWo: true,
            woNumber: data.data
          }
        }
        yield put({
          type: 'querySequenceSuccess',
          payload: {
            listSequence: data.data,
            ...sequenceData
          }
        })
      }
    },
    * createDynamicQrisPayment ({ payload }, { call, select, put }) {
      const appVersion = APPVERSION
      removeDynamicQrisImage()
      const { curTotalPayment, curNetto } = payload
      const posDescription = yield select(({ pos }) => pos.posDescription)
      const memberInformation = yield select(
        ({ pos }) => pos.memberInformation
      )
      const typeTrans = yield select(({ payment }) => payment.typeTrans)
      if (!memberInformation || JSON.stringify(memberInformation) === '{}') {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Member Not Found...!'
        })
        setTimeout(() => modal.destroy(), 1000)
        return
      }
      if (
        memberInformation.memberPendingPayment === '1'
          ? false
          : parseInt(curTotalPayment, 0) < parseInt(curNetto, 0)
      ) {
        Modal.error({
          title: 'Payment pending restricted',
          content: 'This member type cannot allow to pending'
        })
        return
      }
      if (typeTrans.toString().length === 0) {
        Modal.warning({
          title: 'Payment method',
          content: 'Your Payment method is empty'
        })
        return
      }

      const product = getCashierTrans()
      const service = localStorage.getItem('service_detail')
        ? JSON.parse(localStorage.getItem('service_detail'))
        : []
      // const workorder = localStorage.getItem('workorder') ? JSON.parse(localStorage.getItem('workorder')) : {}
      const dataPos = product.concat(service)
      let checkProductId = false
      for (let n = 0; n < dataPos.length; n += 1) {
        if (dataPos[n].productId === 0) {
          checkProductId = true
          break
        }
      }
      if (checkProductId) {
        console.log(checkProductId)
        Modal.error({
          title: 'Payment',
          content: 'Something Wrong with Product'
        })
        return
      }

      const invoice = {
        seqCode: 'INV',
        type: lstorage.getCurrentUserStore()
      }
      const transNo = yield call(querySequence, invoice)
      const date = yield call(getDateTime, {
        id: 'timestamp'
      })
      if (date.success) {
        if (transNo.data === null) {
          Modal.error({
            title: 'Something went wrong',
            content: `Cannot read transaction number, message: ${transNo.data}`
          })
        } else if (payload.address === undefined) {
          Modal.error({
            title: 'Payment Fail',
            content: 'Address is Undefined'
          })
        } else if (payload.memberId === undefined) {
          Modal.error({
            title: 'Payment Fail',
            content: 'Member Id is Undefined'
          })
        } else if (payload.policeNo === undefined) {
          Modal.error({
            title: 'Payment Fail',
            content: 'Unit is Undefined'
          })
        } else {
          let arrayProd = []
          let reference = getPosReference()
          if (!reference) {
            Modal.error({
              title: 'Refresh the browser',
              content: 'Refresh the browser'
            })
            return
          }
          const consignment = getConsignment()
          const consignmentTotal =
            consignment && consignment.length > 0
              ? consignment.reduce((prev, next) => prev + next.total, 0)
              : 0
          const dineInTax = localStorage.getItem('dineInTax')
            ? Number(localStorage.getItem('dineInTax'))
            : 0
          const typePembelian = localStorage.getItem('typePembelian')
            ? Number(localStorage.getItem('typePembelian'))
            : 0
          const service = localStorage.getItem('service_detail')
            ? JSON.parse(localStorage.getItem('service_detail'))
            : []
          const dataPos = product.concat(service)
          const dataBundle = localStorage.getItem('bundle_promo')
            ? JSON.parse(localStorage.getItem('bundle_promo'))
            : []
          const trans = transNo.data
          const storeId = lstorage.getCurrentUserStore()
          const companySetting = JSON.parse(
            payload.setting.Company || '{}'
          ).taxType

          // Akan di ganti variables
          for (let key = 0; key < dataPos.length; key += 1) {
            const totalPrice = ((
              (dataPos[key].price * dataPos[key].qty) * // price * qty
              (1 - (dataPos[key].disc1 / 100)) * // -disc1
              (1 - (dataPos[key].disc2 / 100)) * // -disc2
              (1 - (dataPos[key].disc3 / 100))) - // -disc3
              dataPos[key].discount) // -discount
            const dpp =
              totalPrice /
              (companySetting === 'I' ? getDenominatorDppInclude() : 1)
            const ppn =
              companySetting === 'I'
                ? totalPrice / getDenominatorPPNInclude()
                : companySetting === 'S'
                  ? totalPrice * getDenominatorPPNExclude()
                  : 0
            arrayProd.push({
              storeId,
              transNo: trans,
              categoryCode: dataPos[key].categoryCode,
              bundleId: dataPos[key].bundleId,
              bundleName: dataPos[key].bundleName,
              bundleCode: dataPos[key].bundleCode,
              hide: dataPos[key].hide,
              replaceable: dataPos[key].replaceable,
              employeeId: dataPos[key].employeeId,
              employeeName: dataPos[key].employeeName,
              productId: dataPos[key].productId,
              productCode: dataPos[key].code,
              productName: dataPos[key].name,
              qty: dataPos[key].qty,
              typeCode: dataPos[key].typeCode,
              oldValue: dataPos[key].oldValue,
              newValue: dataPos[key].newValue,
              retailPrice: dataPos[key].retailPrice,
              distPrice01: dataPos[key].distPrice01,
              distPrice02: dataPos[key].distPrice02,
              distPrice03: dataPos[key].distPrice03,
              distPrice04: dataPos[key].distPrice04,
              distPrice05: dataPos[key].distPrice05,
              distPrice06: dataPos[key].distPrice06,
              distPrice07: dataPos[key].distPrice07,
              distPrice08: dataPos[key].distPrice08,
              distPrice09: dataPos[key].distPrice09,
              sellingPrice: dataPos[key].price,
              DPP: dpp,
              PPN: ppn,
              discount: dataPos[key].discount,
              disc1: dataPos[key].disc1,
              disc2: dataPos[key].disc2,
              disc3: dataPos[key].disc3,
              totalPrice
            })
          }
          const grandTotal = arrayProd.reduce(
            (cnt, o) => cnt + o.totalPrice,
            0
          )
          const newArrayProd = arrayProd.map((x) => {
            const portion = x.totalPrice / grandTotal
            const discountLoyalty = portion * (payload.useLoyalty || 0)
            const totalPrice = x.totalPrice - discountLoyalty
            const dpp =
              totalPrice /
              (companySetting === 'I' ? getDenominatorDppInclude() : 1)
            const ppn =
              companySetting === 'I'
                ? totalPrice / getDenominatorPPNInclude()
                : companySetting === 'S'
                  ? totalPrice * getDenominatorPPNExclude()
                  : 0
            return {
              storeId: x.storeId,
              transNo: x.transNo,
              categoryCode: x.categoryCode,
              bundleId: x.bundleId,
              bundleCode: x.bundleCode,
              bundleName: x.bundleName,
              hide: x.hide,
              replaceable: x.replaceable,
              employeeId: x.employeeId,
              employeeName: x.employeeName,
              productId: x.productId,
              productCode: x.productCode,
              productName: x.productName,
              oldValue: x.oldValue,
              newValue: x.newValue,
              retailPrice: x.retailPrice,
              distPrice01: x.distPrice01,
              distPrice02: x.distPrice02,
              distPrice03: x.distPrice03,
              distPrice04: x.distPrice04,
              distPrice05: x.distPrice05,
              distPrice06: x.distPrice06,
              distPrice07: x.distPrice07,
              distPrice08: x.distPrice08,
              distPrice09: x.distPrice09,
              qty: x.qty,
              typeCode: x.typeCode,
              sellPrice: x.sellPrice,
              sellingPrice: x.sellingPrice,
              DPP: dpp,
              PPN: ppn,
              discountLoyalty: discountLoyalty || 0,
              discount: x.discount,
              disc1: x.disc1,
              disc2: x.disc2,
              disc3: x.disc3,
              totalPrice
            }
          })
          const dineIn = (grandTotal + consignmentTotal) * (dineInTax / 100)
          if (payload.memberCode !== null) {
            const paymentTransactionParams = payload.params
            const goodsInfo = product
              .map(item => `${item.productId}:${item.qty}:${item.total}`)
              .join(';')
            paymentTransactionParams.goodsInfo = String(goodsInfo).substring(
              0,
              99
            )
            const detailPOS = {
              reference,
              description: posDescription,
              appVersion,
              dataPos: newArrayProd,
              dataConsignment: consignment,
              dataBundle,
              grabOrder: lstorage.getGrabmartOrder(),
              transNo: trans,
              taxType: companySetting,
              taxInvoiceNo: payload.taxInfo.taxInvoiceNo,
              taxDate: payload.taxInfo.taxDate,
              storeId: lstorage.getCurrentUserStore(),
              memberCode: payload.memberCode,
              discountLoyalty: payload.useLoyalty || 0,
              useLoyalty: payload.useLoyalty || 0,
              technicianId: payload.technicianId,
              transTime: payload.transTime,
              total: payload.grandTotal,
              dineInTax: dineIn,
              typePembelian:
                dineInTax === 10
                  ? TYPE_PEMBELIAN_DINEIN
                  : dineInTax === 0
                    ? typePembelian
                    : TYPE_PEMBELIAN_UMUM,
              lastMeter: localStorage.getItem('lastMeter')
                ? JSON.parse(localStorage.getItem('lastMeter')) || 0
                : 0,
              creditCardNo: payload.creditCardNo,
              creditCardType: payload.creditCardType,
              creditCardCharge: payload.creditCardCharge,
              totalCreditCard: payload.totalCreditCard,
              discount: payload.totalDiscount,
              rounding: payload.rounding,
              paid: payload.totalPayment,
              woId: localStorage.getItem('workorder')
                ? JSON.parse(localStorage.getItem('workorder')).id
                : null,
              paymentVia: payload.paymentVia,
              policeNo: localStorage.getItem('memberUnit')
                ? JSON.parse(localStorage.getItem('memberUnit')).policeNo
                : null,
              policeNoId: localStorage.getItem('memberUnit')
                ? JSON.parse(localStorage.getItem('memberUnit')).id
                : null,
              change: payload.totalChange,
              woReference: payload.woNumber,
              listAmount: payload.listAmount,
              paymentTransactionParams
            }
            const response = yield call(create, detailPOS)
            if (response.success) {
              const responsInsertPos = response.pos
              const createdPaymentTransaction =
                responsInsertPos.createdPaymentTransaction
              const createdQrisPaymentResponse =
                createdPaymentTransaction.onlinePaymentResponse
              if (
                createdQrisPaymentResponse &&
                createdQrisPaymentResponse.qrCode &&
                createdPaymentTransaction.payment
              ) {
                const paymentTransactionLimitTime = getQrisPaymentTimeLimit()
                const merchantTradeNo =
                  createdQrisPaymentResponse.merchantTradeNo
                setDynamicQrisPosTransId(responsInsertPos.id)
                setDynamicQrisPosTransNo(responsInsertPos.transNo)
                setDynamicQrisImage(createdQrisPaymentResponse.qrCode)
                setQrisMerchantTradeNo(merchantTradeNo)
                setDynamicQrisTimeLimit(
                  Number(paymentTransactionLimitTime || 15)
                )
                setCurrentPaymentTransactionId(
                  createdPaymentTransaction.payment.id
                )
                yield put({
                  type: 'updateState',
                  payload: {
                    paymentTransactionId: createdPaymentTransaction.payment.id,
                    paymentTransactionLimitTime: Number(
                      paymentTransactionLimitTime || 15
                    )
                  }
                })
                yield put({
                  type: 'pos/querySequenceReference'
                })
                yield put({
                  type: 'pos/updateState',
                  payload: {
                    modalQrisPaymentVisible: true,
                    modalQrisPaymentType: 'waiting',
                    qrisPaymentCurrentTransNo: responsInsertPos.transNo,
                    modalConfirmQrisPaymentVisible: false
                  }
                })
                yield put({
                  type: 'pos/getDynamicQrisLatestTransaction',
                  payload: {
                    storeId: lstorage.getCurrentUserStore()
                  }
                })
              } else {
                yield put({
                  type: 'pos/updateState',
                  payload: {
                    modalQrisPaymentVisible: false,
                    modalQrisPaymentType: 'waiting'
                  }
                })
                yield put({
                  type: 'payment/cancelDynamicQrisPayment',
                  payload: {
                    paymentTransactionId: createdPaymentTransaction.payment.id,
                    pos: {
                      transNo: responsInsertPos.transNo,
                      memo: 'Canceled Dynamic Qris Payment - Qr Code is not provided'
                    }
                  }
                })
                Modal.error({
                  title: 'Dynamic QRIS Failed',
                  content: 'Failed to create Dynamic Qris Payment'
                })
              }
            } else {
              if (
                response &&
                response.message &&
                typeof response.message === 'string'
              ) {
                if (response.message === 'Please set your balance') {
                  yield put(routerRedux.push('/balance/current'))
                }
              }
              Modal.error({
                title: 'Error Saving Payment',
                content: `${JSON.stringify(response.message)}`
              })
              if (response.data) {
                stockMinusAlert(response)
              }
              throw response
            }
          } else {
            Modal.error({
              title: 'Member is required',
              content: 'Member and cashier information is required'
            })
          }
        }
      } else {
        Modal.error({
          title: 'Cannot get current time'
        })
      }
    },
    * cancelDynamicQrisPayment ({ payload }, { call, select, put }) {
      const modalQrisTransactionFailedVisible = yield select(({ pos }) =>
        (pos ? pos.modalQrisTransactionFailedVisible : false)
      )
      payload.pos.storeId = lstorage.getCurrentUserStore()
      payload.pos.status = 'C'
      const response = yield call(cancelDynamicQrisPayment, payload)
      if (response && response.success) {
        removeDynamicQrisImage()
        removeQrisMerchantTradeNo()
        removeDynamicQrisPosTransId()
        removeDynamicQrisPosTransNo()
        removeCurrentPaymentTransactionId()
        yield put({
          type: 'updateState',
          payload: {
            paymentTransactionId: null
          }
        })
        yield put({
          type: 'payment/hidePaymentModal'
        })
        yield put({
          type: 'pos/updateState',
          payload: {
            modalQrisPaymentVisible: false,
            modalQrisPaymentType: 'waiting',
            modalCancelQrisPaymentVisible: false
          }
        })
        if (modalQrisTransactionFailedVisible) {
          yield put({
            type: 'pos/queryPaymentTransactionFailed',
            payload: {
              storeId: lstorage.getCurrentUserStore()
            }
          })
        }
      } else {
        Modal.error({
          title: 'Cancel Payment Error',
          content:
            'Failed to cancel this payment, because its already paid, try to [ Refresh ] this payment'
        })
      }
    }
  },

  reducers: {
    listSuccess (state, action) {
      const { listCreditCharge } = action.payload
      return {
        ...state,
        listCreditCharge
      }
    },

    getCreditChargeSuccess (state, action) {
      const { creditCharge, netto, creditCardType } = action.payload
      return {
        ...state,
        creditCharge,
        creditChargeAmount:
          (parseInt(netto, 10) * parseInt(creditCharge, 10)) / 100,
        creditCardTotal:
          0,
        creditCardType
      }
    },

    updateState (state, { payload }) {
      return {
        ...state,
        ...payload
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
      return { ...state, lastMeter: action.payload.lastMeter }
    },

    setPoliceNo (state, action) {
      localStorage.setItem(
        'memberUnit',
        JSON.stringify(action.payload.policeNo)
      )
      return { ...state, policeNo: action.payload.policeNo.policeNo }
    },

    hideCreditModal (state) {
      return { ...state, modalCreditVisible: false }
    },

    lastTransNo (state, action) {
      return { ...state, lastTransNo: action.payload }
    },

    setCurTotal (state) {
      return {
        ...state,
        inputPayment: 0,
        totalPayment: 0,
        totalChange: 0
      }
    },

    changePayment (state, action) {
      return {
        ...state,
        inputPayment: action.payload.totalPayment,
        totalPayment: action.payload.totalPayment,
        totalChange: action.payload.totalPayment - action.payload.netto
      }
    },

    setCashPaymentNull (state) {
      return { ...state, inputPayment: 0, totalPayment: 0, totalChange: 0 }
    },

    showPaymentModal (state) {
      return { ...state, paymentModalVisible: true }
    },

    hidePaymentModal (state) {
      return { ...state, paymentModalVisible: false, listAmount: [] }
    },

    setCreditCardPaymentNull (state) {
      return {
        ...state,
        creditCardTotal: 0,
        creditCharge: 0,
        creditChargeAmount: 0,
        creditCardNo: 0,
        creditCardType: ''
      }
    },

    addMethod (state, action) {
      let { listAmount } = action.payload
      if (action.payload.data.typeCode !== 'V') {
        const exists = listAmount.filter(
          x => x.typeCode === action.payload.data.typeCode
        )
        if (exists.length > 0 && action.payload.data.typeCode === 'C') {
          Modal.info({
            title: 'Payment Already Exists and Added',
            content: 'Please Check Payment'
          })
          return { ...state }
        }
      }
      listAmount.push(action.payload.data)
      return { ...state, listAmount }
    },

    editMethod (state, action) {
      let { listAmount } = state
      const exists = listAmount.filter(
        x => x.typeCode === action.payload.data.typeCode
      )
      if (
        (exists[0] || {}).id !== action.payload.data.id &&
        exists.length > 0 &&
        action.payload.data.typeCode === 'C'
      ) {
        Modal.info({
          title: 'Payment Already Exists and Added',
          content: 'Please Check Payment'
        })
        return {
          ...state,
          modalType: 'add',
          itemPayment: {}
        }
      }
      listAmount[action.payload.data.id - 1] = action.payload.data
      return { ...state, listAmount, ...action.payload }
    },

    setCreditCardNo (state, action) {
      return { ...state, creditCardNo: action.payload.creditCardNo }
    },

    changeCascader (state, action) {
      return { ...state, typeTrans: action.payload.value[0] }
    },
    querySequenceSuccess (state, action) {
      if (action.payload.woNumber) {
        localStorage.setItem('woNumber', action.payload.woNumber)
      } else if (action.payload.woNumber === null) {
        localStorage.removeItem('woNumber')
      }
      return { ...state, ...action.payload }
    },
    returnState (state, action) {
      return { ...state, ...action.payload }
    }
  }
}
