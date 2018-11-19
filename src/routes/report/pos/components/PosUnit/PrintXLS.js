/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { RepeatExcelReport } from 'components'

const PrintXLS = ({ listTrans, fromDate, toDate, storeInfo }) => {
  let outJSON = listTrans

  let groupBy = (xs, key) => {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x)
      return rv
    }, {})
  }
  let groubedByTeam = groupBy(outJSON, 'storeId')
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
    { value: 'LAPORAN REKAP PENJUALAN PER STORE', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
    { value: `${storeInfo.name}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant },
    { value: `PERIODE: ${moment(fromDate).format('DD-MMM-YYYY')}  TO  ${moment(toDate).format('DD-MMM-YYYY')}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.period }
  ]

  const tableHeader = [
    [
      { value: 'NO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'DATE', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'UNIT', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'SERVICE', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'PRODUCT', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'COUNTER', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder }
    ]
  ]

  let tableTitles = []
  let tableBodies = []
  let tableFooters = []
  let tableFilters = [
    [
      { value: 'NO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'STORE', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'DATE', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'UNIT', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'SERVICE', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'PRODUCT', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'COUNTER', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder }
    ]
  ]
  for (let i = 0; i < arr.length; i += 1) {
    let tableTitle = [
      [
        { value: arr[i][0].storeName, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle }
      ]
    ]
    tableTitles.push(tableTitle)

    let countQtyValue = 0
    let group = []
    for (let n = 0; n < arr[i].length; n += 1) {
      countQtyValue = ((parseFloat(countQtyValue) || 0) + (parseFloat(arr[i][n].pQty) || 0)) - (parseFloat(arr[i][n].sQty) || 0)
      let tableBody = [
        { value: n + 1, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
        { value: moment(arr[i][n].transDate, 'YYYY-MM-DD').format('YYYY-MM-DD'), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
        { value: (parseFloat(arr[i][n].qtyUnit) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: (parseFloat(arr[i][n].service) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: (parseFloat(arr[i][n].product) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: (parseFloat(arr[i][n].counter) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: (parseFloat(arr[i][n].product) + parseFloat(arr[i][n].service) + parseFloat(arr[i][n].counter)), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder }
      ]
      group.push(tableBody)


      tableFilters.push([
        { value: n + 1, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
        { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody },
        { value: arr[i][n].storeName, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
        { value: moment(arr[i][n].transDate, 'YYYY-MM-DD').format('YYYY-MM-DD'), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
        { value: (parseFloat(arr[i][n].qtyUnit) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: (parseFloat(arr[i][n].service) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: (parseFloat(arr[i][n].product) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: (parseFloat(arr[i][n].counter) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: (parseFloat(arr[i][n].product) + parseFloat(arr[i][n].service) + parseFloat(arr[i][n].counter)), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody }
      ])
    }
    tableBodies.push(group)

    let productTotal = arr[i].reduce((cnt, o) => cnt + parseFloat(o.product), 0)
    let serviceTotal = arr[i].reduce((cnt, o) => cnt + parseFloat(o.service), 0)
    let counterTotal = arr[i].reduce((cnt, o) => cnt + parseFloat(o.counter), 0)
    let qtyUnit = arr[i].reduce((cnt, o) => cnt + parseFloat(o.qtyUnit), 0)
    let tableFooter = [
      { value: 'GRAND TOTAL', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: parseFloat(qtyUnit || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: parseFloat(serviceTotal || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: parseFloat(productTotal || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: parseFloat(counterTotal || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: parseFloat(productTotal || 0) + parseFloat(serviceTotal || 0) + parseFloat(counterTotal || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder }
    ]
    tableFooters.push(tableFooter)
  }
  // Declare additional Props
  const XLSProps = {
    className: 'button-width02 button-extra-large bgcolor-green',
    width: [],
    paperSize: 9,
    orientation: 'portrait',
    title,
    tableTitle: tableTitles,
    tableHeader,
    tableBody: tableBodies,
    tableFooter: tableFooters,
    tableFilter: tableFilters,
    data: arr,
    fileName: 'Pos-Summary'
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
