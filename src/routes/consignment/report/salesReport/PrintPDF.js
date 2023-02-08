import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'

const PrintPDF = ({ dataSource, user, storeInfo }) => {
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
            stack: storeInfo.stackHeader01
          },
          {
            text: 'LAPORAN PENJUALAN',
            style: 'header'
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
      { text: 'FAKTUR PENJUALAN', style: 'tableHeader' },
      { text: 'NAMA PRODUK', style: 'tableHeader' },
      { text: 'QTY', style: 'tableHeader' },
      { text: 'PAYMENT', style: 'tableHeader' },
      { text: 'TOTAL', style: 'tableHeader' },
      { text: 'KOMISI', style: 'tableHeader' },
      { text: 'CHARGE', style: 'tableHeader' },
      { text: 'GRAB', style: 'tableHeader' },
      { text: 'MODAL', style: 'tableHeader' },
      { text: 'PROFIT', style: 'tableHeader' }
    ]
  ]

  const createTableBody = (tableBody) => {
    let body = []
    let count = 1
    for (let key in tableBody) {
      if (tableBody.hasOwnProperty(key)) {
        let row = []
        row.push({ text: count, alignment: 'center' })
        row.push({ text: (tableBody[key].createdAt ? moment(tableBody[key].createdAt).format('DD MMM YYYY') : '').toString(), alignment: 'left' })
        row.push({ text: (tableBody[key]['salesOrder.number'] || '').toString(), alignment: 'left' })
        row.push({ text: (tableBody[key]['stock.product.product_name']).toString(), alignment: 'center' })
        row.push({ text: (tableBody[key].quantity || '0').toString(), alignment: 'center' })
        row.push({ text: (tableBody[key]['salesOrder.paymentMethods.method'] || '0').toString(), alignment: 'left' })
        row.push({ text: (tableBody[key].total || '0').toString(), alignment: 'left' })
        row.push({ text: (tableBody[key].commission || '0').toString(), alignment: 'left' })
        row.push({ text: (tableBody[key].charge || '0').toString(), alignment: 'left' })
        row.push({ text: (tableBody[key].commissionGrab || '0').toString(), alignment: 'left' })
        row.push({ text: (tableBody[key]['stock.product.capital'] || '0').toString(), alignment: 'left' })
        row.push({ text: (tableBody[key].profit || '0').toString(), alignment: 'left' })
        body.push(row)
      }
      count += 1
    }
    let subTotal = 0
    let commission = 0
    let charge = 0
    let grab = 0
    let capital = 0
    let profit = 0
    tableBody.map((record) => {
      subTotal += record.total
      commission += record.commission
      charge += record.charge
      grab += record.commissionGrab
      capital += record['stock.product.capital'] * record.quantity
      profit += record.profit
      return record
    })
    let row = []
    if (subTotal !== null) {
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: 'SUBTOTAL', alignment: 'center' })
      row.push({ text: subTotal, alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      body.push(row)
    }
    row = []
    if (commission !== null) {
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: 'COMMISSION', alignment: 'center' })
      row.push({ text: commission, alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      body.push(row)
    }
    row = []
    if (charge !== null) {
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: 'CHARGE', alignment: 'center' })
      row.push({ text: charge, alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      body.push(row)
    }
    row = []
    if (grab !== null) {
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: 'GRAB', alignment: 'center' })
      row.push({ text: grab, alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      body.push(row)
    }
    row = []
    if (capital !== null) {
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: 'CAPITAL', alignment: 'center' })
      row.push({ text: capital, alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      body.push(row)
    }
    row = []
    if (profit !== null) {
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: '-', alignment: 'center' })
      row.push({ text: 'PROFIT', alignment: 'center' })
      row.push({ text: profit, alignment: 'center' })
      body.push(row)
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
    width: ['5%', '15%', '20%', '20%', '5%', '5%', '5%', '5%', '5%', '5%', '5%', '5%'],
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

  console.log('pdfProps', pdfProps)

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
