import * as cashierService from '../services/payment'
import * as cashierTransService from '../services/cashier'
import * as creditChargeService from '../services/creditCharge'
import { editPoint as updateMemberPoint} from '../services/customers'
import { queryMode as miscQuery} from '../services/misc'

import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { Modal } from 'antd'
import moment from 'moment'
const pdfMake = require('pdfmake/build/pdfmake.js');
const pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
const terbilang = require('terbilang-spelling')
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
    print: '',
    company: [],
    lastTransNo: '',
    totalPayment: 0,
    totalChange: 0,
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
      if (payload.address === undefined) {
        const modal = Modal.error({
          title: 'Payment Fail',
          content: 'Address is Undefined',
        })
      } else if (payload.memberId === undefined) {
        Modal.error({
          title: 'Payment Fail',
          content: 'Member Id is Undefined',
        })
      } else if (payload.phone === undefined) {
        Modal.error({
          title: 'Payment Fail',
          content: 'Phone is Undefined',
        })
      } else if (payload.policeNo === undefined || payload.policeNo === null) {
        Modal.error({
          title: 'Payment Fail',
          content: 'Unit is Undefined',
        })
      }
      else {
        var datatrans
        var dataLast
        var data = yield call(queryLastTransNo, payload.periode)
        function pad(n, width, z) {
          z = z || '0';
          n = n + '';
          return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        }
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

        var lastNo = parseTransNo.transNo ? parseTransNo.transNo : parseTransNo
        lastNo = lastNo.replace(/[^a-z0-9]/gi,'')
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
          const product = localStorage.getItem('cashier_trans') ? JSON.parse(localStorage.getItem('cashier_trans')) : []
          const service = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
          const dataPos = service === [] ? product : product === [] ? service : product.concat(service)
          if (transNo.indexOf('FJ') > -1) {
            transNo = transNo.substring(0, 2) + '/' + transNo.substring(2,6) + '/' + transNo.substring(6,10)
          }
          const trans = transNo.replace(/[^a-z0-9]/gi, '');
          for (var key = 0; key < dataPos.length; key++) {
            arrayProd.push({
              'transNo': trans,
              'productId': dataPos[key].productId,
              'productCode': dataPos[key].code,
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
            "transNo": trans,
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

          const data_create = yield call(create, detailPOS)
          if (data_create.success) {
            yield put({
              type: 'printPayment',
              payload: {
                memberId: payload.memberId,
                gender: payload.gender,
                company: payload.company,
                lastTransNo: payload.lastTransNo,
                phone: payload.phone,
                memberName: payload.memberName,
                policeNo: payload.policeNo,
                lastMeter: payload.lastMeter,
                address: payload.address,
                mechanicName: payload.mechanicName,
                cashierId: payload.cashierId,
              },
            })
            const data_cashier_trans_update = yield call(updateCashierTrans, {"total": (parseInt(payload.grandTotal) - parseInt(payload.totalDiscount) + parseInt(payload.rounding)),
              "totalCreditCard": payload.totalCreditCard,
              "status": "O",
              "cashierNo": payload.curCashierNo,
              "shift": payload.curShift,
              "transDate": payload.transDate2,})
            yield call (createDetail, { 'data': arrayProd, 'transNo': trans})
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
            }

          } else {
            Modal.error({
              title: 'Error Saving Payment',
              content: 'Your Data not saved',
            })
          }
        }
      }
    },

    * setLastTrans ({ payload }, { call, put }) {
      var datatrans
      var dataLast
      function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
      }
      var data = yield call(queryLastTransNo)
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

      var lastNo = parseTransNo.transNo ? parseTransNo.transNo : parseTransNo
      lastNo = lastNo.replace(/[^a-z0-9]/gi,'')
      var newMonth = lastNo.substr(2,4)
      var lastTransNo = lastNo.substr(lastNo.length - 4)
      var sendTransNo = parseInt(lastTransNo) + 1
      var padding = pad(sendTransNo,4)

      if (newMonth==`${moment().format('MMYY')}`){
        var transNo = `FJ${moment().format('MMYY')}${padding}`
      } else {
        var transNo = `FJ${moment().format('MMYY')}0001`
      }
      if (transNo.indexOf('FJ') > -1) {
        transNo = transNo.substring(0, 2) + '/' + transNo.substring(2,6) + '/' + transNo.substring(6,10)
      }
      localStorage.setItem('transNo', transNo)
      const trans = transNo.replace(/[^a-z0-9]/gi, '');
      yield put ({
        type: 'lastTransNo',
        payload: transNo
      })
    },

    * print ({ payload }, { put,call }) {
      console.log('payload', payload)
      if (payload.address === undefined) {
        const modal = Modal.error({
          title: 'Print Fail',
          content: 'Address is Undefined',
        })
      } else if (payload.memberId === undefined) {
        Modal.error({
          title: 'Print Fail',
          content: 'Member Id is Undefined',
        })
      } else if (payload.phone === undefined) {
        Modal.error({
          title: 'Print Fail',
          content: 'Phone is Undefined',
        })
      } else if (payload.policeNo === undefined || payload.policeNo === null) {
        Modal.error({
          title: 'Print Fail',
          content: 'Unit is Undefined',
        })
      }
      else {
        const dataPos = localStorage.getItem('cashier_trans') ? JSON.parse(localStorage.getItem('cashier_trans')) : []
        const dataService = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
        const merge = dataPos === [] ? dataService : dataPos.concat(dataService)
        var Total = merge.reduce( function(cnt,o){ return cnt + o.total; }, 0)
        if (merge === [] ? false : true ) {
          function createPdfLineItems(tabledata, payload, node){
            var code = ''
            if (node === 1) {
              code = 'Service'
            } else if (node === 0) {
              code = 'Product'
            }
            var headers = {
              top:{
                col_1:{ fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' },
                col_2:{ fontSize: 12, text: code, style: 'tableHeader', alignment: 'center' },
                col_3:{ fontSize: 12, text: 'DESKRIPSI', style: 'tableHeader', alignment: 'center' },
                col_4:{ fontSize: 12, text: 'QTY', style: 'tableHeader', alignment: 'center' },
                col_5:{ fontSize: 12, text: '@HET', style: 'tableHeader', alignment: 'center' },
                col_6:{ fontSize: 12, text: 'DISKON', style: 'tableHeader', alignment: 'center' },
                col_7:{ fontSize: 12, text: 'SUB (RP)', style: 'tableHeader', alignment: 'center' },
              }
            }
            var rows = tabledata;
            var body = [];
            for (var key in headers){
              if (headers.hasOwnProperty(key)){
                var header = headers[key];
                var row = new Array();
                row.push( header.col_1 );
                row.push( header.col_2 );
                row.push( header.col_3 );
                row.push( header.col_4 );
                row.push( header.col_5 );
                row.push( header.col_6 );
                row.push( header.col_7 );
                body.push(row);
              }
            }
            for (var key in rows)
            {
              if (rows.hasOwnProperty(key))
              {
                var data = rows[key];
                var totalDisc = (data.price * data.qty) - data.total
                var row = new Array();
                row.push( { text: data.no.toString(), alignment: 'center', fontSize: 11 } );
                row.push( { text: data.code.toString(), alignment: 'left', fontSize: 11 } );
                row.push( { text: data.name.toString(), alignment: 'left', fontSize: 11 } );
                row.push( { text: data.qty.toString(), alignment: 'center', fontSize: 11 });
                row.push( { text: `${data.price.toLocaleString(['ban', 'id'])}`, alignment: 'right', fontSize: 11 });
                row.push( { text: `${totalDisc.toLocaleString(['ban', 'id'])}`, alignment: 'right', fontSize: 11 });
                row.push( { text: `${data.total.toLocaleString(['ban', 'id'])}`, alignment: 'right', fontSize: 11 });
                body.push(row);
              }
            }
            // if (node != 1) {
            //   if(key < 2) {
            //     for (var n = 0; n < (2-key); n++) {
            //       body.push([{text: ' ', fontSize: 9}, {}, {}, {}, {}, {}, {}])
            //     }
            //   }
            // } else {
            //   if(key < 2) {
            //     for (var n = 0; n < (2-key); n++) {
            //       body.push([{text: ' ', fontSize: 9}, {}, {}, {}, {}, {}, {}])
            //     }
            //   }
            // }
            if (rows === null ? true : false) {
              body.push([{text: ' ', fontSize: 11}, {}, {}, {}, {}, {}, {}])
            }
            return body;
          }
          var body = createPdfLineItems(dataService, payload, 1)
          var product = createPdfLineItems(dataPos, payload, 0)
          var salutation = ''
          if(payload.memberId.toString().substring(0, 3) === 'mdn' || payload.memberId.toString().substring(0,3) === 'MDN') {
            if (payload.gender === 'M') {
              salutation = 'TN. '
            } else if (payload.gender === 'F') {
              salutation = 'NY. '
            }
          }
          var pageBreak = ' '
          if (merge.length > 4) {
            pageBreak = 'before'
          }
          var docDefinition = {
            pageSize: { width: 813, height: 530 },
            pageOrientation: 'landscape',
            pageMargins: [40, 160, 40, 160],
            header : {
              stack: [
                {
                  columns: [
                    {
                      stack: [
                        {
                          text: payload.company[0].miscName,
                          style: 'header',
                          fontSize: 11,
                          alignment: 'left'
                        },
                        {
                          text: payload.company[0].miscDesc,
                          style: 'header',
                          fontSize: 11,
                          alignment: 'left'
                        },
                        {
                          text: payload.company[0].miscVariable,
                          style: 'header',
                          fontSize: 11,
                          alignment: 'left'
                        },
                        {
                          text: ' ',
                          style: 'header',
                          fontSize: 11,
                          alignment: 'left'
                        },
                      ],
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
                    },
                  ],
                },
                {
                  table: {
                    widths: ['15%', '1%', '32%', '10%', '15%', '1%', '27%'],
                    body: [
                      [{text: 'No Faktur', fontSize: 12}, ':', {text: payload.lastTransNo.toString(), fontSize: 12}, {}, {text: 'No Polisi', fontSize: 12}, ':', {text: payload.policeNo.toString().toUpperCase(), fontSize: 12}],
                      [{text: 'Tanggal Faktur', fontSize: 12}, ':', {text: moment().format('DD/MM/YYYY'), fontSize: 12}, {}, {text: 'KM Terakhir', fontSize: 12}, ':', {text: payload.lastMeter.toString().toUpperCase(), fontSize: 12}],
                      [{text: 'Nama Customer', fontSize: 12}, ':', {text: `${salutation}${payload.memberName.toString().toUpperCase()}`, fontSize: 12}, {}, {text: 'Mechanic', fontSize: 12}, ':', {text: payload.mechanicName.toString().toUpperCase(), fontSize: 12}],
                      [{text: 'Contact', fontSize: 12}, ':', {text: payload.phone.toString().toUpperCase(), fontSize: 12}, {}, {text: 'Alamat', fontSize: 12}, ':', {text: payload.address.toString().toUpperCase().substring(0, 22), fontSize: 12}],
                    ]
                  },
                  layout: 'noBorders',
                },
                {
                  canvas: [{ type: 'line', x1: 0, y1: 5, x2: 813-2*40, y2: 5, lineWidth: 0.5 }]
                },
              ],
              margin: [30, 12, 12, 30],
            },

            content: [
              {
                writable: true,
                table: {
                  widths: ['4%', '22%', '40%', '4%', '10%', '10%', '10%'],
                  headerRows: 1,
                  body: product
                },
                layout: {
                  hLineWidth: function (i, node) {
                    return (i === 1 || i === 0 || i === node.table.body.length) ? 0.01 : 0;
                  },
                  vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 0.01 : 0.01;
                  },
                  hLineColor: function (i, node) {
                    return (i === 1 || i === 0 || i === node.table.body.length) ? 'black' : 'white';
                  },
                  vLineColor: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
                  },
                },
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
                  widths: ['4%', '22%', '40%', '4%', '10%', '10%', '10%'],
                  body: body
                },
                layout: {
                  hLineWidth: function (i, node) {
                    return (i === 1 || i === 0 || i === node.table.body.length) ? 0.01 : 0;
                  },
                  vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 0.01 : 0.01;
                  },
                  hLineColor: function (i, node) {
                    return (i === 1 || i === 0 || i === node.table.body.length || i === (node.table.body.length - 1)) ? 'black' : 'white';
                  },
                  vLineColor: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
                  },
                },
              },
              {
                stack: [
                ],
              },
            ],

            footer: function(currentPage, pageCount) {
              if (currentPage == pageCount) {
                return {
                  margin: [40, 0, 40, 0],
                  height: 160,
                  stack: [
                    {fontSize: 12, text: `TOTAL : Rp ${Total.toLocaleString(['ban', 'id'])}`, style: 'tableHeader', alignment: 'right'},
                    {
                      columns: [
                        {text: `Dibuat oleh \n\n\n\n. . . . . . . . . . . . . . . .  \n${payload.cashierId.toString()}`, fontSize: 12, alignment: 'center'},
                        {text: `Diterima oleh \n\n\n\n. . . . . . . . . . . . . . . .  \n${salutation}${payload.memberName.toString()}`, fontSize: 12, alignment: 'center'},
                      ],
                    },
                    {
                      fontSize: 9,
                      text: [
                        {
                          text: `Tgl Cetak: ${moment().format('DD-MM-YYYY hh:mm:ss')}      Cetakan ke: 1                Dicetak Oleh: ${payload.cashierId}`,
                          margin: [0, 0, 0, 40],
                          fontSize: 11,
                          alignment: 'center'
                        },
                        {
                          text: '                   page: ' + currentPage.toString() + ' of ' + pageCount + '\n',
                          fontSize: 11,
                        },
                        {
                          text: '_______________________________________________________________________________' +
                          '\n',
                          margin: [0, 0]
                        },
                        {
                          text: 'Pos © 2017 Darkotech Mandiri Indonesia'
                        }
                      ],
                      alignment: 'center'
                    }
                  ]
                };
              } else {
                return {
                  margin: [40, 100, 40, 10],
                  height: 160,
                  stack: [
                    {
                      fontSize: 9,
                      text: [
                        {
                          text: `Tgl Cetak: ${moment().format('DD-MM-YYYY hh:mm:ss')}      Cetakan ke: 1                Dicetak Oleh: ${payload.cashierId}`,
                          margin: [0, 0, 0, 40],
                          fontSize: 11,
                          alignment: 'center'
                        },
                        {
                          text: '                   page: ' + currentPage.toString() + ' of ' + pageCount + '\n',
                          fontSize: 11,
                        },
                        {
                          text: '_______________________________________________________________________________' +
                          '\n',
                          margin: [0, 20]
                        },
                        {
                          text: 'Pos © 2017 Darkotech Mandiri Indonesia'
                        }
                      ],
                      alignment: 'center'
                    }
                  ]
                };
              }
            },
          }
          pdfMake.createPdf(docDefinition).print()
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

    *setCompanyName ({ payload }, { call, put }) {
      const data = yield call(miscQuery, payload)
      if(data.data != []) {
        localStorage.setItem('company', JSON.stringify(data.data))
      } else {
        console.log('unexpected error misc')
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
      localStorage.removeItem('service_detail')
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

    lastTransNo (state, action) {
      return { ...state, lastTransNo: action.payload }
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

    printPayment (state, action) {
      const payload = action.payload
      console.log('payload', payload)
      const dataPos = payload.dataPos
      const dataService = payload.dataService
      const merge = dataPos === [] ? dataService : dataPos.concat(dataService)
      var Total = merge.reduce( function(cnt,o){ return cnt + o.total; }, 0)
      if (merge != []) {
        const createPdfLineItems = (tabledata, payload, node) => {
          var code = ''
          if (node === 1) {
            code = 'Service'
          } else if (node === 0) {
            code = 'Product'
          }
          var headers = {
            top:{
              col_1:{ fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' },
              col_2:{ fontSize: 12, text: code, style: 'tableHeader', alignment: 'center' },
              col_3:{ fontSize: 12, text: 'DESKRIPSI', style: 'tableHeader', alignment: 'center' },
              col_4:{ fontSize: 12, text: 'QTY', style: 'tableHeader', alignment: 'center' },
              col_5:{ fontSize: 12, text: '@HET', style: 'tableHeader', alignment: 'center' },
              col_6:{ fontSize: 12, text: 'DISKON', style: 'tableHeader', alignment: 'center' },
              col_7:{ fontSize: 12, text: 'SUB (RP)', style: 'tableHeader', alignment: 'center' },
            }
          }
          var rows = tabledata;
          var body = [];
          for (var key in headers){
            if (headers.hasOwnProperty(key)){
              var header = headers[key];
              var row = new Array();
              row.push( header.col_1 );
              row.push( header.col_2 );
              row.push( header.col_3 );
              row.push( header.col_4 );
              row.push( header.col_5 );
              row.push( header.col_6 );
              row.push( header.col_7 );
              body.push(row);
            }
          }
          for (var key in rows)
          {
            if (rows.hasOwnProperty(key))
            {
              var data = rows[key];
              var totalDisc = (data.price * data.qty) - data.total
              var row = new Array();
              row.push( { text: data.no.toString(), alignment: 'center', fontSize: 11 } );
              row.push( { text: data.code.toString(), alignment: 'left', fontSize: 11 } );
              row.push( { text: data.name.toString(), alignment: 'left', fontSize: 11 } );
              row.push( { text: data.qty.toString(), alignment: 'center', fontSize: 11 });
              row.push( { text: `${data.price.toLocaleString(['ban', 'id'])}`, alignment: 'right', fontSize: 11 });
              row.push( { text: `${totalDisc.toLocaleString(['ban', 'id'])}`, alignment: 'right', fontSize: 11 });
              row.push( { text: `${data.total.toLocaleString(['ban', 'id'])}`, alignment: 'right', fontSize: 11 });
              body.push(row);
            }
          }
          // if (node != 1) {
          //   if(key < 2) {
          //     for (var n = 0; n < (2-key); n++) {
          //       body.push([{text: ' ', fontSize: 9}, {}, {}, {}, {}, {}, {}])
          //     }
          //   }
          // } else {
          //   if(key < 2) {
          //     for (var n = 0; n < (2-key); n++) {
          //       body.push([{text: ' ', fontSize: 9}, {}, {}, {}, {}, {}, {}])
          //     }
          //   }
          // }
          if (rows === null ? true : false) {
            body.push([{text: ' ', fontSize: 11}, {}, {}, {}, {}, {}, {}])
          }
          return body;
        }
        var body = createPdfLineItems(dataService, payload, 1)
        var product = createPdfLineItems(dataPos, payload, 0)
        var salutation = ''
        if(payload.memberId.toString().substring(0, 3) === 'mdn' || payload.memberId.toString().substring(0,3) === 'MDN') {
          if (payload.gender === 'M') {
            salutation = 'TN. '
          } else if (payload.gender === 'F') {
            salutation = 'NY. '
          }
        }
        var pageBreak = ' '
        if (merge.length > 4) {
          pageBreak = 'before'
        }
        var docDefinition = {
          pageSize: { width: 813, height: 530 },
          pageOrientation: 'landscape',
          pageMargins: [40, 160, 40, 150],
          header : {
            stack: [
              {
                columns: [
                  {
                    stack: [
                      {
                        text: payload.company[0].miscName,
                        style: 'header',
                        fontSize: 11,
                        alignment: 'left'
                      },
                      {
                        text: payload.company[0].miscDesc,
                        style: 'header',
                        fontSize: 11,
                        alignment: 'left'
                      },
                      {
                        text: payload.company[0].miscVariable,
                        style: 'header',
                        fontSize: 11,
                        alignment: 'left'
                      },
                      {
                        text: ' ',
                        style: 'header',
                        fontSize: 11,
                        alignment: 'left'
                      },
                    ],
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
                  },
                ],
              },
              {
                table: {
                  widths: ['15%', '1%', '32%', '10%', '15%', '1%', '27%'],
                  body: [
                    [{text: 'No Faktur', fontSize: 12}, ':', {text: payload.lastTransNo.toString(), fontSize: 12}, {}, {text: 'No Polisi', fontSize: 12}, ':', {text: payload.policeNo.toString().toUpperCase(), fontSize: 12}],
                    [{text: 'Tanggal Faktur', fontSize: 12}, ':', {text: payload.transDatePrint.toString(), fontSize: 12}, {}, {text: 'KM Terakhir', fontSize: 12}, ':', {text: payload.lastMeter.toString().toUpperCase(), fontSize: 12}],
                    [{text: 'Nama Customer', fontSize: 12}, ':', {text: `${salutation}${payload.memberName.toString().toUpperCase()}`, fontSize: 12}, {}, {text: 'Mechanic', fontSize: 12}, ':', {text: payload.mechanicName.toString().toUpperCase(), fontSize: 12}],
                    [{text: 'Contact', fontSize: 12}, ':', {text: payload.phone.toString().toUpperCase(), fontSize: 12}, {}, {text: 'Alamat', fontSize: 12}, ':', {text: payload.address.toString().toUpperCase().substring(0, 22), fontSize: 12}],
                  ]
                },
                layout: 'noBorders',
              },
              {
                canvas: [{ type: 'line', x1: 0, y1: 5, x2: 813-2*40, y2: 5, lineWidth: 0.5 }]
              },
            ],
            margin: [30, 12, 12, 30],
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
                hLineWidth: function (i, node) {
                  return (i === 1 || i === 0 || i === node.table.body.length) ? 0.01 : 0;
                },
                vLineWidth: function (i, node) {
                  return (i === 0 || i === node.table.widths.length) ? 0 : 0;
                },
                hLineColor: function (i, node) {
                  return (i === 1 || i === 0 || i === node.table.body.length) ? 'black' : 'white';
                },
                vLineColor: function (i, node) {
                  return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
                },
              },
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
                body: body
              },
              layout: {
                hLineWidth: function (i, node) {
                  return (i === 1 || i === 0 || i === node.table.body.length) ? 0.01 : 0;
                },
                vLineWidth: function (i, node) {
                  return (i === 0 || i === node.table.widths.length) ? 0 : 0;
                },
                hLineColor: function (i, node) {
                  return (i === 1 || i === 0 || i === node.table.body.length || i === (node.table.body.length - 1)) ? 'black' : 'white';
                },
                vLineColor: function (i, node) {
                  return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
                },
              },
            },
          ],

          footer: function(currentPage, pageCount) {
            if (currentPage == pageCount) {
              return {
                margin: [40, 0, 40, 0],
                height: 160,
                stack: [
                  {
                    canvas: [{ type: 'line', x1: 0, y1: 5, x2: 813-2*40, y2: 5, lineWidth: 0.5 }]
                  },
                  {
                    columns: [
                      {fontSize: 12, text: `Terbilang : ${terbilang(Total).toUpperCase()} RUPIAH`, alignment: 'left'},
                      {fontSize: 12, text: `TOTAL : Rp ${Total.toLocaleString(['ban', 'id'])}`, alignment: 'right'},
                    ],
                  },
                  {
                    columns: [
                      {text: `Dibuat oleh \n\n\n\n. . . . . . . . . . . . . . . .  \n${payload.cashierId.toString()}`, fontSize: 12, alignment: 'center', margin: [0, 5, 0, 0] },
                      {text: `Diterima oleh \n\n\n\n. . . . . . . . . . . . . . . .  \n${salutation}${payload.memberName.toString()}`, fontSize: 12, alignment: 'center', margin: [0, 5, 0, 0] },
                    ],
                  },
                  {
                    fontSize: 9,
                    columns: [
                      {
                        text: `Tgl Cetak: ${moment().format('DD-MM-YYYY hh:mm:ss')}`,
                        margin: [0, 20, 0, 40],
                        fontSize: 9,
                        alignment: 'center'
                      },
                      {
                        text: `Cetakan ke: 1`,
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
                        text: 'page: ' + currentPage.toString() + ' of ' + pageCount + '\n',
                        fontSize: 9,
                        margin: [0, 20, 0, 40],
                        alignment: 'right',
                      },
                    ],
                    alignment: 'center'
                  }
                ]
              };
            } else {
              return {
                margin: [40, 100, 40, 10],
                height: 160,
                stack: [
                  {
                    canvas: [{ type: 'line', x1: 0, y1: 5, x2: 813-2*40, y2: 5, lineWidth: 0.5 }]
                  },
                  {
                    columns: [
                      {
                        text: `Tgl Cetak: ${moment().format('DD-MM-YYYY hh:mm:ss')}`,
                        margin: [0, 20, 0, 40],
                        fontSize: 9,
                        alignment: 'center'
                      },
                      {
                        text: `Cetakan ke: 1`,
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
                        text: 'page: ' + currentPage.toString() + ' of ' + pageCount + '\n',
                        fontSize: 9,
                        margin: [0, 20, 0, 40],
                        alignment: 'right',
                      },
                    ]
                  },
                ]
              }
            }
          },
        }
        pdfMake.createPdf(docDefinition).print()
        pdfMake.createPdf(docDefinition).download()
      }
      return { ...state}
    },

    setCreditCardPaymentNull (state, action) {
      return { ...state, creditCardTotal: 0, creditCharge: 0, creditChargeAmount: 0, creditCardNo: 0, creditCardType: '', }
    },

    setCreditCardNo (state, action) {
      return { ...state, creditCardNo: action.payload.creditCardNo, }
    }
  }
}
