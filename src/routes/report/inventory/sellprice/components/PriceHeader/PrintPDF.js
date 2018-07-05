import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { numberFormat } from 'utils'
import { BasicReport } from 'components'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const PrintPDF = ({ user, listInventoryTransfer, storeInfo, period }) => {
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
          { text: moment(data.transDate || '').format('DD-MMM-YYYY'), alignment: 'left', fontSize: 11 },
          { text: (data.employeeName || '').toString(), alignment: 'left', fontSize: 11 },
          { text: formatNumberIndonesia(data.statusText || ''), alignment: 'left', fontSize: 11 },
          { text: formatNumberIndonesia(data.createdBy || ''), alignment: 'right', fontSize: 11 }
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
            text: 'LAPORAN PERUBAHAN HARGA',
            style: 'header',
            fontSize: 18,
            alignment: 'center'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1080, y2: 5, lineWidth: 0.5 }]
          },
          {
            columns: [
              {
                text: `\nPERIODE: ${period}`,
                fontSize: 11,
                alignment: 'left'
              },
              {}
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
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1080, y2: 5, lineWidth: 0.5 }]
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
      { fontSize: 12, text: 'TRANS NO', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'TRANS DATE', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'PIC', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'STATUS', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'CREATED BY', style: 'tableHeader', alignment: 'center' }
    ]
  ]
  let tableBody = []
  try {
    tableBody = createTableBody(listInventoryTransfer)
  } catch (e) {
    console.log(e)
  }
  const tableFooter = [
    // [
    //   { text: 'Grand Total', colSpan: 3, alignment: 'center', fontSize: 12 },
    //   {},
    //   {},
    //   { text: formatNumberIndonesia(qtyTotal), alignment: 'right', fontSize: 12 },
    //   { text: formatNumberIndonesia(grandTotal), alignment: 'right', fontSize: 12 },
    //   { text: formatNumberIndonesia(discountTotal), alignment: 'right', fontSize: 12 },
    // ]
  ]

  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    width: ['4%', '20%', '19%', '19%', '19%', '19%'],
    pageMargins: [50, 145, 50, 60],
    pageSize: 'A4',
    pageOrientation: 'landscape',
    tableStyle: styles,
    layout: 'noBorder',
    tableHeader,
    tableBody,
    tableFooter,
    data: listInventoryTransfer,
    header,
    footer
  }
  return (
    <BasicReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  listInventoryTransfer: PropTypes.array,
  user: PropTypes.object,
  storeInfo: PropTypes.object.isRequired,
  period: PropTypes.string
}

export default PrintPDF
