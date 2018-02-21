import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'

const PrintPDF = ({ user, list, storeInfo, fromDate, toDate, productCode }) => {
  // Declare Function
  const createTableBody = (tabledata) => {
    let body = []
    const rows = tabledata
    let count = 1
    let ppn = 0
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = []
        row.push({ text: count, alignment: 'center', fontSize: 11 })
        row.push({ text: data.productCode.toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: data.Qty.toString(), alignment: 'right', fontSize: 11 })
        row.push({ text: data.Total.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: data.discountTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: `${(parseFloat(data.Total) - parseFloat(data.discountTotal)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 11 })
        row.push({ text: `${ppn.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 11 })
        row.push({ text: `${(parseFloat(data.Total) - parseFloat(data.discountTotal)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 11 })
        body.push(row)
      }
      count += 1
    }
    return body
  }

  // Declare Variable
  let qtyTotal = list.reduce((cnt, o) => cnt + parseFloat(o.Qty), 0)
  let grandTotal = list.reduce((cnt, o) => cnt + parseFloat(o.Total), 0)
  let discountTotal = list.reduce((cnt, o) => cnt + parseFloat(o.discountTotal), 0)
  let dppTotal = list.reduce((cnt, o) => cnt + (parseFloat(o.Total) - parseFloat(o.discountTotal)), 0)
  let nettoTotal = list.reduce((cnt, o) => cnt + (parseFloat(o.Total) - parseFloat(o.discountTotal)), 0)
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
            text: 'LAPORAN REKAP PENJUALAN',
            style: 'header',
            fontSize: 18,
            alignment: 'center'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 740, y2: 5, lineWidth: 0.5 }]
          },
          {
            columns: [
              {
                text: `\nPERIODE: ${moment(fromDate).format('DD-MMM-YYYY')}  TO  ${moment(toDate).format('DD-MMM-YYYY')}`,
                fontSize: 12,
                alignment: 'left',
                render: text => `${moment(text).format('LL ')}`
              },
              {
                text: '',
                fontSize: 12,
                alignment: 'center'
              },
              {
                text: `\nKODE PRODUK: ${productCode}`,
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
          canvas: [{ type: 'line', x1: 0, y1: -8, x2: 740, y2: -8, lineWidth: 0.5 }]
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
              text: `Halaman: ${currentPage.toString()} dari ${pageCount}`,
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
      { fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'PRODUCT', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'QTY', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'TOTAL', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'DISKON', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'DPP', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'PPN', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'NETTO', style: 'tableHeader', alignment: 'center' }
    ]
  ]
  let tableBody = []
  try {
    tableBody = createTableBody(list)
  } catch (e) {
    console.log(e)
  }
  const tableFooter = [
    [
      { text: 'Grand Total', colSpan: 2, alignment: 'center', fontSize: 12 },
      {},
      { text: `${qtyTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 },
      { text: `${grandTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 },
      { text: `${discountTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 },
      { text: `${dppTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 },
      { text: `${(0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 11 },
      { text: `${nettoTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 }
    ]
  ]

  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    width: ['5%', '19%', '*', '15%', '13%', '13%', '13%', '13%'],
    pageMargins: [50, 130, 50, 60],
    pageSize: 'A4',
    pageOrientation: 'landscape',
    tableStyle: styles,
    layout: 'noBorder',
    tableHeader,
    tableBody,
    tableFooter,
    data: list,
    header,
    footer
  }

  return (
    <BasicReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  list: PropTypes.array,
  user: PropTypes.object.isRequired,
  storeInfo: PropTypes.object.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string
}

export default PrintPDF
