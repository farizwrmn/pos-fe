/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicExcelReport } from 'components'

const PrintXLS = ({
  listTrans, date, storeInfo,
  beginTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.beginValue || 0), 0),
  grandTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.nettoTotal || 0), 0),
  paidTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.paid || 0), 0),
  cashTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.cash || 0), 0),
  otherPaymentTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.otherPayment || 0), 0),
  receiveableTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.receiveable || 0), 0)
}) => {
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
          { value: (data.invoiceDate ? moment(data.invoiceDate).format('DD-MMM-YYYY') : '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.transNo || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.memberName || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.memberGroupName || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },

          { value: (data.beginValue || 0), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.nettoTotal || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.transDate ? moment(data.transDate).format('DD-MMM-YYYY') : '').toString(), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.cash || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.otherPayment || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },

          { value: (data.paid || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.receiveable || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder }
        ]
        tableBody.push(row)
      }
      start += 1
    }
    tableHeader.push(
      [
        { value: 'NO', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'TANGGAL', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'NO FAKTUR', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'NAMA CUSTOMER', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'GROUP CUSTOMER', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },

        { value: 'SALDO AWAL', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'NETTO', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'PEMBAYARAN', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },

        { value: 'JUMLAH', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'SALDO AKHIR', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder }
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
        { value: 'TGL BYR TERAKHIR', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'CASH', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'OTHER PAYMENT', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },

        { value: 'PEMBAYARAN', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
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

        { value: (beginTotal || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: (grandTotal || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: (cashTotal || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: (otherPaymentTotal || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },

        { value: (paidTotal), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: (receiveableTotal || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder }
      ]
    )
    return tableBody
  }

  const title = [
    { value: 'LAPORAN TUNGGAKAN AR', alignment: styles.alignmentCenter, font: styles.title },
    { value: `${storeInfo.name}`, alignment: styles.alignmentCenter, font: styles.merchant },
    { value: `PERIODE : ${moment(date, 'YYYY-MM-DD').format('DD-MMM-YYYY')}`, alignment: styles.alignmentCenter, font: styles.title }
  ]

  const XLSProps = {
    paperSize: 9,
    orientation: 'portrait',
    data: listTrans,
    title,
    tableTitle,
    tableHeader,
    tableBody: createTableBody(listTrans),
    tableFooter,
    fileName: 'LAPORAN PIUTANG DAGANG'
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
