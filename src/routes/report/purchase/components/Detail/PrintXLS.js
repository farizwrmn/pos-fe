import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { RepeatExcelReport } from 'components'

const PrintXLS = ({ listData, storeInfo, fromDate, toDate }) => {
  // listData = listData.filter(x => x.items.length)
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

  const title = [
    { value: 'LAPORAN HISTORY PEMBELIAN DETAIL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
    { value: `${storeInfo.name}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant },
    { value: `PERIODE : ${moment(fromDate).format('DD-MMM-YYYY')}  TO  ${moment(toDate).format('DD-MMM-YYYY')}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.period }
  ]

  const tableHeader = [
    [
      { value: 'NO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'KODE PRODUK', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'NAMA PRODUK', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'QTY', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'HARGA SATUAN', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'SUB TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'DISK(%)', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'DISK(N)', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'TOTAL DISKON', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'DELIVERY', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder }
    ]
  ]

  let tableTitles = []
  let tableBodies = []
  let tableFooters = []
  for (let i = 0; i < listData.length; i += 1) {
    let master = listData[i]
    let tableTitle = [
      [
        { value: 'NO TRANSAKSI', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: ':', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableTitle },
        { value: `${master.transNo}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: 'KODE PEMASOK', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: ':', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableTitle },
        { value: (master.supplierCode || '').toString(), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle }
      ],
      [
        { value: 'TANGGAL', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: ':', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableTitle },
        { value: moment(master.transDate).format('DD-MMM-YYYY'), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: 'NAMA PEMASOK', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: ':', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableTitle },
        { value: (master.supplierName || '').toString(), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle }
      ],
      [
        { value: 'TIPE PAJAK', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: ':', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableTitle },
        { value: `${(master.taxType || '').toString()}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: 'ALAMAT', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: ':', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle }
      ],
      [
        { value: 'DISKON(%)', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: ':', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableTitle },
        { value: `${(master.discInvoicePercent || 0).toString()}%`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: 'MEMO', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: ':', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableTitle },
        { value: (master.memo || '').toString(), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle }
      ],
      [
        { value: 'DISKON(N)', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: ':', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableTitle },
        { value: (master.discInvoiceNominal || 0), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: 'DELIVERY', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: ':', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableTitle },
        { value: (master.deliveryFee || '-').toLocaleString(), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle }
      ]
    ]
    tableTitles.push(tableTitle)

    let group = []
    let count = 1
    if (master.items && master.items.length > 0) {
      for (let key in master.items) {
        let data = master.items[key]
        let tableBody = []
        tableBody.push({ value: `${count}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push({ value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push({ value: `${data.productCode}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push({ value: `${data.productName}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push({ value: data.qty, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push({ value: data.purchasePrice, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push({ value: data.qty * data.purchasePrice, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push({ value: `${(parseFloat(data.discPercent) || 0).toString()}%`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push({ value: data.discNominal, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push({ value: data.totalDiscount, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push({ value: data.deliveryFee, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push({ value: data.netto, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        group.push(tableBody)
        count += 1
      }
    }
    tableBodies.push(group)

    let totalQty = master.items.reduce((cnt, o) => cnt + (parseFloat(o.qty) || 0), 0)
    let totalSubTotal = master.items.reduce((cnt, o) => cnt + (parseFloat(o.qty * o.purchasePrice) || 0), 0)
    let totalDiscount = master.items.reduce((cnt, o) => cnt + (parseFloat(o.totalDiscount) || 0), 0)
    let deliveryFeeTotal = master.items.reduce((cnt, o) => cnt + (parseFloat(o.deliveryFee) || 0), 0)
    let totalAfterDiscount = master.items.reduce((cnt, o) => cnt + (parseFloat(o.netto) || 0), 0)

    let tableFooter = []
    if (master.items && master.items.length > 0) {
      tableFooter.push({ value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter })
      tableFooter.push({ value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter })
      tableFooter.push({ value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter })
      tableFooter.push({ value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder })
      tableFooter.push({ value: totalQty, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder })
      tableFooter.push({ value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder })
      tableFooter.push({ value: totalSubTotal, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder })
      tableFooter.push({ value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder })
      tableFooter.push({ value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder })
      tableFooter.push({ value: totalDiscount, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder })
      tableFooter.push({ value: deliveryFeeTotal, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder })
      tableFooter.push({ value: totalAfterDiscount, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder })
    }
    tableFooters.push(tableFooter)
  }

  let tableFilters = [
    [
      { value: 'NO TRANSAKSI', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'TAX INVOICE NO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'KODE PEMASOK', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'NAMA PEMASOK', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'KODE PRODUK', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'NAMA PRODUK', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'QTY', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'HARGA SATUAN', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'SUB TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'DISK(%)', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'DISK(N)', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'TOTAL DISKON', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'DELIVERY', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader }
    ],
    [
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader }
    ]
  ]
  for (let i = 0; i < listData.length; i += 1) {
    let master = listData[i]
    for (let key in master.items) {
      let item = master.items[key]
      tableFilters.push([
        { value: `${master.transNo}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
        { value: (master.taxInvoiceNo || '').toString(), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
        { value: (master.supplierCode || '').toString(), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
        { value: (master.supplierName || '').toString(), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
        { value: (item.productCode || ''), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
        { value: (item.productName || ''), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
        { value: item.qty, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: item.purchasePrice, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: item.qty * item.purchasePrice, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: `${(parseFloat(item.discPercent) || 0).toString()}%`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: item.discNominal, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: item.totalDiscount, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: item.deliveryFee, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: item.netto, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody }
      ])
    }
  }


  // Declare additional Props
  const XLSProps = {
    className: 'button-width02 button-extra-large bgcolor-green',
    paperSize: 9,
    orientation: 'portrait',
    title,
    tableHeader,
    tableTitle: tableTitles,
    tableBody: tableBodies,
    tableFooter: tableFooters,
    tableFilter: tableFilters,
    data: listData,
    fileName: 'Purchase-Detail-Summary'
  }

  return (
    <RepeatExcelReport {...XLSProps} />
  )
}

PrintXLS.propTypes = {
  listData: PropTypes.object,
  storeInfo: PropTypes.string,
  fromDate: PropTypes.string,
  toDate: PropTypes.string
}

export default PrintXLS
