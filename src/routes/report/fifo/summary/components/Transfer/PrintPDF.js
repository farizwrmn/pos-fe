/**
 * Created by veirry on 28/11/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'

const PrintPDF = ({ user, listRekap, storeInfo, period, year }) => {
  // Declare Function
  const createTableBody = (tabledata) => {
    let body = []
    const rows = tabledata
    let count = 1
    for (let key = 0; key < rows.length; key += 1) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = [
          { text: count, alignment: 'center', fontSize: 10 },
          { text: (data.productCode || '').toString(), alignment: 'left', fontSize: 10 },
          { text: (data.productName || '').toString(), alignment: 'left', fontSize: 10 },
          { text: (data.transitFromQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 10 },
          { text: (data.transitFromPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 10 },
          { text: (data.transferFromQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 10 },
          { text: (data.transferFromPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 10 },
          { text: (data.adjInQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 10 },
          { text: (data.adjInPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 10 },
          { text: (data.adjOutQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 10 },
          { text: (data.adjOutPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 10 },
          { text: (data.inTransitQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 10 },
          { text: (data.inTransitPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 10 },
          { text: (data.inTransferQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 10 },
          { text: (data.inTransferPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 10 },
          { text: (data.transitQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 10 },
          { text: (data.transitPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 10 },
          { text: (data.transferQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 10 },
          { text: (data.transferPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 10 }
        ]
        body.push(row)
      }
      count += 1
    }
    return body
  }

  // Declare Variable

  let transitFromQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transitFromQty || 0), 0)
  let transitFromPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transitFromPrice || 0), 0)
  let transferFromQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transferFromQty || 0), 0)
  let transferFromPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transferFromPrice || 0), 0)
  let adjInQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjInQty), 0)
  let adjInPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjInPrice), 0)
  let adjOutQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjOutQty), 0)
  let adjOutPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjOutPrice), 0)
  let inTransitQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.inTransitQty || 0), 0)
  let inTransitPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.inTransitPrice || 0), 0)
  let inTransferQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.inTransferQty || 0), 0)
  let inTransferPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.inTransferPrice || 0), 0)
  let transitQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transitQty || 0), 0)
  let transitPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transitPrice || 0), 0)
  let transferQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transferQty || 0), 0)
  let transferPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transferPrice || 0), 0)

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
            text: 'LAPORAN TRANSFER STOCK',
            style: 'header',
            fontSize: 18,
            alignment: 'center'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1300, y2: 5, lineWidth: 0.5 }]
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
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1300, y2: 5, lineWidth: 0.5 }]
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
      { fontSize: 10, text: 'NO', rowSpan: 2, alignment: 'center' },
      { fontSize: 10, text: 'KODE PRODUK', rowSpan: 2, alignment: 'center' },
      { fontSize: 10, text: 'NAMA PRODUK', rowSpan: 2, alignment: 'center' },
      { fontSize: 10, text: 'TRANSIT FROM OTHER PERIOD (a)', colSpan: 2, alignment: 'center' },
      {},
      { fontSize: 10, text: 'TRANSFER FROM OTHER PERIOD (b)', colSpan: 2, alignment: 'center' },
      {},
      { fontSize: 10, text: 'TR IN (c)', colSpan: 2, alignment: 'center' },
      {},
      { fontSize: 10, text: 'TR OUT (d)', colSpan: 2, alignment: 'center' },
      {},
      { fontSize: 10, text: 'IN TRANSIT (e)', colSpan: 2, alignment: 'center' },
      {},
      { fontSize: 10, text: 'IN TRANSFER (f)', colSpan: 2, alignment: 'center' },
      {},
      { fontSize: 10, text: 'TRANSIT TO OTHER PERIOD (g)', colSpan: 2, alignment: 'center' },
      {},
      { fontSize: 10, text: 'TRANSFER TO OTHER PERIOD (h)', colSpan: 2, alignment: 'center' },
      {}
    ],
    [
      {},
      {},
      {},
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
      { text: `${(transitFromQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(transitFromPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(transferFromQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(transferFromPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(adjInQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(adjInPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(adjOutQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(adjOutPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(inTransitQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(inTransitPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(inTransferQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(inTransferPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(transitQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(transitPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(transferQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(transferPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 }
    ],
    [
      { text: 'Total Keluar (d)', colSpan: 13, alignment: 'center', fontSize: 12 },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      { text: `${(adjOutQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(adjOutPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 }
    ],
    [
      { text: 'Total Masuk (c) + (e) + (g) - (a)', colSpan: 13, alignment: 'center', fontSize: 12 },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      { text: `${(((adjInQty || 0) + (transitQty || 0) + (inTransitQty || 0)) - (transitFromQty || 0)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 },
      { text: `${(((adjInPrice || 0) + (transitPrice || 0) + (inTransitPrice || 0)) - (transitFromPrice || 0)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 9 }
    ]
  ]


  let widths = [
    '3%', '6%', '13%',
    '4%', '6%',
    '4%', '6%',
    '4%', '6%',
    '4%', '6%',
    '4%', '6%',
    '4%', '6%',
    '4%', '6%',
    '4%', '6%'
  ]

  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    width: widths,
    pageMargins: [50, 130, 50, 60],
    pageSize: { width: 842, height: 1400 },
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
