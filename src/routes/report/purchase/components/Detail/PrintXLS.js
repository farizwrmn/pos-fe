import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { RepeatExcelReport } from 'components'

const PrintXLS = ({ listData, storeInfo, fromDate, toDate }) => {
  listData = listData.filter(x => x.items.length)
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
    { value: 'LAPORAN RIWAYAT RINCIAN PEMBELIAN', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.header },
    { value: `${storeInfo.name}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant },
    { value: `PERIODE : ${moment(fromDate).format('DD-MMM-YYYY')}  hingga  ${moment(toDate).format('DD-MMM-YYYY')}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.period }
  ]

  const tableHeader = [
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
    { value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder }
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
        { value: 'ID PEMASOK', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
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
        { value: `${(master.discInvoiceNominal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: ':', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle }
      ]
    ]
    tableTitles.push(tableTitle)

    let group = []
    let count = 1
    for (let key in master.items) {
      let data = master.items[key]
      let tableBody = []
      tableBody.push({ value: `${count}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: `${data.productCode}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: `${data.productName}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: `${(parseFloat(data.qty) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: `${(parseFloat(data.purchasePrice) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: `${(parseFloat(data.qty * data.purchasePrice) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: `${(parseFloat(data.discPercent) || 0).toString()}%`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: `${(parseFloat(data.discNominal) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: `${(parseFloat(data.totalDiscount) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: `${(parseFloat(data.netto) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      group.push(tableBody)
      count += 1
    }
    tableBodies.push(group)

    let totalQty = master.items.reduce((cnt, o) => cnt + (parseFloat(o.qty) || 0), 0)
    let totalSubTotal = master.items.reduce((cnt, o) => cnt + (parseFloat(o.qty * o.purchasePrice) || 0), 0)
    let totalDiscount = master.items.reduce((cnt, o) => cnt + (parseFloat(o.totalDiscount) || 0), 0)
    let totalAfterDiscount = master.items.reduce((cnt, o) => cnt + (parseFloat(o.netto) || 0), 0)

    let tableFooter = []
    tableFooter.push({ value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter })
    tableFooter.push({ value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter })
    tableFooter.push({ value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter })
    tableFooter.push({ value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder })
    tableFooter.push({ value: `${totalQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder })
    tableFooter.push({ value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder })
    tableFooter.push({ value: `${totalSubTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder })
    tableFooter.push({ value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder })
    tableFooter.push({ value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder })
    tableFooter.push({ value: `${totalDiscount.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder })
    tableFooter.push({ value: `${totalAfterDiscount.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder })
    tableFooters.push(tableFooter)
  }

  let tableFilters = []
  for (let i = 0; i < listData.length; i += 1) {
    let master = listData[i]
    let tableFilter = [
      [
        { value: 'NO TRANSAKSI', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
        { value: 'ID PEMASOK', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
        { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
        { value: 'KODE PRODUK', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
        { value: 'NAMA PRODUK', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
        { value: 'QTY', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
        { value: 'HARGA SATUAN', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
        { value: 'SUB TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
        { value: 'DISK(%)', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
        { value: 'DISK(N)', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
        { value: 'TOTAL DISKON', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
        { value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader }
      ]
    ]
    for (let key in master.items) {
      let item = master.items[key]
      tableFilter.push([
        { value: `${master.transNo}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
        { value: (master.supplierCode || '').toString(), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
        { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody },
        { value: (item.productCode || ''), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
        { value: (item.productName || ''), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
        { value: `${(parseFloat(item.qty) || 0)}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: `${(parseFloat(item.purchasePrice) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: `${(parseFloat(item.qty * item.purchasePrice) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: `${(parseFloat(item.discPercent) || 0).toString()}%`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: `${(parseFloat(item.discNominal) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: `${(parseFloat(item.totalDiscount) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: `${(parseFloat(item.netto) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody }
      ])
    }
    tableFilters.push(tableFilter)
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
