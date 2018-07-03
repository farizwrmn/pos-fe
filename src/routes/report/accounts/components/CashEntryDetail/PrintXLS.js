/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { formatDate } from 'utils'
import { BasicExcelReport } from 'components'

const PrintXLS = ({ listTrans, from, to, storeInfo }) => {
  // Declare Variable
  let amountIn = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.amountIn || 0), 0)
  let amountOut = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.amountOut || 0), 0)

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
          { value: (data.transNo || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: formatDate(data.transDate), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.reference || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.typeName || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },

          { value: data.amountIn, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: data.amountOut, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder }
        ]
        tableBody.push(row)
      }
      start += 1
    }
    tableHeader.push(
      [
        { value: 'NO', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'TRANSNO', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'TANGGAL', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'REFERENCE', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'PEMBAYARAN', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'DEBIT', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'KREDIT', alignment: styles.alignmentCenter, font: styles.tableHeader }
      ]
    )
    tableFooter.push(
      [
        { value: 'TOTAL', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: amountIn, alignment: styles.alignmentRight, font: styles.tableBody },
        { value: amountOut, alignment: styles.alignmentRight, font: styles.tableBody }
      ]
    )
    return tableBody
  }
  const title = [
    { value: 'LAPORAN REKAP CASH', alignment: styles.alignmentCenter, font: styles.title },
    { value: `${storeInfo.name}`, alignment: styles.alignmentCenter, font: styles.merchant },
    { value: `PERIODE : ${moment(from, 'YYYY-MM-DD').format('DD-MMM-YYYY')} TO ${moment(to, 'YYYY-MM-DD').format('DD-MMM-YYYY')}`, alignment: styles.alignmentCenter, font: styles.title }
  ]
  // Declare additional Props
  const XLSProps = {
    paperSize: 9,
    orientation: 'portrait',
    data: listTrans,
    title,
    tableTitle,
    tableHeader,
    tableBody: createTableBody(listTrans),
    tableFooter,
    fileName: 'LAPORAN-CASH'
  }

  return (
    <BasicExcelReport {...XLSProps} />
  )
}

PrintXLS.propTypes = {
  listTrans: PropTypes.array.isRequired,
  storeInfo: PropTypes.string.isRequired,
  period: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired
}

export default PrintXLS
