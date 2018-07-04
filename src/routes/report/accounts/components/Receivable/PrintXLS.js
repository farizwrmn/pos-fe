/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { numberFormat } from 'utils'
import { BasicExcelReport } from 'components'

const PrintXLS = ({ listTrans, date, storeInfo }) => {
  // Declare Variable
  let grandTotal = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.nettoTotal || 0), 0)
  let paidTotal = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.paid || 0), 0)
  let gt120daysTotal = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.gt120days || 0), 0)
  let gt90daysTotal = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.gt90days || 0), 0)
  let gt60daysTotal = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.gt60days || 0), 0)
  let gt30daysTotal = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.gt30days || 0), 0)
  let gt15daysTotal = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.gt15days || 0), 0)
  let gte0daysTotal = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.gte0days || 0), 0)
  let nettoTotal = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.restNetto || 0), 0)

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
        let row = []
        row.push({ value: start, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: '.', alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.invoiceDate || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.transNo || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.memberName || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })

        row.push({ value: (data.memberGroupName || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.nettoTotal || 0), numFmt: numberFormat.formatNumberInExcel(data.nettoTotal, 2), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.paid || 0), numFmt: numberFormat.formatNumberInExcel(data.paid, 2), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.gt120days || 0), numFmt: numberFormat.formatNumberInExcel(data.gt120days, 2), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.gt90days || 0), numFmt: numberFormat.formatNumberInExcel(data.gt90days, 2), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })

        row.push({ value: (data.gt60days || 0), numFmt: numberFormat.formatNumberInExcel(data.gt60days, 2), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.gt30days || 0), numFmt: numberFormat.formatNumberInExcel(data.gt30days, 2), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.gt15days || 0), numFmt: numberFormat.formatNumberInExcel(data.gt15days, 2), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.gte0days || 0), numFmt: numberFormat.formatNumberInExcel(data.gte0days, 2), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.restNetto || 0), numFmt: numberFormat.formatNumberInExcel(data.restNetto, 2), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push(row)
      }
      start += 1
    }
    tableHeader.push(
      [
        { value: 'NO', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'TGL FAKTUR', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'NO FAKTUR', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'NAMA CUSTOMER', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'GROUP CUSTOMER', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },

        { value: 'SALDO', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'BAYAR', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'UMUR PIUTANG (HARI)', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },

        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'SISA', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder }
      ],
      [
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },

        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '> 120', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '91 - 120', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '61 - 90', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },

        { value: '31 - 60', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '16 - 30', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '1 - 15', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder }
      ]
    )
    tableFooter.push(
      [
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: 'TOTAL', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },

        { value: grandTotal, numFmt: numberFormat.formatNumberInExcel(grandTotal, 2), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: paidTotal, numFmt: numberFormat.formatNumberInExcel(paidTotal, 2), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: gt120daysTotal, numFmt: numberFormat.formatNumberInExcel(gt120daysTotal, 2), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: gt90daysTotal, numFmt: numberFormat.formatNumberInExcel(gt90daysTotal, 2), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: gt60daysTotal, numFmt: numberFormat.formatNumberInExcel(gt60daysTotal, 2), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },

        { value: gt30daysTotal, numFmt: numberFormat.formatNumberInExcel(gt30daysTotal, 2), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: gt15daysTotal, numFmt: numberFormat.formatNumberInExcel(gt15daysTotal, 2), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: gte0daysTotal, numFmt: numberFormat.formatNumberInExcel(gte0daysTotal, 2), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: nettoTotal, numFmt: numberFormat.formatNumberInExcel(nettoTotal, 2), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder }
      ]
    )
    return tableBody
  }
  const title = [
    { value: 'LAPORAN TUNGGAKAN AR', alignment: styles.alignmentCenter, font: styles.title },
    { value: `${storeInfo.name}`, alignment: styles.alignmentCenter, font: styles.merchant },
    { value: `PERIODE : ${moment(date, 'YYYY-MM-DD').format('DD-MMM-YYYY')}`, alignment: styles.alignmentCenter, font: styles.title }
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
    fileName: 'LAPORAN-TUNGGAKAN-AR'
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
