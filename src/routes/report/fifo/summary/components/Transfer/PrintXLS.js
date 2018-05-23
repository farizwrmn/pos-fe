/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicExcelReport } from 'components'

const PrintXLS = ({ listRekap, period, year, storeInfo }) => {
  let transitFromQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transitFromQty || 0), 0)
  let transitFromPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transitFromPrice || 0), 0)
  let transferFromQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transferFromQty || 0), 0)
  let transferFromPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transferFromPrice || 0), 0)
  let adjInQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjInQty), 0)
  let adjInPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjInPrice), 0)
  let adjOutQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjOutQty), 0)
  let adjOutPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjOutPrice), 0)
  let inTransitQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.inTransitQty || 0), 0)
  let inTransitPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.inTransitPrice || 0), 0)
  let inTransferQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.inTransferQty || 0), 0)
  let inTransferPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.inTransferPrice || 0), 0)
  let transitQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transitQty || 0), 0)
  let transitPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transitPrice || 0), 0)
  let transferQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transferQty || 0), 0)
  let transferPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transferPrice || 0), 0)

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
    period: {
      name: 'Courier New',
      family: 4,
      size: 12
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
        let row = [
          { value: start, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: '.', alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.productCode || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.productName || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.transitFromQty || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.transitFromPrice || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.transferFromQty || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.transferFromPrice || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.adjInQty || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.adjInPrice || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.adjOutQty || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.adjOutPrice || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.inTransitQty || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.inTransitPrice || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.inTransferQty || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.inTransferPrice || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.transitQty || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.transitPrice || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.transferQty || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.transferPrice || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder }
        ]
        tableBody.push(row)
      }
      start += 1
    }
    tableFooter.push(
      [
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: 'TOTAL', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(transitFromQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(transitFromPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(transferFromQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(transferFromPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(adjInQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(adjInPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(adjOutQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(adjOutPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(inTransitQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(inTransitPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(inTransferQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(inTransferPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(transitQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(transitPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(transferQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(transferPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder }
      ]
    )
    tableFooter.push(
      [
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: 'Total Keluar (d)', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(adjOutQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(adjOutPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder }
      ]
    )
    tableFooter.push(
      [
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: 'Total Masuk (c) + (e) + (g) - (a)', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(((adjInQty || 0) + (transitQty || 0) + (inTransitQty || 0)) - (transitFromQty || 0)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${(((adjInPrice || 0) + (transitPrice || 0) + (inTransitPrice || 0)) - (transitFromPrice || 0)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder }
      ]
    )
    tableHeader.push(
      [
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'TRANSIT FROM OTHER PERIOD (a)', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'TRANSFER FROM OTHER PERIOD (b)', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'TR IN (c)', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'TR OUT (d)', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'IN TRANSIT (e)', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'IN TRANSFER (f)', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'TRANSIT TO OTHER PERIOD (g)', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'TRANSFER TO OTHER PERIOD (h)', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder }
      ],
      [
        { value: 'NO', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'KODE PRODUK', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'NAMA PRODUK', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'QTY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'HPP', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'QTY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'HPP', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'QTY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'HPP', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'QTY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'HPP', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'QTY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'HPP', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'QTY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'HPP', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'QTY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'HPP', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'QTY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'HPP', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder }
      ]
    )

    return tableBody
  }

  const title = [
    { value: 'LAPORAN TRANSFER STOCK', alignment: styles.alignmentCenter, font: styles.title },
    { value: `${storeInfo.name}`, alignment: styles.alignmentCenter, font: styles.merchant },
    { value: `PERIODE : ${moment(period, 'MM').format('MMMM').concat('-', year)}`, alignment: styles.alignmentCenter, font: styles.period }
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
    fileName: 'LAPORAN_TRANSFER_STOCK'
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
