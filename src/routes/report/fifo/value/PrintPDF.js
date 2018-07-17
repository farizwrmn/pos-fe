/**
 * Created by veirry on 28/11/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'
import { numberFormat } from 'utils'

const { formatNumberIndonesia } = numberFormat

const PrintPDF = ({ user, listRekap, storeInfo, period, year }) => {
  // Declare Function
  const createTableBody = (tabledata) => {
    let body = []
    const rows = tabledata
    let count = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = [
          { text: count, alignment: 'center', fontSize: 11 },
          { text: (data.productCode || '').toString(), alignment: 'left', fontSize: 11 },
          { text: (data.productName || '').toString(), alignment: 'left', fontSize: 11 },
          { text: formatNumberIndonesia(data.beginQty), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.beginPrice), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.purchaseQty), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.purchasePrice), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.adjInQty), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.adjInPrice), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.transferInQty), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.transferInPrice), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.posQty), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.valuePrice), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.posPrice), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.adjOutQty), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.adjOutPrice), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.transferOutQty), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.transferOutPrice), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.count), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.amount), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(parseFloat(data.valuePrice) - parseFloat(data.posPrice)), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.inTransferQty), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.inTransferPrice), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.inTransitQty), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.inTransitPrice), alignment: 'right', fontSize: 11 }
        ]
        body.push(row)
      }
      count += 1
    }
    return body
  }

  // Declare Variable
  let beginQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.beginQty), 0)
  let beginPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.beginPrice), 0)
  let purchaseQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.purchaseQty), 0)
  let purchasePrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.purchasePrice), 0)
  let adjInQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjInQty), 0)
  let adjInPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjInPrice), 0)
  let posQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.posQty), 0)
  let posPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.posPrice), 0)
  let valuePrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.valuePrice), 0)
  let adjOutQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjOutQty), 0)
  let adjOutPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjOutPrice), 0)
  let transferInQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transferInQty || 0), 0)
  let transferInPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transferInPrice || 0), 0)
  let transferOutQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transferOutQty || 0), 0)
  let transferOutPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transferOutPrice || 0), 0)
  let count = listRekap.reduce((cnt, o) => cnt + parseFloat(o.count), 0)
  let amount = listRekap.reduce((cnt, o) => cnt + parseFloat(o.amount), 0)
  let inTransitQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.inTransitQty || 0), 0)
  let inTransitPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.inTransitPrice || 0), 0)
  let inTransferQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.inTransferQty || 0), 0)
  let inTransferPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.inTransferPrice || 0), 0)
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
      fontSize: 13,
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
            text: 'LAPORAN NILAI PERSEDIAAN',
            style: 'header',
            fontSize: 18,
            alignment: 'center'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 2000, y2: 5, lineWidth: 0.5 }]
          },
          {
            columns: [
              {
                text: `\nPERIODE: ${moment(period, 'MM').format('MMMM').concat('-', year)}`,
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
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 2000, y2: 5, lineWidth: 0.5 }]
        },
        {
          columns: [
            {
              text: `Tanggal cetak: ${moment().format('LLLL')}`,
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
      { fontSize: 12, text: 'NO', rowSpan: 2, alignment: 'center' },
      { fontSize: 12, text: 'PRODUCT CODE', rowSpan: 2, alignment: 'center' },
      { fontSize: 12, text: 'PRODUCT NAME', rowSpan: 2, alignment: 'center' },
      { fontSize: 12, text: 'SALDO AWAL', colSpan: 2, alignment: 'center' },
      {},

      { fontSize: 12, text: 'PEMBELIAN', colSpan: 2, alignment: 'center' },
      {},
      { fontSize: 12, text: 'ADJ IN + RETUR JUAL', colSpan: 2, alignment: 'center' },
      {},
      { fontSize: 12, text: 'TR IN', colSpan: 2, alignment: 'center' },

      {},
      { fontSize: 12, text: 'PENJUALAN', colSpan: 3, alignment: 'center' },
      {},
      {},
      { fontSize: 12, text: 'ADJ OUT + RETUR BELI', colSpan: 2, alignment: 'center' },

      {},
      { fontSize: 12, text: 'TR OUT', colSpan: 2, alignment: 'center' },
      {},
      { fontSize: 12, text: 'SALDO AKHIR', colSpan: 2, alignment: 'center' },
      {},

      {},
      { fontSize: 12, text: 'IN TRANSIT', colSpan: 2, alignment: 'center' },
      {},
      { fontSize: 12, text: 'IN TRANSFER', colSpan: 2, alignment: 'center' },
      {}
    ],
    [
      {},
      {},
      {},
      { fontSize: 12, text: 'QTY', alignment: 'center' },
      { fontSize: 12, text: 'HPP', alignment: 'center' },

      { fontSize: 12, text: 'QTY', alignment: 'center' },
      { fontSize: 12, text: 'HPP', alignment: 'center' },
      { fontSize: 12, text: 'QTY', alignment: 'center' },
      { fontSize: 12, text: 'HPP', alignment: 'center' },
      { fontSize: 12, text: 'QTY', alignment: 'center' },

      { fontSize: 12, text: 'HPP', alignment: 'center' },
      { fontSize: 12, text: 'QTY', alignment: 'center' },
      { fontSize: 12, text: 'NET SALES', alignment: 'center' },
      { fontSize: 12, text: 'HPP', alignment: 'center' },
      { fontSize: 12, text: 'QTY', alignment: 'center' },

      { fontSize: 12, text: 'HPP', alignment: 'center' },
      { fontSize: 12, text: 'QTY', alignment: 'center' },
      { fontSize: 12, text: 'HPP', alignment: 'center' },
      { fontSize: 12, text: 'QTY', alignment: 'center' },
      { fontSize: 12, text: 'HPP', alignment: 'center' },

      { fontSize: 12, text: 'LABA-RUGI', alignment: 'center' },
      { fontSize: 12, text: 'QTY', alignment: 'center' },
      { fontSize: 12, text: 'HPP', alignment: 'center' },
      { fontSize: 12, text: 'QTY', alignment: 'center' },
      { fontSize: 12, text: 'HPP', alignment: 'center' }
    ]
  ]
  let tableBody = []
  try {
    tableBody = createTableBody(listRekap)
  } catch (e) {
    console.log(e)
  }
  const tableFooter = [
    [
      { text: 'Grand Total', colSpan: 3, alignment: 'center', fontSize: 12 },
      {},
      {},
      { text: formatNumberIndonesia(beginQty), alignment: 'right', fontSize: 10 },
      { text: formatNumberIndonesia(beginPrice), alignment: 'right', fontSize: 10 },
      { text: formatNumberIndonesia(purchaseQty), alignment: 'right', fontSize: 10 },
      { text: formatNumberIndonesia(purchasePrice), alignment: 'right', fontSize: 10 },
      { text: formatNumberIndonesia(adjInQty), alignment: 'right', fontSize: 10 },
      { text: formatNumberIndonesia(adjInPrice), alignment: 'right', fontSize: 10 },
      { text: formatNumberIndonesia(transferInQty || 0), alignment: 'right', fontSize: 9 },
      { text: formatNumberIndonesia(transferInPrice || 0), alignment: 'right', fontSize: 9 },
      { text: formatNumberIndonesia(posQty), alignment: 'right', fontSize: 10 },
      { text: formatNumberIndonesia(valuePrice), alignment: 'right', fontSize: 10 },
      { text: formatNumberIndonesia(posPrice), alignment: 'right', fontSize: 10 },
      { text: formatNumberIndonesia(adjOutQty), alignment: 'right', fontSize: 10 },
      { text: formatNumberIndonesia(adjOutPrice), alignment: 'right', fontSize: 10 },
      { text: formatNumberIndonesia(transferOutQty || 0), alignment: 'right', fontSize: 9 },
      { text: formatNumberIndonesia(transferOutPrice || 0), alignment: 'right', fontSize: 9 },
      { text: formatNumberIndonesia(count), alignment: 'right', fontSize: 10 },
      { text: formatNumberIndonesia(amount), alignment: 'right', fontSize: 10 },
      { text: formatNumberIndonesia(parseFloat(valuePrice) - parseFloat(posPrice)), alignment: 'right', fontSize: 10 },
      { text: formatNumberIndonesia(inTransitQty || 0), alignment: 'right', fontSize: 9 },
      { text: formatNumberIndonesia(inTransitPrice || 0), alignment: 'right', fontSize: 9 },
      { text: formatNumberIndonesia(inTransferQty || 0), alignment: 'right', fontSize: 9 },
      { text: formatNumberIndonesia(inTransferPrice || 0), alignment: 'right', fontSize: 9 }
    ]
  ]

  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    width: [
      '2%', '6%', '6%', // product
      '3%', '5%', // saldo awal
      '3%', '5%', // pembelian
      '3%', '5%', // adj in
      '3%', '5%', // tr in
      '3%', '4%', '5%', // jual
      '3%', '5%', // adj out
      '3%', '5%', // tr out
      '3%', '5%', '5%', // saldo akhir
      '3%', '4%', // in tr out
      '3%', '4%' // in tr in
    ],
    pageMargins: [50, 130, 50, 60],
    pageSize: { width: 1483, height: 2100 },
    pageOrientation: 'landscape',
    tableStyle: styles,
    layout: 'noBorder',
    tableHeader,
    tableBody,
    tableFooter,
    data: listRekap,
    header,
    footer
  }

  return (
    <BasicReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  listRekap: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  period: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  storeInfo: PropTypes.object
}

export default PrintPDF
