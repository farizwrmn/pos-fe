/**
 * Created by veirry on 28/11/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'

const PrintPDF = ({ activeKey, user, listRekap, storeInfo, period, year }) => {
  // Declare Function
  const createTableBody = (tabledata) => {
    let body = []
    const rows = tabledata
    let count = 1
    for (let key = 0; key < rows.length; key += 1) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = [
          { text: count, alignment: 'center', fontSize: 9 },
          { text: (data.productCode || '').toString(), alignment: 'left', fontSize: 9 },
          { text: (data.productName || '').toString(), alignment: 'left', fontSize: 9 },
          { text: (data.beginQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 9 },
          { text: (data.beginPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 9 },
          { text: (data.purchaseQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 9 },
          { text: (data.purchasePrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 9 },
          { text: (data.adjInQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 9 },
          { text: (data.adjInPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 9 },
          { text: (data.transferInQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 9 },
          { text: (data.transferInPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 9 },
          { text: (data.posQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 9 },
          { text: (data.posPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 9 },
          { text: (data.adjOutQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 9 },
          { text: (data.adjOutPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 9 },
          { text: (data.transferOutQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 9 },
          { text: (data.transferOutPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 9 },
          { text: (data.count || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 9 },
          { text: (data.amount || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 9 },
          { text: (data.inTransitQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 9 },
          { text: (data.inTransitPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 9 },
          { text: (data.inTransferQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 9 },
          { text: (data.inTransferPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 9 }
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
            text: activeKey === '0' ? 'LAPORAN REKAP FIFO' : 'LAPORAN SISA SALDO STOCK',
            style: 'header',
            fontSize: 18,
            alignment: 'center'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1550, y2: 5, lineWidth: 0.5 }]
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
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1550, y2: 5, lineWidth: 0.5 }]
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

  let tableHeader = [
    [
      { fontSize: 12, text: 'NO', rowSpan: 2, alignment: 'center' },
      { fontSize: 12, text: 'KODE PRODUK', rowSpan: 2, alignment: 'center' },
      { fontSize: 12, text: 'NAMA PRODUK', rowSpan: 2, alignment: 'center' },
      { fontSize: 12, text: 'SALDO AWAL', colSpan: 2, alignment: 'center' },
      {},
      { fontSize: 12, text: 'PEMBELIAN', colSpan: 2, alignment: 'center' },
      {},
      { fontSize: 12, text: 'ADJ IN + RETUR PENJUALAN', colSpan: 2, alignment: 'center' },
      {},
      { fontSize: 12, text: 'TR IN', colSpan: 2, alignment: 'center' },
      {},
      { fontSize: 12, text: 'PENJUALAN', colSpan: 2, alignment: 'center' },
      {},
      { fontSize: 12, text: 'ADJ OUT + RETUR PEMBELIAN', colSpan: 2, alignment: 'center' },
      {},
      { fontSize: 12, text: 'TR OUT', colSpan: 2, alignment: 'center' },
      {},
      { fontSize: 12, text: 'SALDO AKHIR', colSpan: 2, alignment: 'center' },
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
      { fontSize: 10, text: 'QTY', alignment: 'center' },
      { fontSize: 10, text: 'HPP', alignment: 'center' },
      { fontSize: 10, text: 'QTY', style: 'tableHeader', alignment: 'center' },
      { fontSize: 10, text: 'HPP', alignment: 'center' },
      { fontSize: 10, text: 'QTY', alignment: 'center' },
      { fontSize: 10, text: 'HPP', alignment: 'center' },
      { fontSize: 10, text: 'QTY', alignment: 'center' },
      { fontSize: 10, text: 'HPP', alignment: 'center' },
      { fontSize: 10, text: 'QTY', alignment: 'center' },
      { fontSize: 10, text: 'HPP', alignment: 'center' },
      { fontSize: 10, text: 'QTY', alignment: 'center' },
      { fontSize: 10, text: 'HPP', alignment: 'center' },
      { fontSize: 10, text: 'QTY', alignment: 'center' },
      { fontSize: 10, text: 'HPP', alignment: 'center' },
      { fontSize: 10, text: 'QTY', alignment: 'center' },
      { fontSize: 10, text: 'HPP', alignment: 'center' },
      { fontSize: 10, text: 'QTY', alignment: 'center' },
      { fontSize: 10, text: 'HPP', alignment: 'center' },
      { fontSize: 10, text: 'QTY', alignment: 'center' },
      { fontSize: 10, text: 'HPP', alignment: 'center' }
    ]
  ]

  let tableBody = []
  try {
    tableBody = createTableBody(listRekap)
  } catch (e) {
    console.log(e)
  }

  let tableFooter = [
    [
      { text: 'Total', colSpan: 3, alignment: 'center', fontSize: 12 },
      {},
      {},
      { text: `${(beginQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(beginPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(purchaseQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(purchasePrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(adjInQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(adjInPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(transferInQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(transferInPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(posQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(posPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(adjOutQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(adjOutPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(transferOutQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(transferOutPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(count || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(amount || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(inTransitQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(inTransitPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(inTransferQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(inTransferPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 }
    ]
  ]


  let widths = [
    '3%', '7%', '10%',
    '3%', '5%',
    '3%', '5%',
    '3%', '5%',
    '3%', '5%',
    '3%', '5%',
    '3%', '5%',
    '3%', '5%',
    '3%', '5%',
    '3%', '5%',
    '3%', '5%'
  ]

  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    width: widths,
    pageMargins: [50, 130, 50, 60],
    pageSize: { width: 842, height: 1650 },
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
