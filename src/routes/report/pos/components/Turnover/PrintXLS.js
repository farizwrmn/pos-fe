/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { RepeatExcelReport } from 'components'

const PrintXLS = ({ listTrans, storeInfo, fromDate, toDate }) => {
  let allDppTotal = listTrans.reduce((cnt, o) => cnt + (o.DPP || 0), 0)
  let allCostPriceTotal = listTrans.reduce((cnt, o) => cnt + (o.costPrice || 0), 0)
  let allQtyTotal = listTrans.reduce((cnt, o) => cnt + (o.qty || 0), 0)
  let allCostPriceNextTotal = listTrans.reduce((cnt, o) => cnt + (o.costPriceNext || 0), 0)
  let allDppNextTotal = listTrans.reduce((cnt, o) => cnt + (o.DPPNext || 0), 0)
  let allQtyNextTotal = listTrans.reduce((cnt, o) => cnt + (o.qtyNext || 0), 0)
  let groupBy = (xs, key) => {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x)
      return rv
    }, {})
  }
  let groubedByTeam = groupBy(listTrans, 'sort')
  let arr = Object.keys(groubedByTeam).map(index => groubedByTeam[index])

  const styles = {
    title: {
      name: 'Calibri',
      family: 4,
      size: 12,
      underline: true
    },
    merchant: {
      name: 'Calibri',
      family: 4,
      size: 12
    },
    period: {
      name: 'Calibri',
      family: 4,
      size: 12
    },
    tableTitle: {
      name: 'Calibri',
      family: 4,
      size: 12,
      bold: true
    },
    tableHeader: {
      name: 'Calibri',
      family: 4,
      size: 12,
      bold: true
    },
    tableBody: {
      name: 'Calibri',
      family: 4,
      size: 11
    },
    tableFooter: {
      name: 'Calibri',
      family: 4,
      size: 11
    },
    tableBorder: {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } }
    }
  }

  const title = [
    { value: 'LAPORAN PRODUCT & SERVICE (COMPARE)', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.header },
    { value: `${storeInfo.name}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant },
    { value: `PERIODE: ${fromDate ? moment(fromDate, 'M-YYYY').format('MMM-YYYY') : ''}  TO  ${toDate ? moment(toDate, 'M-YYYY').format('MMM-YYYY') : ''}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant }
  ]

  const tableHeader = [
    { value: 'NO', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
    { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
    { value: 'CATEGORY', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
    { value: 'QTY', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
    { value: 'TURNOVER', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
    { value: 'MARGIN', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
    { value: 'WEIGHT (of total Turnover)', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
    { value: 'SOA / % KPI', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
    { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
    { value: 'QTY', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
    { value: 'EVO (%)', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
    { value: 'TURNOVER', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
    { value: 'EVO (%)', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
    { value: 'MARGIN', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
    { value: 'EVO (%)', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder }
  ]

  let tableTitles = []
  let tableBodies = []
  let tableFooters = []
  let tableTotals = []
  for (let i = 0; i < arr.length; i += 1) {
    let tableTitle = [
      [
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: `PERIODE : ${fromDate ? moment(fromDate, 'M-YYYY').format('MMM-YYYY') : ''}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: `PERIODE : ${fromDate ? moment(fromDate, 'M-YYYY').format('MMM-YYYY') : ''}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle }
      ]
    ]
    tableTitles.push(tableTitle)

    let group = []
    for (let n = 0; n < arr[i].length; n += 1) {
      const data = arr[i][n]
      let tableBody = [
        { value: `${parseInt((n + 1), 10)}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: '.', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
        { value: `${data.categoryName}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(data.qty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(data.DPP || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(data.costPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(100 - (((allDppTotal - data.DPP) / (allDppTotal > 0 ? allDppTotal : 1)) * 100) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(100 - (((allQtyTotal - data.qty) / (allQtyTotal > 0 ? allQtyTotal : 1)) * 100) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(data.qty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(data.qtyNext || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(data.DPPNext || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(data.DPPNextEvo || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(data.costPriceNext || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(data.costPriceNextEvo || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder }
      ]
      group.push(tableBody)
    }
    tableBodies.push(group)
    let weightTotal = (arr[i] || {}).reduce((cnt, o) => cnt + ((100 - (((allDppTotal - o.DPP) / allDppTotal) * 100)) || 0), 0)
    let soaTotal = (arr[i] || {}).reduce((cnt, o) => cnt + ((100 - (((allQtyTotal - o.qty) / allQtyTotal) * 100)) || 0), 0)
    let dppTotal = (arr[i] || {}).reduce((cnt, o) => cnt + (o.DPP || 0), 0)
    let costPriceTotal = (arr[i] || {}).reduce((cnt, o) => cnt + (o.costPrice || 0), 0)
    let qtyTotal = (arr[i] || {}).reduce((cnt, o) => cnt + (o.qty || 0), 0)
    let costPriceNextTotal = (arr[i] || {}).reduce((cnt, o) => cnt + (o.costPriceNext || 0), 0)
    let dppNextTotal = (arr[i] || {}).reduce((cnt, o) => cnt + (o.DPPNext || 0), 0)
    let qtyNextTotal = (arr[i] || {}).reduce((cnt, o) => cnt + (o.qtyNext || 0), 0)
    let tableFooter = [
      { value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: `${qtyTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: `${dppTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: `${costPriceTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${weightTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${soaTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: `${qtyNextTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${(((qtyTotal - qtyNextTotal) / (qtyNextTotal > 0 ? qtyNextTotal : 1)) * 100).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${dppNextTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${(((dppTotal - dppNextTotal) / (dppNextTotal > 0 ? dppNextTotal : 1)) * 100).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${costPriceNextTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })} `, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: `${(((costPriceTotal - costPriceNextTotal) / (costPriceNextTotal > 0 ? costPriceNextTotal : 1)) * 100).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter }
    ]
    tableFooters.push(tableFooter)
    let tableTotal = [
      { value: 'GRAND TOTAL', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: `${(allQtyTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: `${(allDppTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: `${(allCostPriceTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: '100 %', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: '100 %', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: `${(allQtyNextTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${((((allQtyTotal - allQtyNextTotal) / (allQtyNextTotal > 0 ? allQtyNextTotal : 1)) * 100) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: `${(allDppNextTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: `${((((allDppTotal - allDppNextTotal) / (allDppNextTotal > 0 ? allDppNextTotal : 1)) * 100) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: `${(allCostPriceNextTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: `${((((allCostPriceTotal - allCostPriceNextTotal) / (allCostPriceNextTotal > 0 ? allCostPriceNextTotal : 1)) * 100) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter }
    ]
    tableTotals.push(tableTotal)
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
    tableTotal: tableTotals,
    data: arr,
    fileName: 'POS-Compare'
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
