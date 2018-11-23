/**
 * Created by Veirry on 22/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicExcelReport } from 'components'

const PrintXLS = ({ listTrans, fromDate, toDate, storeInfo }) => {
  let productTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.product), 0)
  let serviceTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.service), 0)
  let counterTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.counter), 0)
  let qtyUnit = listTrans.reduce((cnt, o) => cnt + parseFloat(o.qtyUnit), 0)
  const styles = {
    merchant: {
      name: 'Courier New',
      family: 4,
      size: 12
    },
    title: {
      name: 'Courier New',
      family: 4,
      size: 12,
      underline: true
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
    }
  }

  const tableHeaderStyle = {
    alignment: { vertical: 'middle', horizontal: 'center' },
    font: styles.tableHeader,
    border: styles.tableBorder
  }

  const tableFooterStyle = {
    alignment: { vertical: 'middle', horizontal: 'center' },
    font: styles.tableFooter
  }

  const tableBodyNumberStyle = {
    alignment: { vertical: 'middle', horizontal: 'right' },
    font: styles.tableBody,
    border: styles.tableBorder
  }

  const tableBodyTextStyle = {
    alignment: { vertical: 'middle', horizontal: 'right' },
    font: styles.tableBody,
    border: styles.tableBorder
  }

  const createTableBody = (list) => {
    let body = []
    let start = 1
    for (let key in list) {
      if (list.hasOwnProperty(key)) {
        let data = list[key]
        let row = [
          { value: start.toString(), ...tableBodyNumberStyle },
          { value: '.', ...tableBodyTextStyle },
          { value: moment(data.transDate, 'YYYY-MM-DD').format('DD-MMM-YYYY'), ...tableBodyTextStyle },
          { value: parseFloat(data.qtyUnit), ...tableBodyNumberStyle },
          { value: parseFloat(data.service), ...tableBodyNumberStyle },
          { value: parseFloat(data.product), ...tableBodyNumberStyle },
          { value: parseFloat(data.counter), ...tableBodyNumberStyle },
          { value: (parseFloat(data.service) + parseFloat(data.product) + parseFloat(data.counter)), ...tableBodyNumberStyle }
        ]
        body.push(row)
      }
      start += 1
    }
    return body
  }

  const title = [
    { value: 'LAPORAN REKAP PENJUALAN PER HARI', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
    { value: `${storeInfo.name}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant },
    { value: `PERIODE : ${moment(fromDate).format('DD-MMM-YYYY')}  TO  ${moment(toDate).format('DD-MMM-YYYY')}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.date }
  ]

  const tableHeader = [
    [
      { value: 'NO', ...tableHeaderStyle },
      { value: '', ...tableHeaderStyle },
      { value: 'DATE', ...tableHeaderStyle },
      { value: 'UNIT', ...tableHeaderStyle },
      { value: 'SERVICE', ...tableHeaderStyle },
      { value: 'PRODUCT', ...tableHeaderStyle },
      { value: 'COUNTER', ...tableHeaderStyle },
      { value: 'TOTAL', ...tableHeaderStyle }
    ]
  ]

  const tableFooter = [
    [
      { value: '', ...tableFooterStyle },
      { value: '', ...tableFooterStyle },
      { value: 'GRAND TOTAL', ...tableFooterStyle, border: styles.tableBorder },
      { value: qtyUnit, ...tableFooterStyle, border: styles.tableBorder },
      { value: serviceTotal, ...tableFooterStyle, border: styles.tableBorder },
      { value: productTotal, ...tableFooterStyle, border: styles.tableBorder },
      { value: counterTotal, ...tableFooterStyle, border: styles.tableBorder },
      {
        value: (parseFloat(serviceTotal) + parseFloat(productTotal) + parseFloat(counterTotal)),
        ...tableFooterStyle,
        border: styles.tableBorder
      }
    ]
  ]

  let tableBody
  try {
    tableBody = createTableBody(listTrans)
  } catch (e) {
    console.log(e)
  }

  // Declare additional Props
  const XLSProps = {
    className: 'button-width02 button-extra-large bgcolor-green',
    paperSize: 9,
    orientation: 'portrait',
    formatStyle: styles,
    data: listTrans,
    title,
    tableHeader,
    tableBody,
    tableFooter,
    fileName: 'POS-Summary'
  }

  return (
    <BasicExcelReport {...XLSProps} />
  )
}

PrintXLS.propTypes = {
  listTrans: PropTypes.array,
  storeInfo: PropTypes.object,
  fromDate: PropTypes.string,
  toDate: PropTypes.string
}

export default PrintXLS
