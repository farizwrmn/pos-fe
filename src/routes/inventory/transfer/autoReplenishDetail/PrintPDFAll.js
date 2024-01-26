/**
 * Created by veirry on 28/11/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'
// import { numberFormat } from 'utils'

// const { formatNumberIndonesia } = numberFormat

const PrintPDF = ({ user, listTrans, itemPrint }) => {
  const productTotal = listTrans.reduce((prev, next) => prev + next.qty, 0)
  // Declare Function
  const createTableBody = (tabledata) => {
    let body = []
    const rows = tabledata
    let count = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = []
        row.push({ text: count, alignment: 'center', fontSize: 9 })
        row.push({ text: (`${data.transNo}\n${data.description}` || ''), alignment: 'left', fontSize: 9 })
        row.push({ text: (`${data.productCode}\n${data.productName}` || ''), alignment: 'left', fontSize: 9 })
        row.push({ text: (data.barCode01 || ''), alignment: 'left', fontSize: 9 })
        row.push({ text: (data.qty || ''), alignment: 'center', fontSize: 9 })
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
      fontSize: 13,
      color: 'black'
    }
  }
  const header = {
    stack: [
      {
        stack: [
          {
            text: 'PICKING LIST',
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
                text: `DARI: ${itemPrint.storeName || ''} KE ${itemPrint.storeReceiverName || ''}`,
                fontSize: 18,
                alignment: 'center'
              }
            ]
          },
          {
            columns: [
              {
                text: `DATE: ${moment(itemPrint.createdAt).format('DD-MM-YYYY')}`,
                fontSize: 10,
                alignment: 'left'
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
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 740, y2: 5, lineWidth: 0.5 }]
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
      { fontSize: 10, text: 'NO', style: 'tableHeader', alignment: 'center' },
      { fontSize: 10, text: 'DESC', style: 'tableHeader', alignment: 'center' },
      { fontSize: 10, text: 'PRODUCT', style: 'tableHeader', alignment: 'center' },
      { fontSize: 10, text: 'BARCODE', style: 'tableHeader', alignment: 'center' },
      { fontSize: 10, text: 'QTY', style: 'tableHeader', alignment: 'center' }
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
      { text: 'Grand Total', colSpan: 4, alignment: 'center', fontSize: 12 },
      {},
      {},
      {},
      { text: (productTotal || ''), alignment: 'right', fontSize: 12 }
    ]
  ]

  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    width: ['4%', '25%', '42%', '17%', '12%'],
    pageMargins: [50, 130, 50, 60],
    pageSize: 'A4',
    pageOrientation: 'portrait',
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
  user: PropTypes.object.isRequired,
  storeInfo: PropTypes.object.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string
}

export default PrintPDF
