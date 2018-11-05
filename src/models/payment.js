import { Modal } from 'antd'
import moment from 'moment'
import { configMain, lstorage, alertModal } from 'utils'
import * as cashierService from '../services/payment'
import * as creditChargeService from '../services/creditCharge'
import { query as querySequence } from '../services/sequence'
import { query as querySetting } from '../services/setting'
import { getDateTime } from '../services/setting/time'
import { queryCurrentOpenCashRegister } from '../services/setting/cashier'

const { stockMinusAlert } = alertModal
const { getCashierTrans } = lstorage

const terbilang = require('terbilang-spelling')
const pdfMake = require('pdfmake/build/pdfmake.js')
const pdfFonts = require('pdfmake/build/vfs_fonts.js')

pdfMake.vfs = pdfFonts.pdfMake.vfs

const { prefix } = configMain
const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)).stackHeader03 : []

const { create } = cashierService
const { listCreditCharge, getCreditCharge } = creditChargeService

export default {
  namespace: 'payment',
  state: {
    currentItem: {},
    modalVisible: false,
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
    listCreditCharge: [],
    listAmount: [],
    creditCardType: '',
    policeNo: '',
    itemPayment: {},
    usingWo: false,
    woNumber: localStorage.getItem('woNumber') ? localStorage.getItem('woNumber') : null
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/transaction/pos/payment' || location.pathname === '/transaction/pos/history') {
          dispatch({ type: 'setLastTrans', payload: { seqCode: 'INV', type: lstorage.getCurrentUserStore() } }) // type diganti storeId
          dispatch({
            type: 'updateState',
            payload: {
              listAmount: [],
              itemPayment: {}
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
    * create ({ payload }, { call, put }) {
      const invoice = {
        seqCode: 'INV',
        type: lstorage.getCurrentUserStore()
      }
      const transNo = yield call(querySequence, invoice)
      const date = yield call(getDateTime, {
        id: 'timestamp'
      })
      if (date.success) {
        if ((transNo.data === null)) {
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
          const product = getCashierTrans()
          const service = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
          const dataPos = product.concat(service)
          const dataBundle = localStorage.getItem('bundle_promo') ? JSON.parse(localStorage.getItem('bundle_promo')) : []
          const trans = transNo.data
          const storeId = lstorage.getCurrentUserStore()
          const companySetting = JSON.parse((payload.setting.Company || '{}')).taxType

          // Akan di ganti variables
          for (let key = 0; key < dataPos.length; key += 1) {
            const totalPrice = ((
              (dataPos[key].price * dataPos[key].qty) * // price * qty
              (1 - (dataPos[key].disc1 / 100)) * // -disc1
              (1 - (dataPos[key].disc2 / 100)) * // -disc2
              (1 - (dataPos[key].disc3 / 100))) - // -disc3
              dataPos[key].discount) // -discount
            const dpp = totalPrice / (companySetting === 'I' ? 1.1 : 1)
            const ppn = (companySetting === 'I' ? totalPrice / 11 : companySetting === 'S' ? totalPrice * 0.1 : 0)
            arrayProd.push({
              storeId,
              transNo: trans,
              bundleId: dataPos[key].bundleId,
              employeeId: dataPos[key].employeeId,
              employeeName: dataPos[key].employeeName,
              productId: dataPos[key].productId,
              productCode: dataPos[key].code,
              productName: dataPos[key].name,
              qty: dataPos[key].qty,
              typeCode: dataPos[key].typeCode,
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
          const grandTotal = arrayProd.reduce((cnt, o) => cnt + o.totalPrice, 0)
          const newArrayProd = arrayProd.map((x) => {
            const portion = (x.totalPrice / grandTotal)
            const discountLoyalty = (portion * (payload.useLoyalty || 0))
            const totalPrice = x.totalPrice - discountLoyalty
            const dpp = totalPrice / (companySetting === 'I' ? 1.1 : 1)
            const ppn = (companySetting === 'I' ? totalPrice / 11 : companySetting === 'S' ? totalPrice * 0.1 : 0)
            return {
              storeId: x.storeId,
              transNo: x.transNo,
              bundleId: x.bundleId,
              employeeId: x.employeeId,
              employeeName: x.employeeName,
              productId: x.productId,
              productCode: x.productCode,
              productName: x.productName,
              qty: x.qty,
              typeCode: x.typeCode,
              sellingPrice: x.sellingPrice,
              DPP: dpp,
              PPN: ppn,
              discountLoyalty,
              discount: x.discount,
              disc1: x.disc1,
              disc2: x.disc2,
              disc3: x.disc3
            }
          })
          const currentRegister = yield call(queryCurrentOpenCashRegister, payload)
          if (currentRegister.success || payload.memberCode !== null) {
            const cashierInformation = (Array.isArray(currentRegister.data)) ? currentRegister.data[0] : currentRegister.data
            const detailPOS = {
              dataPos: newArrayProd,
              dataBundle,
              transNo: trans,
              taxType: companySetting,
              storeId: lstorage.getCurrentUserStore(),
              memberCode: payload.memberCode,
              discountLoyalty: payload.useLoyalty || 0,
              useLoyalty: payload.useLoyalty || 0,
              technicianId: payload.technicianId,
              cashierTransId: cashierInformation.id,
              transDate: cashierInformation.period,
              transTime: payload.transTime,
              total: payload.grandTotal,
              lastMeter: localStorage.getItem('lastMeter') ? JSON.parse(localStorage.getItem('lastMeter')) || 0 : 0,
              creditCardNo: payload.creditCardNo,
              creditCardType: payload.creditCardType,
              creditCardCharge: payload.creditCardCharge,
              totalCreditCard: payload.totalCreditCard,
              discount: payload.totalDiscount,
              rounding: payload.rounding,
              paid: payload.totalPayment,
              woId: localStorage.getItem('workorder') ? JSON.parse(localStorage.getItem('workorder')).id : null,
              paymentVia: payload.paymentVia,
              policeNo: localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')).policeNo : null,
              policeNoId: localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')).id : null,
              change: payload.totalChange,
              woReference: payload.woNumber,
              listAmount: payload.listAmount
            }
            const data_create = yield call(create, detailPOS)
            if (data_create.success) {
              const responsInsertPos = data_create.pos
              const memberUnit = localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')) : {}
              yield put({
                type: 'printPayment',
                payload: {
                  periode: payload.periode,
                  // transDate: payload.transDate,
                  // transDate2: payload.transDate2,

                  transTime: payload.transTime,
                  grandTotal: payload.grandTotal,
                  totalPayment: payload.totalPayment,
                  transDatePrint: moment(cashierInformation.period, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                  company: localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {},
                  gender: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].gender : 'No Member',
                  phone: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].phone : 'No Member',
                  address: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].address01 : 'No Member',
                  lastMeter: localStorage.getItem('lastMeter') ? JSON.parse(localStorage.getItem('lastMeter')) || 0 : 0,
                  lastTransNo: trans,
                  totalChange: payload.totalChange,
                  unitInfo: {
                    ...memberUnit,
                    lastCashback: responsInsertPos.lastCashback,
                    gettingCashback: responsInsertPos.gettingCashback,
                    discountLoyalty: responsInsertPos.discountLoyalty
                  },
                  totalDiscount: payload.totalDiscount,
                  policeNo: localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')).policeNo : payload.policeNo,
                  rounding: payload.rounding,
                  dataPos: getCashierTrans(),
                  dataService: localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : [],
                  memberCode: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].id : 'No Member',
                  memberId: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].memberCode : 'No member',
                  memberName: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].memberName : 'No member',
                  employeeName: localStorage.getItem('mechanic') ? JSON.parse(localStorage.getItem('mechanic'))[0].employeeName : 'No mechanic',
                  technicianId: payload.technicianId,
                  curShift: payload.curShift,
                  printNo: 1,
                  companyInfo: payload.companyInfo,
                  curCashierNo: payload.curCashierNo,
                  cashierId: payload.cashierId,
                  userName: payload.userName,
                  posMessage: 'Data has been saved',
                  type: 'POS'
                }
              })
              yield put({
                type: 'pos/setAllNull'
              })
              Modal.info({
                title: 'Information',
                content: 'Transaction has been saved...!'
              })
              // }
            } else {
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
        creditChargeAmount: (parseInt(netto, 10) * parseInt(creditCharge, 10)) / 100,
        creditCardTotal: (parseInt(netto, 10) + ((parseInt(netto, 10) * parseInt(creditCharge, 10)) / 100)),
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
      localStorage.setItem('memberUnit', JSON.stringify(action.payload.policeNo))
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
        totalChange: (action.payload.totalPayment - action.payload.netto)
      }
    },

    setCashPaymentNull (state) {
      return { ...state, inputPayment: 0, totalPayment: 0, totalChange: 0 }
    },

    printPayment (state, action) {
      const additionalMargin1 = [0, 10, 0, 10]
      const additionalMargin2 = [0, 20, 0, 40]
      const additionalFontSize = 9
      const bottomFontSize = 11
      const companyFontSize = 10
      const tableContentFontSize = 11
      const tableHeaderFontSize = 12
      const headerFontSize = 11
      const payload = action.payload
      const unitInfo = payload.unitInfo // header faktur
      const countCurrentCashback = (unitInfo.lastCashback + unitInfo.gettingCashback) - unitInfo.discountLoyalty
      const companyInfo = payload.companyInfo
      const dataPos = payload.dataPos
      const dataService = payload.dataService
      const merge = dataPos.length === 0 ? dataService : dataPos.concat(dataService)
      let Discount = merge.reduce((cnt, o) => cnt + (((o.sellPrice || o.price) * o.qty) - o.total), 0)
      let SubTotal = merge.reduce((cnt, o) => cnt + (o.price * o.qty), 0)
      let Total = merge.reduce((cnt, o) => cnt + o.total, 0)
      const nettoValue = (Total - (unitInfo.discountLoyalty || 0))
      const terbilangString = nettoValue > 0 ? `${terbilang(nettoValue)} RUPIAH` : 'NOL RUPIAH'
      if (merge.length !== []) {
        const createPdfLineItems = (tabledata, payload, node) => {
          let code = ''
          if (node === 1) {
            code = 'SERVICE'
          } else if (node === 0) {
            code = 'PRODUCT'
          }
          let headers = {
            top: {
              col_1: { fontSize: tableHeaderFontSize, text: 'NO', style: 'tableHeader', alignment: 'center' },
              col_2: { fontSize: tableHeaderFontSize, text: code, style: 'tableHeader', alignment: 'center' },
              col_3: { fontSize: tableHeaderFontSize, text: 'DESKRIPSI', style: 'tableHeader', alignment: 'center' },
              col_4: { fontSize: tableHeaderFontSize, text: 'QTY', style: 'tableHeader', alignment: 'center' },
              col_5: { fontSize: tableHeaderFontSize, text: 'HARGA', style: 'tableHeader', alignment: 'center' },
              col_6: { fontSize: tableHeaderFontSize, text: 'DISKON', style: 'tableHeader', alignment: 'center' },
              col_7: { fontSize: tableHeaderFontSize, text: 'SUB (RP)', style: 'tableHeader', alignment: 'center' }
            }
          }
          let rows = tabledata
          let body = []
          for (let key in headers) {
            if (headers.hasOwnProperty(key)) {
              let header = headers[key]
              let row = [
                header.col_1,
                header.col_2,
                header.col_3,
                header.col_4,
                header.col_5,
                header.col_6,
                header.col_7
              ]
              body.push(row)
            }
          }
          for (let key in rows) {
            if (rows.hasOwnProperty(key)) {
              let data = rows[key]
              let totalDisc = ((data.sellPrice || data.price) * data.qty) - data.total
              let row = [
                { text: (data.no || '').toString(), alignment: 'center', fontSize: tableContentFontSize },
                { text: (data.code || '').toString(), alignment: 'left', fontSize: tableContentFontSize },
                { text: (data.name || '').toString(), alignment: 'left', fontSize: tableContentFontSize },
                { text: (data.qty || 0).toString(), alignment: 'center', fontSize: tableContentFontSize },
                { text: `${(data.sellPrice ? data.sellPrice : data.price || 0).toLocaleString(['ban', 'id'])}`, alignment: 'right', fontSize: tableContentFontSize },
                { text: `${(totalDisc || 0).toLocaleString(['ban', 'id'])}`, alignment: 'right', fontSize: tableContentFontSize },
                { text: `${(data.total || 0).toLocaleString(['ban', 'id'])}`, alignment: 'right', fontSize: tableContentFontSize }
              ]
              body.push(row)
            }
          }
          if (rows === null) {
            body.push([{ text: ' ', fontSize: 11 }, {}, {}, {}, {}, {}, {}])
          }
          return body
        }
        let body = createPdfLineItems(dataService, payload, 1)
        let product = createPdfLineItems(dataPos, payload, 0)
        const table1 = {
          writable: true,
          table: {
            widths: ['4%', '20%', '36%', '4%', '12%', '12%', '12%'],
            headerRows: 1,
            body: product
          },
          layout: {
            hLineWidth: (i) => {
              return (i === 1 || i === 0) ? 0.01 : 0
            },
            vLineWidth: () => {
              return 0
            },
            hLineColor: (i) => {
              return (i === 1 || i === 0) ? 'black' : 'white'
            },
            vLineColor: () => {
              return 'white'
            }
          }
        }
        const table2 = {
          writable: true,
          table: {
            headerRows: 1,
            widths: ['4%', '20%', '36%', '4%', '12%', '12%', '12%'],
            body
          },
          layout: {
            hLineWidth: (i) => {
              return (i === 1 || i === 0) ? 0.01 : 0
            },
            vLineWidth: () => {
              return 0
            },
            hLineColor: (i) => {
              return (i === 1 || i === 0) ? 'black' : 'white'
            },
            vLineColor: () => {
              return 'white'
            }
          }
        }
        let salutation = ''
        if ((payload.memberId || '').toString().substring(0, 3) === 'mdn' || (payload.memberId || '').toString().substring(0, 3) === 'MDN') {
          if (payload.gender === 'M') {
            salutation = 'TN. '
          } else if (payload.gender === 'F') {
            salutation = 'NY. '
          }
        }
        const docDefinition = {
          pageSize: { width: 813, height: 530 },
          pageOrientation: 'landscape',
          pageMargins: [40, 170, 40, 160],
          header: {
            margin: [40, 12, 40, 30],
            stack: [
              { text: ' ', fontSize: headerFontSize, margin: [0, 0, 95, 0] },
              {
                columns: [
                  {
                    stack: [
                      {
                        text: companyInfo.companyName !== '' && companyInfo.companyName !== null ? (companyInfo.companyName || '') : '',
                        fontSize: tableHeaderFontSize,
                        alignment: 'left'
                      },
                      {
                        text: companyInfo.companyAddress !== '' && companyInfo.companyAddress !== null ? `${(companyInfo.companyAddress || '').substring(0, 65)}-${(companyInfo.companyAddress02 || '').substring(0, 65)}` : '',
                        fontSize: companyFontSize,
                        alignment: 'left'
                      },
                      {
                        text: companyInfo.taxID !== '' && companyInfo.taxID !== null ? `NPWP: ${(companyInfo.taxID || '').substring(0, 20)}` : '',
                        fontSize: companyFontSize,
                        alignment: 'left'
                      },
                      {
                        text: companyInfo.taxConfirmDate !== '' && companyInfo.taxConfirmDate !== null ? `Tgl. Pengukuhan: ${companyInfo.taxConfirmDate ? moment(companyInfo.taxConfirmDate).format('DD.MM.YYYY') : ''}` : '',
                        fontSize: companyFontSize,
                        alignment: 'left'
                      }
                    ]
                  },
                  {
                    stack: storeInfo
                  }
                ]
              },
              {
                canvas: [{ type: 'line', x1: 0, y1: 5, x2: 733, y2: 5, lineWidth: 0.5 }]
              },
              {
                columns: [
                  {

                  },
                  {
                    text: 'NOTA PENJUALAN',
                    style: 'header',
                    fontSize: 15,
                    alignment: 'center'
                  },
                  {
                  }
                ]
              },
              {
                table: {
                  widths: ['15%', '1%', '32%', '10%', '15%', '1%', '26%'],
                  body: [
                    [{ text: 'No Faktur', fontSize: headerFontSize }, ':', { text: (payload.lastTransNo || '').toString(), fontSize: headerFontSize }, {}, { text: 'No Polisi/KM', fontSize: headerFontSize }, ':', { text: `${(payload.policeNo || '').toString().toUpperCase()}/${(payload.lastMeter || 0).toString().toUpperCase()}`, fontSize: headerFontSize }],

                    [{ text: 'Tanggal Faktur', fontSize: headerFontSize }, ':', { text: (payload.transDatePrint || '').toString(), fontSize: headerFontSize }, {}, { text: 'Merk/Model', fontSize: headerFontSize }, ':', { text: `${(payload.unitInfo.merk || '').toString().toUpperCase()}${payload.unitInfo.model ? '/' : ''}${(payload.unitInfo.model || '').toString().toUpperCase()}`, fontSize: headerFontSize }],

                    [{ text: 'Customer', fontSize: headerFontSize }, ':', { text: `${(payload.memberName || '').toString().toUpperCase()}${payload.phone ? '/' : ''}${(payload.phone || '').toString().toUpperCase()}`, fontSize: headerFontSize }, {}, { text: 'Type/Tahun', fontSize: headerFontSize }, ':', { text: `${(payload.unitInfo.type || '').toString().toUpperCase()}${payload.unitInfo.year ? '/' : ''}${(payload.unitInfo.year || '').toString().toUpperCase()}`, fontSize: headerFontSize }],

                    [{ text: 'Alamat', fontSize: headerFontSize }, ':', { text: (payload.address || '').toString().toUpperCase().substring(0, 22), fontSize: headerFontSize }, {}, { text: 'Mechanic', fontSize: headerFontSize }, ':', { text: (payload.employeeName || '').toString().toUpperCase(), fontSize: headerFontSize }]
                  ]
                },
                layout: 'noBorders'
              }
            ]
          },
          content: [
            dataPos.length > 0 ? table1 : {},
            dataPos.length > 0 ? {
              text: ' ',
              style: 'header',
              fontSize: 12,
              alignment: 'left'
            } : {},
            dataService.length > 0 ? table2 : {}
          ],

          footer: (currentPage, pageCount) => {
            if (currentPage === pageCount) {
              return {
                margin: [40, 0, 40, 0],
                height: 160,
                stack: [
                  {
                    canvas: [{ type: 'line', x1: 0, y1: 5, x2: 733, y2: 5, lineWidth: 0.5 }]
                  },
                  {
                    table: {
                      widths: ['15%', '1%', '32%', '24%', '12%', '1%', '15%'],
                      height: '12',
                      body: [
                        [
                          { text: 'Terbilang', fontSize: additionalFontSize }, ':', { text: terbilangString.toUpperCase().substring(0, 38), fontSize: headerFontSize },
                          { text: 'Diterima oleh', fontSize: bottomFontSize, alignment: 'center', margin: [0, 1, 0, 0] },
                          { text: 'SubTotal', fontSize: headerFontSize }, ':', { text: `Rp ${(SubTotal).toLocaleString(['ban', 'id'])}`, fontSize: headerFontSize }
                        ],

                        [
                          {}, {}, { text: terbilangString.toUpperCase().substring(38, 96), fontSize: headerFontSize },
                          {},
                          { text: 'Anda Hemat', fontSize: headerFontSize }, ':', { text: `Rp ${(Discount + unitInfo.discountLoyalty).toLocaleString(['ban', 'id'])}`, fontSize: headerFontSize }
                        ],
                        [
                          { text: 'Cashback', fontSize: additionalFontSize }, ':', { text: `${unitInfo.lastCashback} + ${unitInfo.gettingCashback} - ${unitInfo.discountLoyalty} = ${countCurrentCashback}`, fontSize: headerFontSize },
                          {},
                          { text: 'D. Cashback', fontSize: headerFontSize }, ':', { text: `Rp ${(unitInfo.discountLoyalty).toLocaleString(['ban', 'id'])}`, fontSize: headerFontSize }
                        ]
                      ]
                    },
                    layout: {
                      hLineWidth: () => 0,
                      vLineWidth: () => 0,
                      hLineColor: () => '',
                      vLineColor: () => '',
                      paddingLeft: () => 0,
                      paddingRight: () => 0,
                      paddingTop: () => 0,
                      paddingBottom: () => 0
                    }
                  },
                  {
                    table: {
                      widths: ['30%', '1%', '17%', '24%', '12%', '1%', '15%'],
                      height: '12',
                      body: [
                        [
                          { text: '* Harga sudah termasuk PPN 10%', fontSize: additionalFontSize, alignment: 'left' }, {}, {},
                          {},
                          { text: 'TOTAL', fontSize: headerFontSize, bold: true }, ':', { text: `Rp ${(Total - unitInfo.discountLoyalty).toLocaleString(['ban', 'id'])}`, fontSize: headerFontSize, bold: true }
                        ],
                        [
                          {}, {}, {},
                          { text: `\n${salutation}${(payload.memberName || '').toString()}`, fontSize: bottomFontSize, alignment: 'center', margin: [0, 0, 0, 0] },
                          {}, {}, {}
                        ]

                      ]
                    },
                    layout: {
                      hLineWidth: () => 0,
                      vLineWidth: () => 0,
                      hLineColor: () => '',
                      vLineColor: () => '',
                      paddingLeft: () => 0,
                      paddingRight: () => 0,
                      paddingTop: () => 0,
                      paddingBottom: () => 0
                    }
                  },
                  // {
                  //   columns: [
                  //     {
                  //       table: {
                  //         widths: ['20%', '1%', '79%'],
                  //         body: [
                  //           [{ text: 'Terbilang', fontSize: headerFontSize }, ':', { text: `${terbilang(Total - (unitInfo.discountLoyalty || 0)).toUpperCase()}RUPIAH`, fontSize: headerFontSize }],
                  //           [{ text: 'Cashback', fontSize: headerFontSize }, ':', { text: `${unitInfo.lastCashback} + ${unitInfo.gettingCashback} - ${unitInfo.discountLoyalty} = ${countCurrentCashback}`, fontSize: headerFontSize }]
                  //         ]
                  //       },
                  //       layout: 'noBorders'
                  //     },
                  //     { text: `Diterima oleh \n\n\n\n. . . . . . . . . . . . . . . .  \n${salutation}${(payload.memberName || '').toString()}`, fontSize: bottomFontSize, alignment: 'right', margin: [0, 5, 0, 0] },
                  //     {
                  //       table: {
                  //         widths: ['20%', '39%', '1%', '40%'],
                  //         body: [
                  //           [{}, { text: 'SubTotal', fontSize: headerFontSize }, ':', { text: `Rp ${(SubTotal).toLocaleString(['ban', 'id'])}`, fontSize: headerFontSize }],
                  //           [{}, { text: 'Anda Hemat', fontSize: headerFontSize }, ':', { text: `Rp ${(Discount + unitInfo.discountLoyalty).toLocaleString(['ban', 'id'])}`, fontSize: headerFontSize }],
                  //           [{}, { text: 'D. Cashback', fontSize: headerFontSize }, ':', { text: `Rp ${(unitInfo.discountLoyalty).toLocaleString(['ban', 'id'])}`, fontSize: headerFontSize }],
                  //           [{}, { text: 'TOTAL', fontSize: headerFontSize, bold: true }, ':', { text: `Rp ${(Total - unitInfo.discountLoyalty).toLocaleString(['ban', 'id'])}`, fontSize: headerFontSize, bold: true }]
                  //         ]
                  //       },
                  //       layout: 'noBorders'
                  //     }
                  //   ]
                  // },
                  // {
                  //   columns: [
                  //     { text: '* Harga sudah termasuk PPN 10%', fontSize: additionalFontSize, alignment: 'left' }
                  //   ]
                  // },
                  {
                    columns: [
                      {
                        text: `Tgl Cetak: ${moment().format('DD-MM-YYYY HH:mm:ss')}`,
                        margin: additionalMargin1,
                        fontSize: additionalFontSize,
                        alignment: 'left'
                      },
                      {
                        text: `Cetakan ke: ${payload.printNo}`,
                        margin: additionalMargin1,
                        fontSize: additionalFontSize,
                        alignment: 'center'
                      },
                      {
                        text: `Dicetak Oleh: ${payload.userName}`,
                        margin: additionalMargin1,
                        fontSize: additionalFontSize,
                        alignment: 'center'
                      },
                      {
                        text: `page: ${(currentPage || '').toString()} of ${pageCount}\n`,
                        fontSize: additionalFontSize,
                        margin: additionalMargin1,
                        alignment: 'right'
                      }
                    ],
                    alignment: 'center'
                  }
                ]
              }
            }
            return {
              margin: [40, 100, 40, 10],
              height: 160,
              stack: [
                {
                  canvas: [{ type: 'line', x1: 0, y1: 5, x2: 733, y2: 5, lineWidth: 0.5 }]
                },
                {
                  columns: [
                    {
                      text: `Tgl Cetak: ${moment().format('DD-MM-YYYY HH:mm:ss')}`,
                      margin: additionalMargin2,
                      fontSize: additionalFontSize,
                      alignment: 'left'
                    },
                    {
                      text: `Cetakan ke: ${payload.printNo}`,
                      margin: additionalMargin2,
                      fontSize: additionalFontSize,
                      alignment: 'center'
                    },
                    {
                      text: `Dicetak Oleh: ${payload.cashierId}`,
                      margin: additionalMargin2,
                      fontSize: additionalFontSize,
                      alignment: 'center'
                    },
                    {
                      text: `page: ${(currentPage || '').toString()} of ${pageCount}\n`,
                      margin: additionalMargin2,
                      fontSize: additionalFontSize,
                      alignment: 'right'
                    }
                  ]
                }
              ]
            }
          }
        }
        try {
          pdfMake.createPdf(docDefinition).print()
        } catch (e) {
          console.log(e)
          pdfMake.createPdf(docDefinition).download()
        }
      }
      const { posMessage } = action.payload
      if (payload.type === 'POS') {
        try {
          localStorage.removeItem('cashier_trans')
          localStorage.removeItem('service_detail')
          localStorage.removeItem('member')
          localStorage.removeItem('memberUnit')
          localStorage.removeItem('mechanic')
          localStorage.removeItem('lastMeter')
          localStorage.removeItem('workorder')
          localStorage.removeItem('woNumber')
          localStorage.removeItem('bundle_promo')
        } catch (e) {
          Modal.error({
            title: 'Error, Something Went Wrong!',
            content: `Cache is not cleared correctly :${e}`
          })
        }
      }
      return {
        ...state,
        memberUnitInfo: {
          id: null,
          policeNo: null,
          merk: null,
          model: null
        },
        listAmount: [],
        usingWo: false,
        woNumber: null,
        posMessage,
        totalPayment: 0,
        totalChange: 0,
        lastTransNo: '',
        inputPayment: '',
        creditCardTotal: 0,
        creditCharge: 0,
        creditChargeAmount: 0,
        creditCardNo: 0,
        creditCardType: '',
        modalCreditVisible: false
      }
    },

    setCreditCardPaymentNull (state) {
      return { ...state, creditCardTotal: 0, creditCharge: 0, creditChargeAmount: 0, creditCardNo: 0, creditCardType: '' }
    },

    addMethod (state, action) {
      let { listAmount } = state
      const exists = listAmount.filter(x => x.typeCode === action.payload.data.typeCode)
      if (exists.length > 0 && action.payload.data.typeCode === 'C') {
        Modal.info({
          title: 'Payment Already Exists and Added',
          content: 'Please Check Payment'
        })
        return { ...state }
      }
      listAmount.push(action.payload.data)
      return { ...state, listAmount }
    },

    editMethod (state, action) {
      let { listAmount } = state
      const exists = listAmount.filter(x => x.typeCode === action.payload.data.typeCode)
      if ((exists[0] || {}).id !== action.payload.data.id && exists.length > 0 && action.payload.data.typeCode === 'C') {
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
      listAmount[action.payload.data.id - 1] = (action.payload.data)
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
