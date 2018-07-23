import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'

const PrintPDF = ({ data, user, storeInfo }) => {
  const styles = {
    header: {
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 10],
      alignment: 'center'
    },
    tableHeader: {
      bold: true,
      fontSize: 12,
      color: 'black'
    },
    headerStoreName: {
      fontSize: 16,
      margin: [45, 10, 0, 0]
    },
    headerTitle: {
      fontSize: 13,
      margin: [45, 2, 0, 0]
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
            text: 'LAPORAN STOK KUANTITAS MINIMUM',
            style: 'header'
          },
          {
            canvas: [{ type: 'line', x1: 2, y1: 5, x2: 760, y2: 5, lineWidth: 0.5 }]
          }
        ]
      }
    ],
    margin: [40, 12, 40, 30]
  }

  const tableHeader = [
    [
      { fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'PRODUCT NAME', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'QUANTITY', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'ALERT QUANTITY', style: 'tableHeader', alignment: 'center' }
    ]
  ]

  const createTableBody = (tableData) => {
    let body = []
    let count = 1
    for (let key in tableData) {
      if (tableData.hasOwnProperty(key)) {
        let data = tableData[key]
        let row = []
        row.push({ text: count, alignment: 'center', fontSize: 11 })
        row.push({ text: (data.productName || '').toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: (data.sumQty || '').toString(), alignment: 'right', fontSize: 11 })
        row.push({ text: (data.alertQty || '').toString(), alignment: 'right', fontSize: 11 })
        body.push(row)
      }
      count += 1
    }
    return body
  }

  let tableBody = []
  try {
    tableBody = createTableBody(data)
  } catch (e) {
    console.log(e)
  }

  const footer = (currentPage, pageCount) => {
    return {
      margin: [40, 30, 40, 0],
      stack: [
        {
          canvas: [{ type: 'line', x1: 2, y1: -5, x2: 760, y2: -5, lineWidth: 0.1, margin: [0, 0, 0, 120] }]
        },
        {
          columns: [
            {
              text: `Tanggal Cetak: ${moment().format('DD-MM-YYYY HH:mm:ss')}`,
              margin: [0, 0, 0, 0],
              fontSize: 9,
              alignment: 'left'
            },
            {
              text: `Dicetak Oleh: ${user.userid}`,
              fontSize: 9,
              margin: [0, 0, 0, 0],
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

  const pdfProps = {
    width: ['6%', '40%', '25%', '29%'],
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [40, 130, 40, 60],
    tableStyle: styles,
    layout: 'noBorder',
    tableHeader,
    tableBody,
    header,
    footer
  }

  return (
    <BasicReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  user: PropTypes.object,
  storeInfo: PropTypes.object,
  dataSource: PropTypes.object
}

export default PrintPDF
