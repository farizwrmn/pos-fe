import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { numberFormat } from 'utils'
import { RepeatExcelReport } from 'components'

const { formatNumberInExcel } = numberFormat

const PrintXLS = ({ listInventoryTransfer, period, storeInfo }) => {
  let qtyTotal = listInventoryTransfer.reduce((cnt, o) => cnt + (o.qty || 0), 0)
  let nettoTotal = listInventoryTransfer.reduce((cnt, o) => cnt + (o.nettoTotal || 0), 0)
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
      size: 11,
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

  const diffData = listInventoryTransfer.reduce((group, item) => {
    (group[item.transNo] = group[item.transNo] || []).push(item)
    return group
  }, [])

  const title = [
    { value: 'LAPORAN INVENTORY TRANSFER OUT', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
    { value: `${storeInfo.name}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant },
    { value: `PERIODE : ${moment(period).format('MMMM-YYYY')}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.period }
  ]

  const tableHeader = [
    [
      { value: 'NO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'KODE PRODUK', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'NAMA PRODUK', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'QTY', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'HARGA SATUAN', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder }
    ]
  ]

  let tableTitles = []
  let tableBodies = []
  let tableFooters = []
  for (let key in diffData) {
    let master = diffData[key]
    let tableTitle = [
      [
        { value: 'No Transaksi', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: ':', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: `${key}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: 'Tanggal', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: ':', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: `${moment(master[0].transDate).format('DD-MMM-YYYY')}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle }
      ]
    ]
    tableTitles.push(tableTitle)

    let group = []
    let count = 1
    for (let n = 0; n < master.length; n += 1) {
      let data = master[n]
      let tableBody = [
        { value: `${count}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
        { value: `${data.productCode}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
        { value: `${data.productName}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
        { value: (parseFloat(data.qty) || 0), numFmt: formatNumberInExcel(data.qty, 2), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: (parseFloat(data.netto) || 0), numFmt: formatNumberInExcel(data.netto, 2), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: (parseFloat(data.nettoTotal) || 0), numFmt: formatNumberInExcel(data.nettoTotal, 2), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder }
      ]
      group.push(tableBody)
      count += 1
    }
    tableBodies.push(group)

    let totalQty = master.reduce((cnt, o) => cnt + (parseFloat(o.qty) || 0), 0)
    let total = master.reduce((cnt, o) => cnt + (parseFloat(o.nettoTotal) || 0), 0)

    let tableFooter = [
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalQty, numFmt: formatNumberInExcel(totalQty, 2), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: total, numFmt: formatNumberInExcel(total, 2), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder }
    ]
    tableFooters.push(tableFooter)
  }
  let tableTotals = []
  let grandTotal = [
    { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
    { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
    { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
    { value: 'GRAND TOTAL', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
    { value: (qtyTotal || 0), numFmt: formatNumberInExcel(qtyTotal, 2), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
    { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
    { value: (nettoTotal || 0), numFmt: formatNumberInExcel(nettoTotal, 2), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder }
  ]
  tableTotals.push(grandTotal)

  // Declare additional Props
  const XLSProps = {
    className: 'button-width02 button-extra-large bgcolor-green',
    paperSize: 9,
    orientation: 'portrait',
    title,
    tableTitle: tableTitles,
    tableTotal: tableTotals,
    tableHeader,
    tableBody: tableBodies,
    tableFooter: tableFooters,
    data: Object.keys(diffData),
    fileName: 'Inventory Transfer Out-Summary'
  }

  return (
    <RepeatExcelReport {...XLSProps} />
  )
}

PrintXLS.propTypes = {
  listTrans: PropTypes.array
}

export default PrintXLS
