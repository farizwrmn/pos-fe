/**
 * Created by boo on 9/19/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'
import { numberFormat, formatDate } from 'utils'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const PrintPDF = ({ user, listTrans, storeInfo, from, to }) => {
  // Declare Variable
  let payableTotal = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.payable || 0), 0)

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
          { text: (data.storeName || ''), alignment: 'left', fontSize: 11 },
          { text: (data.transNo || ''), alignment: 'left', fontSize: 11 },
          { text: (data.supplierName || ''), alignment: 'left', fontSize: 11 },
          { text: formatDate(data.transDate), alignment: 'left', fontSize: 11 },
          { text: formatDate(data.dueDate), alignment: 'left', fontSize: 11 },
          { text: formatNumberIndonesia(data.payable || 0), alignment: 'right', fontSize: 11 }
        ]
        body.push(row)
      }
      count += 1
    }
    return body
  }


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
            text: 'LAPORAN HUTANG',
            style: 'header',
            fontSize: 18,
            alignment: 'center'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 733, y2: 5, lineWidth: 0.5 }]
          },
          {
            columns: [
              {
                text: `\nPERIODE: ${formatDate(from)}  TO  ${formatDate(to)}`,
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
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 733, y2: 5, lineWidth: 0.5 }]
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
      { fontSize: 12, text: 'STORE', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'TRANS', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'SUPPLIER', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'DATE', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'DUE DATE', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'TERHUTANG', style: 'tableHeader', alignment: 'center' }
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
      { text: 'SUBTOTAL', colSpan: 6, alignment: 'center', fontSize: 12 },
      {},
      {},
      {},
      {},
      {},
      { text: `${(payableTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 }
    ]
  ]

  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    width: [
      '5%', '14%', '18%', '22%', '13%',
      '13%', '15%'
    ],
    pageMargins: [50, 130, 50, 60],
    pageSize: { width: 813, height: 530 },
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
  from: PropTypes.string.isRequired,
  to: PropTypes.string
}

export default PrintPDF
