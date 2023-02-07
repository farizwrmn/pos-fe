/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { BasicExcelReport } from 'components'

const PrintXLS = ({ listRekap, from, to, storeInfo }) => {
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
    tableTitle: {
      name: 'Courier New',
      family: 4,
      size: 12,
      bold: true
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

  let tableTitle = []
  let tableHeader = []
  let tableFooter = []
  const createTableBody = (list) => {
    let tableBody = []
    let start = 1
    let countQtyValue = 0
    for (let key in list) {
      if (list.hasOwnProperty(key)) {
        let data = list[key]
        countQtyValue = ((parseFloat(countQtyValue) || 0) + (parseFloat(data.pQty) || 0)) - (parseFloat(data.sQty) || 0)
        let row = [
          { value: start, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: '.', alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.accountCode || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.accountName || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: data.startBalance > 0 ? (data.startBalance || 0) : (0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: data.startBalance < 0 ? (data.startBalance * -1 || 0) : (0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: data.movingBalance > 0 ? (data.movingBalance || 0) : (0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: data.movingBalance < 0 ? (data.movingBalance * -1 || 0) : (0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: data.balance > 0 ? (data.balance || 0) : (0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: data.balance < 0 ? (data.balance * -1 || 0) : (0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder }
        ]

        tableBody.push(row)
      }
      start += 1
    }
    tableHeader.push(
      [
        { value: 'NO', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'KODE', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'NAMA PERKIRAAN', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'SALDO AWAL', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'SALDO BERGERAK', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'SALDO AKHIR', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder }
      ],
    )
    tableHeader.push(
      [
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'DEBIT', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'CREDIT', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'DEBIT', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'CREDIT', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'DEBIT', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'CREDIT', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder }
      ],
    )
    return tableBody
  }

  const title = [
    { value: 'LAPORAN NERACA SALDO', alignment: styles.alignmentCenter, font: styles.title },
    { value: `${storeInfo.name}`, alignment: styles.alignmentCenter, font: styles.merchant },
    { value: `PERIODE : ${from} - ${to}`, alignment: styles.alignmentCenter, font: styles.title }
  ]

  let tableBody = []
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
    tableTitle,
    tableHeader,
    tableBody,
    tableFooter,
    fileName: 'LAPORAN NERACA SALDO'
  }

  let reportType
  reportType = (<BasicExcelReport {...XLSProps} />)

  return (
    { ...reportType }
  )
}

PrintXLS.propTypes = {
  listRekap: PropTypes.array.isRequired,
  storeInfo: PropTypes.string.isRequired,
  period: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired
}

export default PrintXLS
