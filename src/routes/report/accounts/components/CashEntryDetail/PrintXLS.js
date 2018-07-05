/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { RepeatExcelReport } from 'components'
import { formatDate } from 'utils'

const PrintXLS = ({ listDetail, from, to, storeInfo }) => {
  let outJSON = listDetail

  let groupBy = (xs, key) => {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x)
      return rv
    }, {})
  }
  let groubedByTeam = groupBy(outJSON, 'transNoId')
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
    from: {
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
    { value: 'LAPORAN DETAIL CASH', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
    { value: `${storeInfo.name}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant },
    { value: `PERIODE : ${formatDate(from, 'YYYY-MM-DD')} to ${formatDate(to, 'YYYY-MM-DD')}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.from }
  ]

  const tableHeader = [
    [
      { value: 'NO', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'KODE', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'NAMA', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'DESCRIPTION', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'DEBIT', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'KREDIT', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder }
    ]
  ]

  let tableTitles = []
  let tableBodies = []
  let tableFooters = []
  for (let i = 0; i < arr.length; i += 1) {
    let tableTitle = [
      [
        { value: 'Invoice No', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: `${arr[i][0].transNo}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle }
      ],
      [
        { value: 'Invoice Date', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: `${formatDate(arr[i][0].transDate)}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle }
      ],
      [
        { value: 'Reference', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: `${arr[i][0].reference || ''}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle }
      ]
    ]
    tableTitles.push(tableTitle)

    let countQtyValue = 0
    let group = []
    for (let n = 0; n < arr[i].length; n += 1) {
      countQtyValue = ((parseFloat(countQtyValue) || 0) + (parseFloat(arr[i][n].pQty) || 0)) - (parseFloat(arr[i][n].sQty) || 0)
      let tableBody = [
        { value: `${parseInt((n + 1), 10)} .`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
        { value: `${arr[i][n].accountDetailCode || ''}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: `${arr[i][n].accountName || ''}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: `${arr[i][n].description || ''}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: `${parseFloat(arr[i][n].amountIn) || 0}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: `${parseFloat(arr[i][n].amountOut) || 0}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder }
      ]
      group.push(tableBody)
    }
    tableBodies.push(group)

    let amountIn = arr[i].reduce((cnt, o) => cnt + (parseFloat(o.amountIn) || 0), 0)
    let amountOut = arr[i].reduce((cnt, o) => cnt + (parseFloat(o.amountOut) || 0), 0)
    let tableFooter = [
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: 'GRAND TOTAL', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${(amountIn).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${(amountOut).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder }
    ]
    tableFooters.push(tableFooter)
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
    fileName: 'Laporan-Cash'
  }

  return (
    <RepeatExcelReport {...XLSProps} />
  )
}

PrintXLS.propTypes = {
  location: PropTypes.object,
  listDetail: PropTypes.array,
  storeInfo: PropTypes.string,
  from: PropTypes.string,
  to: PropTypes.string
}

export default PrintXLS
