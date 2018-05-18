/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicExcelReport } from 'components'

const PrintXLS = ({ listRekap, period, year, storeInfo }) => {
  let beginQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.beginQty), 0)
  let beginPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.beginPrice), 0)
  let purchaseQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.purchaseQty), 0)
  let purchasePrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.purchasePrice), 0)
  let adjInQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjInQty), 0)
  let adjInPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjInPrice), 0)
  let posQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.posQty), 0)
  let posPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.posPrice), 0)
  let adjOutQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjOutQty), 0)
  let adjOutPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjOutPrice), 0)
  let transferInQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transferInQty || 0), 0)
  let transferInPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transferInPrice || 0), 0)
  let transferOutQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transferOutQty || 0), 0)
  let transferOutPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transferOutPrice || 0), 0)
  let count = listRekap.reduce((cnt, o) => cnt + parseFloat(o.count), 0)
  let amount = listRekap.reduce((cnt, o) => cnt + parseFloat(o.amount), 0)
  let inTransitQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.inTransitQty || 0), 0)
  let inTransitPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.inTransitPrice || 0), 0)
  let inTransferQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.inTransferQty || 0), 0)
  let inTransferPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.inTransferPrice || 0), 0)

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
        row.push({ value: (data.beginQty || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.beginPrice || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.purchaseQty || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.purchasePrice || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.adjInQty || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.adjInPrice || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.transferInQty || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.transferInPrice || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.posQty || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.posPrice || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.adjOutQty || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.adjOutPrice || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.transferOutQty || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.transferOutPrice || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.count || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.amount || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.inTransitQty || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.inTransitPrice || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.inTransferQty || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.inTransferPrice || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
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
        { value: `${beginQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${beginPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${purchaseQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${purchasePrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${adjInQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${adjInPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${transferInQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${transferInPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${posQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${posPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${adjOutQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${adjOutPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${transferOutQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${transferOutPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${count.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${amount.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${inTransitQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${inTransitPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${inTransferQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: `${inTransferPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder }
      ]
    )
    tableHeader.push(
      [
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'SALDO AWAL', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'PEMBELIAN', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'ADJ IN + RETUR PENJUALAN', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'TR IN', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'PENJUALAN', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'ADJ OUT + RETUR PEMBELIAN', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'TR OUT', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'SALDO AKHIR', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'TRANSIT + IN TRANSIT', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'IN TRANSFER', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader }
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
    { value: 'LAPORAN REKAP FIFO', alignment: styles.alignmentCenter, font: styles.title },
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
    fileName: 'LAPORAN REKAP FIFO'
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
