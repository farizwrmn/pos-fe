import { Modal } from 'antd'
import moment from 'moment'
import config from 'config'
import { lstorage } from 'utils'
import { addSome } from '../services/payment/payment'
import * as cashierService from '../services/payment'
import * as cashierTransService from '../services/cashier'
import * as creditChargeService from '../services/creditCharge'
import { query as querySequence, increase as increaseSequence } from '../services/sequence'

const terbilang = require('terbilang-spelling')
const pdfMake = require('pdfmake/build/pdfmake.js')
const pdfFonts = require('pdfmake/build/vfs_fonts.js')

pdfMake.vfs = pdfFonts.pdfMake.vfs

const { prefix } = config
const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)).stackHeader02 : []

const { create, createDetail } = cashierService
const { updateCashierTrans } = cashierTransService
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
        if (location.pathname === '/transaction/pos/payment') {
          dispatch({ type: 'setLastTrans', payload: { seqCode: 'INV', type: lstorage.getCurrentUserStore() } }) // type diganti storeId
          dispatch({
            type: 'updateState',
            payload: {
              listAmount: [],
              itemPayment: {}
            }
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
      } else if (payload.phone === undefined) {
        Modal.error({
          title: 'Payment Fail',
          content: 'Phone is Undefined'
        })
      } else if (payload.policeNo === undefined) {
        Modal.error({
          title: 'Payment Fail',
          content: 'Unit is Undefined'
        })
      } else {
        // let data = yield call(queryLastTransNo, payload.periode)
        let arrayProd = []
        const product = localStorage.getItem('cashier_trans') ? JSON.parse(localStorage.getItem('cashier_trans')) : []
        const service = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
        const dataPos = product.concat(service)
        const trans = transNo.data
        const storeId = lstorage.getCurrentUserStore()
        for (let key = 0; key < dataPos.length; key += 1) {
          arrayProd.push({
            storeId,
            transNo: trans,
            productId: dataPos[key].productId,
            productCode: dataPos[key].code,
            productName: dataPos[key].name,
            qty: dataPos[key].qty,
            typeCode: dataPos[key].typeCode,
            sellingPrice: dataPos[key].price,
            discount: dataPos[key].discount,
            disc1: dataPos[key].disc1,
            disc2: dataPos[key].disc2,
            disc3: dataPos[key].disc3
          })
        }

        const detailPOS = {
          dataPos: arrayProd,
          transNo: trans,
          storeId: lstorage.getCurrentUserStore(),
          memberCode: payload.memberCode,
          technicianId: payload.technicianId,
          cashierNo: payload.curCashierNo,
          cashierId: payload.cashierId,
          shift: payload.curShift,
          transDate: `${moment().format('YYYYMMDD')}`,
          transTime: payload.transTime,
          total: payload.grandTotal,
          lastMeter: localStorage.getItem('lastMeter') ? localStorage.getItem('lastMeter') : 0,
          creditCardNo: payload.creditCardNo,
          creditCardType: payload.creditCardType,
          creditCardCharge: payload.creditCardCharge,
          totalCreditCard: payload.totalCreditCard,
          discount: payload.totalDiscount,
          rounding: payload.rounding,
          paid: payload.totalPayment,
          paymentVia: payload.paymentVia,
          policeNo: localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')).policeNo : null,
          policeNoId: localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')).id : null,
          change: payload.totalChange,
          woReference: payload.woNumber
        }
        const point = parseInt((payload.grandTotal / 10000), 10)
        const data_create = yield call(create, detailPOS)
        if (data_create.success) {
          const data_detail = yield call(createDetail, {
            data: arrayProd,
            transNo: trans
          })
          if (data_detail.success) {
            try {
              const transNoIncrease = yield call(increaseSequence, invoice)
              console.log('transNoincrease', transNoIncrease)
            } catch (e) {
              Modal.warning({
                title: 'Something went wrong',
                content: `Call your IT support, message: ${e}`
              })
            }

            try {
              yield call(addSome, {
                head: {
                  transNo: trans,
                  storeId: lstorage.getCurrentUserStore(),
                  storeIdPayment: lstorage.getCurrentUserStore()
                },
                data: payload.listAmount
              })
            } catch (e) {
              Modal.warning({
                title: 'Something went wrong',
                content: `Call your IT support, message: ${e}`
              })
            }

            yield put({
              type: 'printPayment',
              payload: {
                periode: payload.periode,
                transDate: payload.transDate,
                transDate2: payload.transDate2,
                transTime: payload.transTime,
                grandTotal: payload.grandTotal,
                totalPayment: payload.totalPayment,
                transDatePrint: payload.transDatePrint,
                company: localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {},
                gender: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].gender : 'No Member',
                phone: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].phone : 'No Member',
                address: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].address01 : 'No Member',
                lastMeter: localStorage.getItem('lastMeter') ? JSON.parse(localStorage.getItem('lastMeter')) : 0,
                lastTransNo: trans,
                totalChange: payload.totalChange,
                unitInfo: localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')) : {},
                totalDiscount: payload.totalDiscount,
                policeNo: localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')).policeNo : payload.policeNo,
                rounding: payload.rounding,
                dataPos: localStorage.getItem('cashier_trans') ? JSON.parse(localStorage.getItem('cashier_trans')) : [],
                dataService: localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : [],
                memberCode: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].id : 'No Member',
                memberId: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].memberCode : 'No member',
                memberName: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].memberName : 'No member',
                mechanicName: localStorage.getItem('mechanic') ? JSON.parse(localStorage.getItem('mechanic'))[0].mechanicName : 'No mechanic',
                technicianId: payload.technicianId,
                curShift: payload.curShift,
                printNo: 1,
                point,
                curCashierNo: payload.curCashierNo,
                cashierId: payload.cashierId,
                userName: payload.userName,
                posMessage: 'Data has been saved',
                type: 'POS'
              }
            })
            const data_cashier_trans_update = yield call(updateCashierTrans, {
              total: ((parseInt(payload.grandTotal, 10) - parseInt(payload.totalDiscount, 10)) + parseInt(payload.rounding, 10)),
              totalCreditCard: payload.totalCreditCard,
              status: 'O',
              cashierNo: payload.curCashierNo,
              shift: payload.curShift,
              transDate: payload.transDate2
            })
            if (data_cashier_trans_update.success) {
              Modal.info({
                title: 'Information',
                content: 'Transaction has been saved...!'
              })
            }
          }
        } else {
          Modal.error({
            title: 'Error Saving Payment',
            content: `${JSON.stringify(data_create.message)}`
          })
        }
      }
    },

    * setLastTrans ({ payload }, { call, put }) {
      const transNo = yield call(querySequence, payload)
      localStorage.setItem('transNo', transNo.data)
      console.log('transNo', transNo.data)
      yield put({
        type: 'lastTransNo',
        payload: transNo.data
      })
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
    successPost (state, action) {
      const { posMessage } = action.payload
      localStorage.removeItem('cashier_trans')
      localStorage.removeItem('service_detail')
      localStorage.removeItem('member')
      localStorage.removeItem('memberUnit')
      localStorage.removeItem('lastMeter')
      return {
        ...state,
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
      const payload = action.payload
      const dataPos = payload.dataPos
      const dataService = payload.dataService
      const merge = dataPos.length === 0 ? dataService : dataPos.concat(dataService)
      let Total = merge.reduce((cnt, o) => cnt + o.total, 0)
      if (merge.length !== []) {
        const createPdfLineItems = (tabledata, payload, node) => {
          let code = ''
          if (node === 1) {
            code = 'Service'
          } else if (node === 0) {
            code = 'Product'
          }
          let headers = {
            top: {
              col_1: { fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' },
              col_2: { fontSize: 12, text: code, style: 'tableHeader', alignment: 'center' },
              col_3: { fontSize: 12, text: 'DESKRIPSI', style: 'tableHeader', alignment: 'center' },
              col_4: { fontSize: 12, text: 'QTY', style: 'tableHeader', alignment: 'center' },
              col_5: { fontSize: 12, text: '@HET', style: 'tableHeader', alignment: 'center' },
              col_6: { fontSize: 12, text: 'DISKON', style: 'tableHeader', alignment: 'center' },
              col_7: { fontSize: 12, text: 'SUB (RP)', style: 'tableHeader', alignment: 'center' }
            }
          }
          let rows = tabledata
          let body = []
          for (let key in headers) {
            if (headers.hasOwnProperty(key)) {
              let header = headers[key]
              let row = []
              row.push(header.col_1)
              row.push(header.col_2)
              row.push(header.col_3)
              row.push(header.col_4)
              row.push(header.col_5)
              row.push(header.col_6)
              row.push(header.col_7)
              body.push(row)
            }
          }
          for (let key in rows) {
            if (rows.hasOwnProperty(key)) {
              let data = rows[key]
              let totalDisc = (data.price * data.qty) - data.total
              let row = []
              row.push({ text: data.no.toString(), alignment: 'center', fontSize: 11 })
              row.push({ text: data.code.toString(), alignment: 'left', fontSize: 11 })
              row.push({ text: data.name.toString(), alignment: 'left', fontSize: 11 })
              row.push({ text: data.qty.toString(), alignment: 'center', fontSize: 11 })
              row.push({ text: `${data.price.toLocaleString(['ban', 'id'])}`, alignment: 'right', fontSize: 11 })
              row.push({ text: `${totalDisc.toLocaleString(['ban', 'id'])}`, alignment: 'right', fontSize: 11 })
              row.push({ text: `${data.total.toLocaleString(['ban', 'id'])}`, alignment: 'right', fontSize: 11 })
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
        let salutation = ''
        if (payload.memberId.toString().substring(0, 3) === 'mdn' || payload.memberId.toString().substring(0, 3) === 'MDN') {
          if (payload.gender === 'M') {
            salutation = 'TN. '
          } else if (payload.gender === 'F') {
            salutation = 'NY. '
          }
        }
        const docDefinition = {
          pageSize: { width: 813, height: 530 },
          pageOrientation: 'landscape',
          pageMargins: [40, 160, 40, 150],
          header: {
            stack: [
              {
                columns: [
                  {
                    stack: storeInfo
                  },
                  {
                    text: 'NOTA PENJUALAN',
                    style: 'header',
                    fontSize: 18,
                    alignment: 'center'
                  },
                  {
                    text: ' ',
                    style: 'header',
                    fontSize: 18,
                    alignment: 'right'
                  }
                ]
              },
              {
                table: {
                  widths: ['15%', '1%', '32%', '10%', '15%', '1%', '27%'],
                  body: [
                    [{ text: 'No Faktur', fontSize: 12 }, ':', { text: (payload.lastTransNo || '').toString(), fontSize: 12 }, {}, { text: 'No Polisi/KM', fontSize: 12 }, ':', { text: `${(payload.policeNo || '').toString().toUpperCase()}/${(payload.lastMeter || 0).toString().toUpperCase()}`, fontSize: 12 }],

                    [{ text: 'Tanggal Faktur', fontSize: 12 }, ':', { text: (payload.transDatePrint || '').toString(), fontSize: 12 }, {}, { text: 'Merk/Model', fontSize: 12 }, ':', { text: `${(payload.unitInfo.merk || '').toString().toUpperCase()}${payload.unitInfo.model ? '/' : ''}${(payload.unitInfo.model || '').toString().toUpperCase()}`, fontSize: 12 }],

                    [{ text: 'Customer', fontSize: 12 }, ':', { text: `${(payload.memberName || '').toString().toUpperCase()}${payload.phone ? '/' : ''}${(payload.phone || '').toString().toUpperCase()}`, fontSize: 12 }, {}, { text: 'Type/Tahun', fontSize: 12 }, ':', { text: `${(payload.unitInfo.type || '').toString().toUpperCase()}${payload.unitInfo.year ? '/' : ''}${(payload.unitInfo.year || '').toString().toUpperCase()}`, fontSize: 12 }],

                    [{ text: 'Alamat', fontSize: 12 }, ':', { text: (payload.address || '').toString().toUpperCase().substring(0, 22), fontSize: 12 }, {}, { text: 'Mechanic', fontSize: 12 }, ':', { text: (payload.mechanicName || '').toString().toUpperCase(), fontSize: 12 }]
                  ]
                },
                layout: 'noBorders'
              },
              {
                canvas: [{ type: 'line', x1: 0, y1: 5, x2: 733, y2: 5, lineWidth: 0.5 }]
              }
            ],
            margin: [30, 12, 12, 30]
          },

          content: [
            {
              writable: true,
              table: {
                widths: ['4%', '20%', '36%', '4%', '12%', '12%', '12%'],
                headerRows: 1,
                body: product
              },
              layout: {
                hLineWidth: (i, node) => {
                  return (i === 1 || i === 0 || i === node.table.body.length) ? 0.01 : 0
                },
                vLineWidth: (i, node) => {
                  return (i === 0 || i === node.table.widths.length) ? 0 : 0
                },
                hLineColor: (i, node) => {
                  return (i === 1 || i === 0 || i === node.table.body.length) ? 'black' : 'white'
                },
                vLineColor: (i, node) => {
                  return (i === 0 || i === node.table.widths.length) ? 'black' : 'black'
                }
              }
            },
            {
              text: ' ',
              style: 'header',
              fontSize: 12,
              alignment: 'left'
            },
            {
              writable: true,
              table: {
                headerRows: 1,
                widths: ['4%', '20%', '36%', '4%', '12%', '12%', '12%'],
                body
              },
              layout: {
                hLineWidth: (i, node) => {
                  return (i === 1 || i === 0 || i === node.table.body.length) ? 0.01 : 0
                },
                vLineWidth: (i, node) => {
                  return (i === 0 || i === node.table.widths.length) ? 0 : 0
                },
                hLineColor: (i, node) => {
                  return (i === 1 || i === 0 || i === node.table.body.length || i === (node.table.body.length - 1)) ? 'black' : 'white'
                },
                vLineColor: (i, node) => {
                  return (i === 0 || i === node.table.widths.length) ? 'black' : 'black'
                }
              }
            }
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
                    columns: [
                      { fontSize: 12, text: `Terbilang : ${terbilang(Total).toUpperCase()} RUPIAH`, alignment: 'left' },
                      { fontSize: 12, text: `TOTAL : Rp ${(Total).toLocaleString(['ban', 'id'])}`, alignment: 'right' }
                    ]
                  },
                  {
                    columns: [
                      { text: `Dibuat oleh \n\n\n\n. . . . . . . . . . . . . . . .  \n${payload.userName.toString()}`, fontSize: 12, alignment: 'center', margin: [0, 5, 0, 0] },
                      { text: `Diterima oleh \n\n\n\n. . . . . . . . . . . . . . . .  \n${salutation}${payload.memberName.toString()}`, fontSize: 12, alignment: 'center', margin: [0, 5, 0, 0] }
                    ]
                  },
                  {
                    fontSize: 9,
                    columns: [
                      {
                        text: `Tgl Cetak: ${moment().format('DD-MM-YYYY hh:mm:ss')}`,
                        margin: [0, 10, 0, 10],
                        fontSize: 9,
                        alignment: 'left'
                      },
                      {
                        text: `Cetakan ke: ${payload.printNo}`,
                        margin: [0, 10, 0, 10],
                        fontSize: 9,
                        alignment: 'center'
                      },
                      {
                        text: `Dicetak Oleh: ${payload.userName}`,
                        margin: [0, 10, 0, 10],
                        fontSize: 9,
                        alignment: 'center'
                      },
                      {
                        text: `page: ${currentPage.toString()} of ${pageCount}\n`,
                        fontSize: 9,
                        margin: [0, 10, 0, 10],
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
                      text: `Tgl Cetak: ${moment().format('DD-MM-YYYY hh:mm:ss')}`,
                      margin: [0, 20, 0, 40],
                      fontSize: 9,
                      alignment: 'left'
                    },
                    {
                      text: `Cetakan ke: ${payload.printNo}`,
                      margin: [0, 20, 0, 40],
                      fontSize: 9,
                      alignment: 'center'
                    },
                    {
                      text: `Dicetak Oleh: ${payload.cashierId}`,
                      margin: [0, 20, 0, 40],
                      fontSize: 9,
                      alignment: 'center'
                    },
                    {
                      text: `page: ${currentPage.toString()} of ${pageCount}\n`,
                      fontSize: 9,
                      margin: [0, 20, 0, 40],
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
          localStorage.removeItem('woNumber')
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
      listAmount.push(action.payload.data)
      return { ...state, listAmount }
    },

    editMethod (state, action) {
      let { listAmount } = state
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
