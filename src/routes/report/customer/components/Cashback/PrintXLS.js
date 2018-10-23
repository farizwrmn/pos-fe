import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicExcelReport } from 'components'

const PrintXLS = ({ customerInfo, listCashback, from, to, storeInfo }) => {
  let pointInTotal = listCashback.reduce((cnt, o) => cnt + parseFloat(o.pointIn), 0)
  let pointOutTotal = listCashback.reduce((cnt, o) => cnt + parseFloat(o.pointOut), 0)

  const styles = {
    title: {
      name: 'Courier New',
      family: 4,
      size: 12,
      underline: true
    },
    merchant: {
      name: 'Courier New',
      family: 4,
      size: 12
    },
    date: {
      name: 'Courier New',
      family: 4,
      size: 12
    },
    tableHeader: {
      name: 'Courier New',
      family: 4,
      size: 11
    },
    tableBody: {
      name: 'Times New Roman',
      family: 4,
      size: 10
    },
    tableBorder: {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } }
    },
    tableFooter: {
      name: 'Times New Roman',
      family: 4,
      size: 10
    }
  }
  const createTableBody = (list) => {
    let body = []
    const rows = list
    let start = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = [
          { value: start, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: '.', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.transNo || '').toString(), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.posDate ? moment(data.posDate).format('DD-MMM-YYYY') : ''), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.expirationDate ? moment(data.expirationDate).format('DD-MMM-YYYY') : ''), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.pointIn || ''), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.pointOut || ''), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: data.memo, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder }
        ]
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
    { value: 'LAPORAN HISTORY CASHBACK', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
    { value: `${storeInfo.name}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant },
    periode,
    { value: `CUSTOMER: ${customerInfo.memberName} (${customerInfo.memberCode})`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.date }
  ]

  const tableHeader = [
    [
      { value: 'NO.', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'NO_FAKTUR', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'TANGGAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'EXPIRED', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'IN', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'OUT', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'MEMO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder }
    ]
  ]

  let tableBody
  try {
    tableBody = createTableBody(listCashback)
  } catch (e) {
    console.log(e)
  }

  const tableFooter = [
    [
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter },
      { value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: pointInTotal, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: pointOutTotal, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder }
    ]
  ]

  // Declare additional Props
  const XLSProps = {
    className: 'button-width02 button-extra-large bgcolor-green',
    width: ['6%', '17%', '16%', '16%', '15%', '15%', '15%'],
    paperSize: 9,
    orientation: 'portrait',
    formatStyle: styles,
    data: listCashback,
    title,
    tableHeader,
    tableBody,
    tableFooter,
    fileName: 'Customer_Cashback_History'
  }

  return (
    <BasicExcelReport {...XLSProps} />
  )
}

PrintXLS.propTypes = {
  location: PropTypes.object,
  listCashback: PropTypes.array,
  from: PropTypes.string,
  to: PropTypes.string,
  storeInfo: PropTypes.object
}

export default PrintXLS
