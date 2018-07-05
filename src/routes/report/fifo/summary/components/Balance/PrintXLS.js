/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { numberFormat } from 'utils'
import { BasicExcelReport } from 'components'

const { formatNumberInExcel } = numberFormat

const PrintXLS = ({ listRekap, period, year, storeInfo }) => {
  let count = listRekap.reduce((cnt, o) => cnt + parseFloat(o.count), 0)
  let amount = listRekap.reduce((cnt, o) => cnt + parseFloat(o.amount), 0)

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
    },
    alignmentLeft: {
      vertical: 'middle', horizontal: 'left'
    },
    alignmentCenter: {
      vertical: 'middle', horizontal: 'center'
    },
    alignmentRight: {
      vertical: 'middle', horizontal: 'right'
    }
  }

  let tableHeader = []
  let tableFooter = []
  const createTableBody = (list) => {
    let tableBody = []
    let start = 1
    for (let key in list) {
      if (list.hasOwnProperty(key)) {
        let data = list[key]
        let row = []
        row.push({ value: start, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: '.', alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.productCode || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.productName || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (parseFloat(data.amount) / parseFloat(data.count)), numFmt: formatNumberInExcel((data.amount / data.count), 2), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.count || 0), numFmt: formatNumberInExcel(data.count, 2), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.amount || 0), numFmt: formatNumberInExcel(data.amount, 2), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push(row)
        start += 1
      }
    }
    tableFooter.push(
      [
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: 'TOTAL', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: count, numFmt: formatNumberInExcel(count, 2), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: amount, numFmt: formatNumberInExcel(amount, 2), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder }
      ]
    )
    tableHeader.push(
      [
        { value: 'NO', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'KODE PRODUK', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'NAMA PRODUK', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'HPP', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'SALDO', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'TOTAL', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder }
      ]
    )
    return tableBody
  }

  const title = [
    { value: 'LAPORAN SISA SALDO STOCK', alignment: styles.alignmentCenter, font: styles.title },
    { value: `${storeInfo.name}`, alignment: styles.alignmentCenter, font: styles.merchant },
    { value: `PERIODE : ${moment(period, 'MM').format('MMMM').concat('-', year)}`, alignment: styles.alignmentCenter, font: styles.title }
  ]

  let tableBody
  try {
    tableBody = createTableBody(listRekap)
  } catch (e) {
    console.log(e)
  }

  // Declare additional Props
  const XLSProps = {
    paperSize: 9,
    orientation: 'portrait',
    data: listRekap,
    title,
    tableHeader,
    tableBody,
    tableFooter,
    fileName: 'LAPORAN SISA SALDO STOCK'
  }

  return (
    <BasicExcelReport {...XLSProps} />
  )
}

PrintXLS.propTypes = {
  listRekap: PropTypes.array,
  storeInfo: PropTypes.string,
  period: PropTypes.string,
  year: PropTypes.string
}

export default PrintXLS
