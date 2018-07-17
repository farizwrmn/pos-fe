/**
 * Created by veirry on 28/11/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'
import { numberFormat } from 'utils'

const { formatNumberIndonesia } = numberFormat

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
        row.push({ text: (data.transNo || '').toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: (data.memberName || '').toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: (data.policeNo || '').toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: formatNumberIndonesia(data.product || 0), alignment: 'right', fontSize: 11 })
        row.push({ text: formatNumberIndonesia(data.service || 0), alignment: 'right', fontSize: 11 })
        row.push({ text: formatNumberIndonesia(parseFloat(data.product) + parseFloat(data.service)), alignment: 'right', fontSize: 11 })
        body.push(row)
      }
      count += 1
    }
    return body
  }

  // Declare Variable
  let productTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.product), 0)
  let serviceTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.service), 0)
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
            text: 'LAPORAN JASA + PART PER FAKTUR',
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
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 740, y2: 5, lineWidth: 0.5 }]
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
      { fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'DATE', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'TRANS NO', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'MEMBER', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'POLICE NO.', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'PRODUCT', style: 'tableHeader', alignment: 'right' },
      { fontSize: 12, text: 'SERVICE', style: 'tableHeader', alignment: 'right' },
      { fontSize: 12, text: 'TOTAL', style: 'tableHeader', alignment: 'right' }
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
      { text: 'Grand Total', colSpan: 5, alignment: 'center', fontSize: 12 },
      {},
      {},
      {},
      {},
      { text: formatNumberIndonesia(productTotal), alignment: 'right', fontSize: 12 },
      { text: formatNumberIndonesia(serviceTotal), alignment: 'right', fontSize: 12 },
      { text: formatNumberIndonesia(parseFloat(productTotal) + parseFloat(serviceTotal)), alignment: 'right', fontSize: 12 }
    ]
  ]

  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    width: 'auto',
    pageMargins: [50, 130, 50, 60],
    pageSize: 'A4',
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
  user: PropTypes.object.isRequired,
  storeInfo: PropTypes.object.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string
}

export default PrintPDF
