import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { formatNumbering } from 'utils'
import { BasicReport } from 'components'

const PrintPDF = ({ user, list, storeInfo }) => {
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
          { text: (data.transNo || '').toString(), alignment: 'left', fontSize: 11 },
          { text: (data.transDate || '').toString(), alignment: 'left', fontSize: 11 },
          { text: (data.product.productName || '').toString(), alignment: 'left', fontSize: 11 },
          { text: formatNumbering(data.qty), alignment: 'right', fontSize: 11 },
          { text: formatNumbering(data.DPP), alignment: 'right', fontSize: 11 },
          { text: formatNumbering(data.PPN), alignment: 'right', fontSize: 11 },
          { text: formatNumbering(data.cogsTotal), alignment: 'right', fontSize: 11 },
          { text: formatNumbering(data.total), alignment: 'right', fontSize: 11 }
        ]
        body.push(row)
      }
      count += 1
    }
    return body
  }

  // Declare Variable
  const QTY = list.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
  const DPP = list.reduce((cnt, o) => cnt + parseFloat(o.DPP), 0)
  const PPN = list.reduce((cnt, o) => cnt + parseFloat(o.PPN), 0)
  const cogsTotal = list.reduce((cnt, o) => cnt + parseFloat(o.cogsTotal), 0)
  const TOTAL = list.reduce((cnt, o) => cnt + parseFloat(o.total), 0)

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
            text: 'LAPORAN DETAIL PENJUALAN',
            style: 'header',
            fontSize: 18,
            alignment: 'center'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1080, y2: 5, lineWidth: 0.5 }]
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
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1080, y2: 5, lineWidth: 0.5 }]
        },
        {
          columns: [
            {
              text: `Tanggal cetak: ${moment().format('DD-MMM-YYYY HH:mm:ss')}`,
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
      { fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'TRANSNO', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'DATE', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'PRODUCT', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'QTY', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'DPP', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'PPN', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'COST', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'TOTAL', style: 'tableHeader', alignment: 'center' }
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
      { text: 'Grand Total', colSpan: 3, alignment: 'center', fontSize: 12 },
      {},
      {},
      {},
      { text: formatNumbering(QTY), alignment: 'right', fontSize: 12 },
      { text: formatNumbering(DPP), alignment: 'right', fontSize: 12 },
      { text: formatNumbering(PPN), alignment: 'right', fontSize: 12 },
      { text: formatNumbering(cogsTotal), alignment: 'right', fontSize: 12 },
      { text: formatNumbering(TOTAL), alignment: 'right', fontSize: 12 }
    ]
  ]

  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    width: [
      '5%',
      '10%',
      '7%',
      '23%',
      '7%',
      '12%',
      '12%',
      '12%',
      '12%'
    ],
    pageMargins: [50, 145, 50, 60],
    pageSize: 'A3',
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
