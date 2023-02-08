import React from 'react'
import PropTypes from 'prop-types'
import { BasicExcelReport } from 'components'
import moment from 'moment'

const PrintXLS = ({ dataSource, storeInfo }) => {
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
        if (list[key] === list[list.length - 1]) {
          row.push({ value: '-', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: '-', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: '-', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: '-', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: '-', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: list[key].total, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
        } else {
          row.push({ value: start, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: list[key].createdAt ? moment(list[key].createdAt).format('DD MMM YYYY') : '-', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: list[key]['returnOrder.number'], alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: list[key]['salesOrderProduct.stock.product.product_name'] === 1 ? 'STOCK IN' : 'STOCK OUT', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: list[key].quantity, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: list[key].price_after_discount, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: list[key].total, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
        }
        body.push(row)
      }
      start += 1
    }
    return body
  }

  const title = [
    { value: 'LAPORAN RETUR', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
    { value: `${storeInfo.name}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant }
  ]

  const tableHeader = [
    [
      { value: 'NO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'TANGGAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'RETUR PENJUALAN', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'NAMA PRODUK', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'QTY', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'HARGA', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder }
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
    fileName: 'Return-report'
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
