import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { RepeatExcelReport } from 'components'

const PrintXLS = ({ listData, storeInfo, fromDate, toDate }) => {
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
    { value: 'LAPORAN HISTORY POS DETAIL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
    { value: `${storeInfo.name}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant },
    { value: `PERIODE : ${moment(fromDate).format('DD-MMM-YYYY')}  TO  ${moment(toDate).format('DD-MMM-YYYY')}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.period }
  ]

  let tableTitles = []
  let tableBodies = []
  let tableFooters = []
  for (let i = 0; i < listData.length; i += 1) {
    let master = listData[i]
    let tableTitle = [
      [
        { value: 'NO TRANSAKSI', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: ':', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: `${master.transNo}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: 'NO PLAT/KM', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: ':', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: `${(master.policeNo || '').toString()}${(master.policeNo && master.lastMeter) ? '/' : ''}${(master.lastMeter || '').toString()}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle }
      ],
      [
        { value: 'TANGGAL', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: ':', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: `${moment(master.transDate).format('DD-MMM-YYYY')}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: 'MEREK/MODEL', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: ':', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: `${(master.merk || '').toString()}${(master.merk && master.model) ? '/' : ''}${(master.model || '').toString()}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle }
      ],
      [
        { value: 'ID ANGGOTA', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: ':', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: `${(master.memberCode || '').toString()}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: 'TIPE/TAHUN', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: ':', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: `${(master.type || '').toString()}${(master.type && master.year) ? '/' : ''}${(master.year || '').toString()}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle }
      ],
      [
        { value: 'NAMA ANGGOTA', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: ':', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: `${(master.memberName || '').toString()}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: 'MEKANIK', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: ':', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: `${(master.technicianName || '').toString()}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle }
      ]
    ]
    tableTitles.push(tableTitle)

    const diffData = master.items.reduce((group, item) => {
      (group[item.typeCode] = group[item.typeCode] || []).push(item)
      return group
    }, [])

    let group = []
    for (let key in diffData) {
      let header = []
      switch (key) {
        case 'P':
          header.push([
            { value: 'NO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
            { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'KODE PRODUK', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'NAMA PRODUK', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'QTY', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'HARGA SATUAN', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'SUB TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'DISK-1', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'DISK-2', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'DISK-3', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'DISKON', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'LOYALTY', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'TOTAL DISKON', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder }
          ])
          break
        case 'S':
          header.push([
            { value: 'NO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
            { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'KODE SERVIS', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'NAMA SERVIS', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'QTY', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'HARGA SATUAN', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'SUB TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'DISK-1', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'DISK-2', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'DISK-3', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'DISKON', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'LOYALTY', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'TOTAL DISKON', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder }
          ])
          break
        default:
      }
      for (let i = 0; i < header.length; i += 1) {
        group.push(header[i])
      }
      let count = 1
      for (let n = 0; n < diffData[key].length; n += 1) {
        let data = diffData[key][n]
        const sellingPrice = (data.sellPrice - data.sellingPrice > 0 ? data.sellPrice : data.sellingPrice || 0)
        let tableBody = [
          { value: `${count}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
          { value: `${data.productCode}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
          { value: `${data.productName}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
          { value: (parseFloat(data.qty) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: (parseFloat(sellingPrice) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: (parseFloat(sellingPrice * data.qty) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: (parseFloat(data.disc1) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: (parseFloat(data.disc2) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: (parseFloat(data.disc3) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: (parseFloat(data.discount) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: (parseFloat(data.discountLoyalty) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: (parseFloat(data.totalDiscount)), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: (parseFloat(data.netto) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder }
        ]
        group.push(tableBody)
        count += 1
      }
    }
    tableBodies.push(group)

    let totalQty = master.items.reduce((cnt, o) => cnt + (parseFloat(o.qty) || 0), 0)
    let totalSubTotal = master.items.reduce((cnt, o) => cnt + ((o.sellPrice - o.sellingPrice > 0 ? o.sellPrice : o.sellingPrice || 0) * o.qty), 0)
    let totalDiscount4 = master.items.reduce((cnt, o) => cnt + (parseFloat(o.discount) || 0), 0)
    let totalDiscountLoyalty = master.items.reduce((cnt, o) => cnt + (parseFloat(o.discountLoyalty) || 0), 0)
    let totalDiscount = master.items.reduce((cnt, o) => cnt + o.totalDiscount, 0)
    let totalAfterDiscount = master.items.reduce((cnt, o) => cnt + (parseFloat(o.netto) || 0), 0)

    let tableFooter = [
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalQty, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalSubTotal, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalDiscount4, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalDiscountLoyalty, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalDiscount, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalAfterDiscount, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder }
    ]
    tableFooters.push(tableFooter)
  }

  let tableFilters = [
    [
      { value: 'NO TRANSAKSI', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'ID ANGGOTA', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'TANGGAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'KODE PRODUK', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'NAMA PRODUK', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'QTY', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'HARGA SATUAN', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'SUB TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'DISK-1', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'DISK-2', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'DISK-3', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'DISKON', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'LOYALTY', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'TOTAL DISKON', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
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
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader }
    ]
  ]
  for (let i = 0; i < listData.length; i += 1) {
    let master = listData[i]
    for (let key in master.items) {
      let item = master.items[key]
      const sellingPrice = (item.sellPrice - item.sellingPrice > 0 ? item.sellPrice : item.sellingPrice || 0)
      tableFilters.push([
        { value: `${master.transNo}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
        { value: (master.memberCode || '').toString(), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
        { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody },
        { value: (item.transDate || ''), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
        { value: (item.productCode || ''), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
        { value: (item.productName || ''), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
        { value: (parseFloat(item.qty) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: (parseFloat(sellingPrice) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: (parseFloat((sellingPrice) * item.qty)), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: (parseFloat(item.disc1) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: (parseFloat(item.disc2) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: (parseFloat(item.disc3) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: (parseFloat(item.discount) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: (parseFloat(item.discountLoyalty) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: (parseFloat(item.totalDiscount)), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: (parseFloat(item.netto) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody }
      ])
    }
  }

  // Declare additional Props
  const XLSProps = {
    className: 'button-width02 button-extra-large bgcolor-green',
    paperSize: 9,
    orientation: 'portrait',
    title,
    tableTitle: tableTitles,
    tableBody: tableBodies,
    tableFooter: tableFooters,
    data: listData,
    tableFilter: tableFilters,
    fileName: 'POS-Detail-Summary'
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
