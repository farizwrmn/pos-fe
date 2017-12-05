/**
 * Created by veirry on 28/11/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'

const PrintPDF = ({ user, listTrans, storeInfo, fromDate, toDate }) => {
  // Declare Function
  const createTableBody = (tabledata) => {
    let body = []
    const rows = tabledata
    let count = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = []
        row.push({ text: count, alignment: 'center', fontSize: 11 })
        row.push({ text: moment(data.transDate).format('DD-MMM-YYYY'), alignment: 'left', fontSize: 11 })
        row.push({ text: (parseFloat(data.qtyUnit) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: (parseFloat(data.counter) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: (data.product || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: (data.service || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: (parseFloat(data.product) + parseFloat(data.service)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        body.push(row)
      }
      count += 1
    }
    return body
  }

  // Declare Variable
  let productTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.product), 0)
  let serviceTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.service), 0)
  let counterTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.counter), 0)
  let qtyUnit = listTrans.reduce((cnt, o) => cnt + parseFloat(o.qtyUnit), 0)
  const styles = {
    header: {
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 10],
    },
    subheader: {
      fontSize: 16,
      bold: true,
      margin: [0, 10, 0, 5],
    },
    tableExample: {
      margin: [0, 5, 0, 15],
    },
    tableHeader: {
      bold: true,
      fontSize: 13,
      color: 'black',
    },
  }
  const header = {
    stack: [
      {
        stack: [
          {
            stack: storeInfo.stackHeader01,
          },
          {
            text: 'LAPORAN REKAP PENJUALAN PER HARI',
            style: 'header',
            fontSize: 18,
            alignment: 'center',
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 820 - 2 * 40, y2: 5, lineWidth: 0.5 }]
          },
          {
            columns: [
              {
                text: `\nPERIODE: ${moment(fromDate).format('DD-MMM-YYYY')}  TO  ${moment(toDate).format('DD-MMM-YYYY')}`,
                fontSize: 12,
                alignment: 'left',
                render: text => `${moment(text).format('LL ')}`,
              },
              {
                text: '',
                fontSize: 12,
                alignment: 'center',
              },
              {
                text: '',
                fontSize: 12,
                alignment: 'right',
              },
            ],
          },
        ],
      },
    ],
    margin: [50, 12, 50, 30],
  }
  const footer = (currentPage, pageCount) => {
    return {
      margin: [50, 30, 50, 0],
      stack: [
        {
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 820 - 2 * 40, y2: 5, lineWidth: 0.5 }]
        },
        {
          columns: [
            {
              text: `Tanggal cetak: ${moment().format('DD-MMM-YYYY hh:mm:ss')}`,
              margin: [0, 0, 0, 0],
              fontSize: 9,
              alignment: 'left',
            },
            {
              text: `Dicetak oleh: ${user.username}`,
              margin: [0, 0, 0, 0],
              fontSize: 9,
              alignment: 'center',
            },
            {
              text: `Halaman: ${currentPage.toString()} dari ${pageCount}`,
              fontSize: 9,
              margin: [0, 0, 0, 0],
              alignment: 'right',
            },
          ],
        },
      ],
    }
  }
  const tableHeader = [
    [
      { fontSize: 12, text: 'NO', rowSpan: 2, style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'DATE', rowSpan: 2, style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'UNIT', rowSpan: 2, style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'PRODUCT', colSpan: 2, style: 'tableHeader', alignment: 'center' },
      {},
      { fontSize: 12, text: 'SERVICE', rowSpan: 2, style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'TOTAL', rowSpan: 2, style: 'tableHeader', alignment: 'center' },
    ],
    [
      {},
      {},
      {},
      { fontSize: 12, text: 'COUNTER', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'PRODUCT', style: 'tableHeader', alignment: 'center' },
      {},
      {}
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
      { text: 'Grand Total', colSpan: 2, alignment: 'center', fontSize: 12 },
      {},
      { text: `${qtyUnit.toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 },
      { text: `${counterTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 },
      { text: `${productTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 },
      { text: `${serviceTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 },
      { text: `${(parseFloat(productTotal) + parseFloat(serviceTotal) + parseFloat(counterTotal)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 }
    ]
  ]

  // Declare additional Props
  const pdfProps = {
    className: "button-width02 button-extra-large bgcolor-blue",
    width: ['4%', '10%', '6%', '20%', '20%', '20%', '20%'],
    pageMargins: [50, 130, 50, 60],
    pageSize: 'A4',
    pageOrientation: 'landscape',
    tableStyle: styles,
    layout: "noBorder",
    tableHeader: tableHeader,
    tableBody: tableBody,
    tableFooter: tableFooter,
    data: listTrans,
    header: header,
    footer: footer
  }

  return (
    <BasicReport  {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  listTrans: PropTypes.array,
  user: PropTypes.object.isRequired,
  storeInfo: PropTypes.object.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired,
}

export default PrintPDF
