import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicExcelReport } from 'components'

const PrintXLS = ({ listHistory, from, to, storeInfo }) => {
  let qtyTotal = listHistory.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
  let grandTotal = listHistory.reduce((cnt, o) => cnt + parseFloat(o.total), 0)
  let discountTotal = listHistory.reduce((cnt, o) => cnt + parseFloat(o.totalDiscount), 0)
  let nettoTotal = listHistory.reduce((cnt, o) => cnt + parseFloat(o.nettoTotal), 0)

  const styles = {
    header: {
      fontSize: 11,
      margin: [0, 0, 0, 10],
    },
    body: {
      fontSize: 10,
    },
    footer: {
      fontSize: 10,
    },
    title: {
      name: 'Courier New',
      family: 4,
      size: 12,
      underline: true,
    },
    merchant: {
      name: 'Courier New',
      family: 4,
      size: 12,
    },
    date: {
      name: 'Courier New',
      family: 4,
      size: 12,
    },
    tableHeader: {
      name: 'Courier New',
      family: 4,
      size: 11,
    },
    tableBody: {
      name: 'Times New Roman',
      family: 4,
      size: 10,
    },
    tableBorder: {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } },
    },
    tableFooter: {
      name: 'Times New Roman',
      family: 4,
      size: 10,
    },
  }
  const tableBody = (list) => {
    let body = []
    const rows = list
    let start = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = []
        row.push({ value: start, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: '.', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: data.transNo.toString(), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: moment(data.transDate).format('DD-MMM-YYYY'), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: data.productName.toString(), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: data.qty.toString(), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: parseFloat(data.total).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: parseFloat(data.totalDiscount).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: parseFloat(data.nettoTotal).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        body.push(row)
      }
      start += 1
    }
    return body
  }

  let periode
  if (from !== '' && to !== '') {
    periode = { value: `PERIODE : ${moment(from).format('DD-MMM-YYYY')}  TO  ${moment(to).format('DD-MMM-YYYY')}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.date }
  } else {
    periode = {}
  }

  const title = [
    { value: 'LAPORAN TRANSAKSI PER CUSTOMER', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
    { value: `${storeInfo.name}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant },
    periode,
  ]
  const header = [
    [
      { value: 'NO.', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'TRANSACTION NO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'TRANSACTION DATE', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'PRODUCT NAME', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'QTY', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'TOTAL DISCOUNT', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'NETTO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
    ],
  ]
  const contentBody = listHistory.length > 0 ? tableBody(listHistory) : []
  const footer = [
    [
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter },
      { value: 'GRAND TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: qtyTotal.toString(), alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${grandTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${discountTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${nettoTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
    ],
  ]

  // Declare additional Props
  const XLSProps = {
    className: 'button-width02 button-extra-large bgcolor-green',
    width: ['6%', '17%', '16%', '16%', '15%', '15%', '15%'],
    paperSize: 9,
    orientation: 'portrait',
    formatStyle: styles,
    data: listHistory,
    title,
    header,
    body: contentBody,
    footer,
    fileName: 'Customer-Transaction-Summary',
  }

  return (
    <BasicExcelReport {...XLSProps} />
  )
}

PrintXLS.propTypes = {
  location: PropTypes.object,
  listHistory: PropTypes.array,
  from: PropTypes.string,
  to: PropTypes.string,
  storeInfo: PropTypes.object,
}

export default PrintXLS
