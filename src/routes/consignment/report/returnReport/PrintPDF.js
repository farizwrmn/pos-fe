import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'

const PrintPDF = ({ dataSource, user, selectedVendor, dateRange }) => {
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
            text: 'LAPORAN RETUR',
            style: 'header'
          },
          {
            text: dateRange && dateRange.length > 0 ? `Tanggal: ${moment(dateRange[0]).format('DD MMMM YYYY')} - ${moment(dateRange[1]).format('DD MMMM YYYY')}` : ''
          },
          {
            text: selectedVendor && selectedVendor.id ? `Vendor: ${selectedVendor.vendor_code} - ${selectedVendor.name}` : ''
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
      { text: 'RETUR PENJUALAN', style: 'tableHeader' },
      { text: 'NAMA PRODUK', style: 'tableHeader' },
      { text: 'QTY', style: 'tableHeader' },
      { text: 'HARGA', style: 'tableHeader' },
      { text: 'TOTAL', style: 'tableHeader' }
    ]
  ]

  const createTableBody = (tableBody) => {
    let body = []
    let count = 1
    for (let key in tableBody) {
      if (tableBody.hasOwnProperty(key)) {
        let row = []
        if (tableBody[key] === tableBody[tableBody.length - 1]) {
          row.push({ text: '' })
          row.push({ text: '' })
          row.push({ text: '' })
          row.push({ text: '' })
          row.push({ text: '' })
          row.push({ text: 'TOTAL', alignment: 'center' })
          row.push({ text: `Rp ${Number(tableBody[key].total || 0).toLocaleString()}`, alignment: 'right' })
        } else {
          row.push({ text: count, alignment: 'center' })
          row.push({ text: (tableBody[key].created_at ? moment(tableBody[key].created_at).format('DD MMM YYYY') : '').toString(), alignment: 'center' })
          row.push({ text: (tableBody[key].number || '').toString(), alignment: 'center' })
          row.push({ text: (tableBody[key].product_name || '').toString(), alignment: 'left' })
          row.push({ text: (tableBody[key].quantity || 0).toString(), alignment: 'center' })
          row.push({ text: `Rp ${Number(tableBody[key].price_after_discount || 0).toLocaleString()}`, alignment: 'right' })
          row.push({ text: `Rp ${Number(tableBody[key].total || 0).toLocaleString()}`, alignment: 'right' })
        }
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
    width: ['5%', '12%', '20%', '28%', '5%', '15%', '15%'],
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
