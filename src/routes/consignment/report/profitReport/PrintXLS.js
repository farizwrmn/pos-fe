import React from 'react'
import PropTypes from 'prop-types'
import { BasicExcelReport } from 'components'
import moment from 'moment'

const PrintXLS = ({ dataSource, summary, selectedVendor, storeInfo }) => {
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

  const createTableBody = () => {
    let body = []
    let row = []
    row.push({ value: 'VENDOR', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
    row.push({ value: selectedVendor.name, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
    body.push(row)

    row = []
    row.push({ value: 'TOTAL PENJUALAN', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
    row.push({ value: summary.total, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
    body.push(row)

    row = []
    row.push({ value: 'MODAL', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
    row.push({ value: summary.capital, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
    body.push(row)

    row = []
    row.push({ value: 'PAYMENT CHARGE', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
    row.push({ value: summary.charge, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
    body.push(row)

    row = []
    row.push({ value: 'COMMISSION', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
    row.push({ value: summary.commission, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
    body.push(row)

    row = []
    row.push({ value: 'LABA KOTOR', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
    row.push({ value: summary.profit, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
    body.push(row)


    return body
  }

  const title = [
    { value: `LAPORAN LABA RUGI (${moment(summary.from).format('DD MMM YYYY')} - ${moment(summary.to).format('DD MMM YYYYY')})`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
    { value: `${storeInfo.name}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant }
  ]

  const tableHeader = [
    [
      { value: 'KETERANGAN', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'JUMLAH', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder }
    ]
  ]

  let tableBody
  try {
    tableBody = createTableBody(dataSource)
  } catch (e) {
    console.log(e)
  }

  // Declare additional Props
  const XLSProps = {
    buttonType: '',
    iconSize: '',
    buttonSize: '',
    className: '',
    name: 'Excel',
    buttonStyle: { background: 'transparent', border: 'none', padding: 0 },
    paperSize: 9,
    orientation: 'portrait',
    data: dataSource,
    title,
    tableHeader,
    tableBody,
    fileName: 'Profit-report'
  }

  return (
    <BasicExcelReport {...XLSProps} />
  )
}

PrintXLS.propTypes = {
  dataSource: PropTypes.object,
  storeInfo: PropTypes.object
}

export default PrintXLS
