/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { RepeatExcelReport } from 'components'

const PrintXLS = ({ listRekap, period, year, storeInfo }) => {
  let outJSON = listRekap

  let groupBy = (xs, key) => {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x)
      return rv
    }, {})
  }
  let groubedByTeam = groupBy(outJSON, 'productCode')
  let arr = Object.keys(groubedByTeam).map(index => groubedByTeam[index])

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
    period: {
      name: 'Courier New',
      family: 4,
      size: 12
    },
    tableTitle: {
      name: 'Courier New',
      family: 4,
      size: 12,
      bold: true
    },
    tableHeader: {
      name: 'Courier New',
      family: 4,
      size: 12,
      bold: true
    },
    tableBody: {
      name: 'Times New Roman',
      family: 4,
      size: 10
    },
    tableFooter: {
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

  const title = [
    { value: 'LAPORAN KARTU STOK FIFO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
    { value: `${storeInfo.name}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant },
    { value: `PERIODE : ${moment(period, 'MM').format('MMMM').concat('-', year)}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.period }
  ]

  const tableHeader = [
    [
      { value: 'NO', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'TANGGAL', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'NO_FAKTUR', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'TIPE', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'QTY', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'HARGA SATUAN', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'REFERENCE', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableHeader, border: styles.tableBorder }
    ]
  ]

  let tableTitles = []
  let tableBodies = []
  let tableFooters = []
  for (let i = 0; i < arr.length; i += 1) {
    let tableTitle = [
      [
        { value: 'PRODUCT', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: `${arr[i][0].productCode}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '-', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableTitle },
        { value: `${arr[i][0].productName}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle }
      ]
    ]
    tableTitles.push(tableTitle)

    let countQtyValue = 0
    let group = []
    for (let n = 0; n < arr[i].length; n += 1) {
      countQtyValue = ((parseFloat(countQtyValue) || 0) + (parseFloat(arr[i][n].pQty) || 0)) - (parseFloat(arr[i][n].sQty) || 0)
      let tableBody = []
      tableBody.push({ value: `${parseInt((n + 1), 10)} .`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: `${moment(arr[i][n].transDate).format('DD-MMM-YYYY')}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: `${arr[i][n].transNo}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: `${arr[i][n].transType}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: arr[i][n].transType === 'IN' ? (parseFloat(arr[i][n].qty) || 0) : (parseFloat(arr[i][n].qty) || 0) * -1, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: (parseFloat(arr[i][n].DPP) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: arr[i][n].transType === 'IN' ? (parseFloat(arr[i][n].total) || 0) : (parseFloat(arr[i][n].total) || 0) * -1, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: arr[i][n].purchaseNo, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      group.push(tableBody)
    }
    tableBodies.push(group)
  }

  // Declare additional Props
  const XLSProps = {
    className: 'button-width02 button-extra-large bgcolor-green',
    width: ['6%', '17%', '16%', '16%', '15%', '15%', '15%'],
    paperSize: 9,
    orientation: 'portrait',
    title,
    tableTitle: tableTitles,
    tableHeader,
    tableBody: tableBodies,
    tableFooter: tableFooters,
    data: arr,
    fileName: 'Stock-Card'
  }

  return (
    <RepeatExcelReport {...XLSProps} />
  )
}

PrintXLS.propTypes = {
  location: PropTypes.object,
  listRekap: PropTypes.array,
  storeInfo: PropTypes.string,
  period: PropTypes.string,
  year: PropTypes.string
}

export default PrintXLS
