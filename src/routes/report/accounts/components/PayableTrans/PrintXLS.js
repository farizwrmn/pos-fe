/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicExcelReport } from 'components'

const PrintXLS = ({ listTrans, from, to, storeInfo }) => {
  // Declare Variable
  let beginTotal = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.beginValue || 0), 0)
  let nettoTotal = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.nettoTotal || 0), 0)
  let paidTotal = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.paidTotal || 0), 0)
  let returnTotal = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.returnTotal || 0), 0)
  let adjustTotal = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.adjustTotal || 0), 0)
  let total = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.total || 0), 0)

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
    console.log(list)
    let tableBody = []
    let start = 1
    let countQtyValue = 0
    for (let key in list) {
      if (list.hasOwnProperty(key)) {
        let data = list[key]
        countQtyValue = ((parseFloat(countQtyValue) || 0) + (parseFloat(data.pQty) || 0)) - (parseFloat(data.sQty) || 0)
        let row = [
          { value: start.toString(), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: '.', alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.supplierName || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.supplierTaxId || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.address01 || data.address02 || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.accountNo || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },

          { value: data.invoiceDate ? moment(data.invoiceDate).format('DD-MMM-YYYY') : '', alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: data.dueDate ? moment(data.dueDate).format('DD-MMM-YYYY') : '', alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.transNo || ''), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.beginValue || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.nettoTotal || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },

          { value: data.transDate ? moment(data.transDate).format('DD-MMM-YYYY') : '', alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.paid || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.bankName || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.checkNo || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.paid || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },

          { value: (data.paidTotal || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.returnTotal || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.adjustTotal || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.total || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.detail || ''), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder }
        ]
        tableBody.push(row)
      }
      start += 1
    }
    tableHeader.push(
      [
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'SUPPLIER', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },

        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },

        { value: 'PEMBAYARAN', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },

        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder }
      ]
    )
    tableHeader.push(
      [
        { value: 'NO', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'NAMA SUPPLIER', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'NPWP', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'ALAMAT', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'NO REK', alignment: styles.alignmentCenter, font: styles.tableHeader },

        { value: 'TGL FAKTUR', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'TGL JTO', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'NO FAKTUR', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'SALDO AWAL', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'PEMBELIAN', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },

        { value: 'TGL BAYAR', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'CASH', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'VIA BANK', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },

        { value: 'JUMLAH BAYAR', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'RETUR PEMBELIAN', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'ADJ', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'SALDO AKHIR', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'KETERANGAN', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder }
      ]
    )
    tableHeader.push(
      [
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },

        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },

        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'NAMA BANK', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'NO GIRO', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'NOMINAL BANK', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },

        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder }
      ]
    )
    tableFooter.push(
      [
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: 'SUBTOTAL', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },

        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: beginTotal, alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: nettoTotal, alignment: styles.alignmentCenter, font: styles.tableBody },

        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: paidTotal, alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: paidTotal, alignment: styles.alignmentCenter, font: styles.tableBody },

        { value: paidTotal, alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: returnTotal, alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: adjustTotal, alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: total, alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody }
      ]
    )
    return tableBody
  }
  const title = [
    { value: 'LAPORAN PEMBAYARAN HUTANG', alignment: styles.alignmentCenter, font: styles.title },
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
    mergeCells: [
      'A8:A9',
      'B8:B9',
      'C7:F7',
      'L7:Q7',
      'N8:P8',
      'C8:C9',
      'D8:D9',
      'E8:E9',
      'F8:F9',
      'G8:G9',
      'H8:H9',
      'I8:I9',
      'J8:J9',
      'K8:K9',
      'L8:L9',
      'M8:M9',
      'Q8:Q9',
      'R8:R9',
      'S8:S9',
      'T8:T9',
      'U8:U9'
    ],
    fileName: 'LAPORAN-HUTANG'
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
