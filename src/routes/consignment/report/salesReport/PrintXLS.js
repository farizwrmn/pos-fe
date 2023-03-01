import React from 'react'
import PropTypes from 'prop-types'
import { BasicExcelReport } from 'components'
import moment from 'moment'

const PrintXLS = ({ dataSource, selectedVendor, dateRange }) => {
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

  const createTableBody = (list) => {
    let body = []
    let start = 1
    for (let key in list) {
      if (list.hasOwnProperty(key)) {
        let row = []
        row.push({ value: start, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: list[key].createdAt ? moment(list[key].createdAt).format('DD MMM YYYY') : '-', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: list[key]['salesOrder.number'] || '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: list[key]['stock.product.product_name'] || '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: list[key].quantity || 0, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: list[key]['salesOrder.paymentMethods.method'] || '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: list[key].total || 0, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: list[key].commission || 0, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: list[key].charge || 0, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: list[key].commissionGrab || 0, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: list[key]['stock.product.capital'] || 0, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: list[key].profit || 0, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        body.push(row)
      }
      start += 1
    }

    let subTotal = 0
    let commission = 0
    let charge = 0
    let grab = 0
    let capital = 0
    let profit = 0
    list.map((record) => {
      subTotal += record.total
      commission += record.commission
      charge += record.charge
      grab += record.commissionGrab
      capital += record['stock.product.capital'] * record.quantity
      profit += record.profit
      return record
    })
    let row = []
    if (subTotal !== null && commission !== null && charge !== null && grab !== null && capital !== null && profit !== null) {
      row.push({ value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      row.push({ value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      row.push({ value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      row.push({ value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      row.push({ value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      row.push({ value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody, border: styles.tableBorder })
      row.push({ value: subTotal, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      row.push({ value: commission, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      row.push({ value: charge, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      row.push({ value: grab, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      row.push({ value: capital, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      row.push({ value: profit, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      body.push(row)
    }
    return body
  }

  const title = [
    { value: 'LAPORAN PENJUALAN', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
    { value: dateRange && dateRange.length > 0 ? `Tanggal: ${moment(dateRange[0]).format('DD MMMM YYYY')} - ${moment(dateRange[1]).format('DD MMMM YYYY')}` : '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody },
    { value: selectedVendor && selectedVendor.id ? `Vendor: ${selectedVendor.vendor_code} - ${selectedVendor.name}` : '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody }
  ]

  const tableHeader = [
    [
      { value: 'NO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'TANGGAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'FAKTUR PENJUALAN', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'NAMA PRODUK', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'QTY', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'PAYMENT', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'KOMISI', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'CHARGE', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'GRAB', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'MODAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'PROFIT', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder }
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
    fileName: 'Sales-report'
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
