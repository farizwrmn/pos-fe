import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'

const PrintPDF = ({ dataSource, user, dateRange }) => {
  const styles = {
    header: {
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 10],
      alignment: 'center'
    },
    tableHeader: {
      bold: true,
      fontSize: 13,
      alignment: 'center'
    },
    tableBody: {
      fontSize: 11
    }
  }

  const header = {
    stack: [
      {
        stack: [
          {
            text: 'LAPORAN SEWA',
            style: 'header'
          },
          {
            text: `Tanggal: ${moment(dateRange[0]).format('DD MMMM YYYY')} - ${moment(dateRange[1]).format('DD MMMM YYYY')}`
          },
          {
            canvas: [{ type: 'line', x1: 2, y1: 5, x2: 762, y2: 5, lineWidth: 0.5 }]
          }
        ]
      }
    ],
    margin: [40, 12, 40, 30]
  }

  const tableHeader = [
    [
      { text: 'NO', style: 'tableHeader' },
      { text: 'TANGGAL', style: 'tableHeader' },
      { text: 'ID PERMINTAAN SEWA', style: 'tableHeader' },
      { text: 'VENDOR', style: 'tableHeader' },
      { text: 'OUTLET', style: 'tableHeader' },
      { text: 'HARGA', style: 'tableHeader' },
      { text: 'DISKON', style: 'tableHeader' },
      { text: 'HARGA FINAL', style: 'tableHeader' }
    ]
  ]

  const createTableBody = (tableBody) => {
    let body = []
    let count = 1
    for (let key in tableBody) {
      if (tableBody.hasOwnProperty(key)) {
        let row = []
        row.push({ text: count, alignment: 'center' })
        row.push({ text: (tableBody[key].createdAt ? moment(tableBody[key].createdAt).format('DD MMM YYYY') : '').toString(), alignment: 'center' })
        row.push({ text: `BR-${moment(tableBody[key].createdAt).format('YYMM')}${String(tableBody[key].id || '').padStart(8, '0')}`, alignment: 'center' })
        row.push({ text: (tableBody[key].vendorName || '').toString(), alignment: 'left' })
        row.push({ text: (tableBody[key].outletName || '').toString(), alignment: 'left' })
        row.push({ text: `Rp ${Number(tableBody[key].price || 0).toLocaleString()}`, alignment: 'right' })
        row.push({ text: `Rp ${Number(tableBody[key].discount || 0).toLocaleString()}`.toString(), alignment: 'right' })
        row.push({ text: `Rp ${Number(tableBody[key].final_price || 0).toLocaleString()}`, alignment: 'right' })
        body.push(row)
      }
      count += 1
    }
    return body
  }

  const footer = (currentPage, pageCount) => {
    return {
      margin: [40, 30, 40, 0],

      stack: [
        {
          canvas: [{ type: 'line', x1: 2, y1: -5, x2: 762, y2: -5, lineWidth: 0.1, margin: [0, 0, 0, 120] }]
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

  let tableBody = []
  try {
    tableBody = createTableBody(dataSource)
  } catch (e) {
    console.log(e)
  }

  const pdfProps = {
    buttonType: '',
    iconSize: '',
    buttonSize: '',
    name: 'PDF',
    className: '',
    buttonStyle: { background: 'transparent', border: 'none', padding: 0 },
    width: ['4%', '12%', '22%', '15%', '13%', '10%', '10%', '14%'],
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [40, 130, 40, 60],
    tableStyle: styles,
    layout: 'noBorder',
    tableHeader,
    tableBody,
    data: dataSource,
    header,
    footer
  }


  return (
    <BasicReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  user: PropTypes.object.isRequired,
  storeInfo: PropTypes.object.isRequired,
  dataSource: PropTypes.object
}

export default PrintPDF
