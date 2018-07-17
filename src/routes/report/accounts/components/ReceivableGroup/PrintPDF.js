/**
 * Created by boo on 9/19/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'
import { numberFormat } from 'utils'

const { formatNumberIndonesia } = numberFormat

const PrintPDF = ({ user, listTrans, storeInfo, date,
  beginTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.beginValue || 0), 0),
  grandTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.nettoTotal || 0), 0),
  paidTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.paid || 0), 0),
  cashTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.cash || 0), 0),
  otherPaymentTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.otherPayment || 0), 0),
  receiveableTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.receiveable || 0), 0) }) => {
  // Declare Function
  const createTableBody = (tabledata) => {
    let body = []
    const rows = tabledata
    let count = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = [
          { text: count, alignment: 'center', style: 'tableContent' },
          { text: (data.invoiceDate ? moment(data.invoiceDate).format('DD-MMM-YYYY') : ''), alignment: 'left', style: 'tableContent' },
          { text: (data.transNo || '').toString(), alignment: 'left', style: 'tableContent' },
          { text: (data.memberName || '').toString(), alignment: 'left', style: 'tableContent' },
          { text: (data.memberGroupName || '').toString(), alignment: 'left', style: 'tableContent' },

          { text: formatNumberIndonesia(data.beginValue || 0), alignment: 'right', style: 'tableContent' },
          { text: formatNumberIndonesia(data.nettoTotal || 0), alignment: 'right', style: 'tableContent' },
          { text: (data.transDate ? moment(data.transDate).format('DD-MMM-YYYY') : ''), alignment: 'left', style: 'tableContent' },
          { text: formatNumberIndonesia(data.cash || 0), alignment: 'right', style: 'tableContent' },
          { text: formatNumberIndonesia(data.otherPayment || 0), alignment: 'right', style: 'tableContent' },

          { text: formatNumberIndonesia(data.paid || 0), alignment: 'right', style: 'tableContent' },
          { text: formatNumberIndonesia(data.receiveable || 0), alignment: 'right', style: 'tableContent' }
        ]
        body.push(row)
      }
      count += 1
    }
    return body
  }

  // Declare Variable

  const styles = {
    header: {
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 10]
    },
    subheader: {
      fontSize: 16,
      bold: true,
      margin: [0, 10, 0, 5]
    },
    tableExample: {
      margin: [0, 5, 0, 15]
    },
    tableHeader: {
      bold: true,
      fontSize: 10,
      color: 'black'
    },
    tableContent: {
      fontSize: 11,
      color: 'black'
    },
    tableFooter: {
      bold: true,
      fontSize: 10,
      color: 'black'
    }
  }

  const header = {
    stack: [
      {
        stack: [
          {
            stack: storeInfo.stackHeader01
          },
          {
            text: 'LAPORAN PIUTANG DAGANG',
            style: 'header',
            fontSize: 18,
            alignment: 'center'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1330, y2: 5, lineWidth: 0.5 }]
          },
          {
            columns: [
              {
                text: `\nPERIODE ${date ? moment(date, 'YYYY-MM-DD').format('DD-MMM-YYYY') : ''}`,
                fontSize: 12,
                alignment: 'left'
              },
              {
                text: '',
                fontSize: 12,
                alignment: 'center'
              },
              {
                text: '',
                fontSize: 12,
                alignment: 'right'
              }
            ]
          }
        ]
      }
    ],
    margin: [50, 12, 50, 30]
  }
  const footer = (currentPage, pageCount) => {
    return {
      margin: [50, 30, 50, 0],
      stack: [
        {
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1330, y2: 5, lineWidth: 0.5 }]
        },
        {
          columns: [
            {
              text: `Tanggal cetak: ${moment().format('DD-MMM-YYYY hh:mm:ss')}`,
              margin: [0, 0, 0, 0],
              fontSize: 9,
              alignment: 'left'
            },
            {
              text: `Dicetak oleh: ${user.username}`,
              margin: [0, 0, 0, 0],
              fontSize: 9,
              alignment: 'center'
            },
            {
              text: `Halaman: ${(currentPage || 0).toString()} dari ${pageCount}`,
              fontSize: 9,
              margin: [0, 0, 0, 0],
              alignment: 'right'
            }
          ]
        }
      ]
    }
  }
  const tableHeader = [
    [
      { text: 'NO', rowSpan: 2, style: 'tableHeader', alignment: 'center' },
      { text: 'TANGGAL', rowSpan: 2, style: 'tableHeader', alignment: 'center' },
      { text: 'NO FAKTUR', rowSpan: 2, style: 'tableHeader', alignment: 'center' },
      { text: 'NAMA CUSTOMER', rowSpan: 2, style: 'tableHeader', alignment: 'center' },
      { text: 'GROUP', rowSpan: 2, style: 'tableHeader', alignment: 'center' },

      { text: 'SALDO AWAL', rowSpan: 2, style: 'tableHeader', alignment: 'center' },
      { text: 'NETTO', rowSpan: 2, style: 'tableHeader', alignment: 'center' },
      { text: 'PEMBAYARAN', colSpan: 3, style: 'tableHeader', alignment: 'center' },
      { text: '', style: 'tableHeader', alignment: 'center' },
      { text: '', style: 'tableHeader', alignment: 'center' },

      { text: 'JUMLAH', style: 'tableHeader', alignment: 'center' },
      { text: 'SALDO AKHIR', rowSpan: 2, style: 'tableHeader', alignment: 'center' }
    ],
    [
      { text: '', style: 'tableHeader', alignment: 'center' },
      { text: '', style: 'tableHeader', alignment: 'center' },
      { text: '', style: 'tableHeader', alignment: 'center' },
      { text: '', style: 'tableHeader', alignment: 'center' },
      { text: '', style: 'tableHeader', alignment: 'center' },
      { text: '', style: 'tableHeader', alignment: 'center' },
      { text: '', style: 'tableHeader', alignment: 'center' },
      { text: 'TGL BAYAR', style: 'tableHeader', alignment: 'center' },
      { text: 'CASH', style: 'tableHeader', alignment: 'center' },
      { text: 'OTHER PAYMENT', style: 'tableHeader', alignment: 'center' },
      { text: 'PEMBAYARAN', style: 'tableHeader', alignment: 'center' },
      { text: '', style: 'tableHeader', alignment: 'center' }
    ]
  ]
  let tableBody = []
  try {
    tableBody = createTableBody(listTrans)
  } catch (e) {
    console.log(e)
  }
  const tableFooter = [
    [
      { text: 'Grand Total', colSpan: 5, alignment: 'center', style: 'tableFooter', fontSize: 12 },
      {},
      {},
      {},
      {},

      { text: formatNumberIndonesia(beginTotal || 0), alignment: 'right', style: 'tableFooter' },
      { text: formatNumberIndonesia(grandTotal || 0), alignment: 'right', style: 'tableFooter' },
      {},
      { text: formatNumberIndonesia(cashTotal || 0), alignment: 'right', style: 'tableFooter' },
      { text: formatNumberIndonesia(otherPaymentTotal || 0), alignment: 'right', style: 'tableFooter' },

      { text: formatNumberIndonesia(paidTotal || 0), alignment: 'right', style: 'tableFooter' },
      { text: formatNumberIndonesia(receiveableTotal || 0), alignment: 'right', style: 'tableFooter' }
    ]
  ]

  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    width: ['3%', '6%', '8%', '12%', '8%',
      '9%', '9%', '9%', '9%',
      '9%', '9%', '9%'],
    pageMargins: [50, 130, 50, 60],
    pageSize: { width: 842, height: 1430 },
    pageOrientation: 'landscape',
    tableStyle: styles,
    layout: 'noBorder',
    tableHeader,
    tableBody,
    tableFooter,
    data: listTrans,
    header,
    footer
  }

  return (
    <BasicReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  listTrans: PropTypes.array,
  user: PropTypes.object,
  storeInfo: PropTypes.object.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string
}

export default PrintPDF
