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
    { value: 'LAPORAN MARKETING PROMO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
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
        { value: 'ID ANGGOTA', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: ':', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: (master.memberCode || '').toString(), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle }
      ],
      [
        { value: 'TANGGAL', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: ':', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: `${moment(master.transDate).format('DD-MMM-YYYY')}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: 'NAMA ANGGOTA', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: ':', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: (master.memberName || '').toString(), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle }
      ],
      [
        { value: 'WAKTU', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: ':', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: master.transTime, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle }
      ]
    ]
    tableTitles.push(tableTitle)

    const diffData = master.products.reduce((group, item) => {
      (group[item.typeCode] = group[item.typeCode] || []).push(item)
      return group
    }, [])

    let group = []
    for (let key in diffData) {
      let header = [
        [
          { value: 'NO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
          { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'KODE PRODUK', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'NAMA PRODUK', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'QTY', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'HARGA SATUAN', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'DISK-1', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'DISK-2', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'DISK-3', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'DISKON', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'DISKON BARANG', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'DISKON FAKTUR', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'DPP', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'PPN', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder }
        ]
      ]
      for (let i = 0; i < header.length; i += 1) {
        group.push(header[i])
      }
      let count = 1
      for (let n = 0; n < diffData[key].length; n += 1) {
        let data = diffData[key][n]
        let tableBody = []
        tableBody.push({ value: `${count}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push({ value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push({ value: `${data.productCode}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push({ value: `${data.productName}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push({ value: (parseFloat(data.qty) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push({ value: (parseFloat(data.sellingPrice) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push({ value: (parseFloat(data.disc1) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push({ value: (parseFloat(data.disc2) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push({ value: (parseFloat(data.disc3) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push({ value: (parseFloat(data.discount) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push({ value: (parseFloat(data.discountItem) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push({ value: (parseFloat(data.discountInvoice) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push({ value: (parseFloat(data.DPP) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push({ value: (parseFloat(data.PPN) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        tableBody.push({ value: (parseFloat(data.netto) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        group.push(tableBody)
        count += 1
      }
    }

    let totalQtyPromo = master.products.filter(x => x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.qty) || 0), 0)
    let totalDiscount1Promo = master.products.filter(x => x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.disc1) || 0), 0)
    let totalDiscount2Promo = master.products.filter(x => x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.disc2) || 0), 0)
    let totalDiscount3Promo = master.products.filter(x => x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.disc3) || 0), 0)
    let totalDiscountPromo = master.products.filter(x => x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.discount) || 0), 0)
    let totalDiscountItemPromo = master.products.filter(x => x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.discItem) || 0), 0)
    let totalDiscountInvoicePromo = master.products.filter(x => x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.discInvoice) || 0), 0)
    let totalDPPPromo = master.products.filter(x => x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.DPP) || 0), 0)
    let totalPPNPromo = master.products.filter(x => x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.PPN) || 0), 0)
    let totalAfterDiscountPromo = master.products.filter(x => x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.netto) || 0), 0)

    let totalQtyNonPromo = master.products.filter(x => !x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.qty) || 0), 0)
    let totalDiscount1NonPromo = master.products.filter(x => !x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.disc1) || 0), 0)
    let totalDiscount2NonPromo = master.products.filter(x => !x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.disc2) || 0), 0)
    let totalDiscount3NonPromo = master.products.filter(x => !x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.disc3) || 0), 0)
    let totalDiscountNonPromo = master.products.filter(x => !x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.discount) || 0), 0)
    let totalDiscountItemNonPromo = master.products.filter(x => !x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.discItem) || 0), 0)
    let totalDiscountInvoiceNonPromo = master.products.filter(x => !x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.discInvoice) || 0), 0)
    let totalDPPNonPromo = master.products.filter(x => !x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.DPP) || 0), 0)
    let totalPPNNonPromo = master.products.filter(x => !x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.PPN) || 0), 0)
    let totalAfterDiscountNonPromo = master.products.filter(x => !x.bundlingId).reduce((cnt, o) => cnt + (parseFloat(o.netto) || 0), 0)

    let totalQty = master.products.reduce((cnt, o) => cnt + (parseFloat(o.qty) || 0), 0)
    let totalDiscount1 = master.products.reduce((cnt, o) => cnt + (parseFloat(o.disc1) || 0), 0)
    let totalDiscount2 = master.products.reduce((cnt, o) => cnt + (parseFloat(o.disc2) || 0), 0)
    let totalDiscount3 = master.products.reduce((cnt, o) => cnt + (parseFloat(o.disc3) || 0), 0)
    let totalDiscount = master.products.reduce((cnt, o) => cnt + (parseFloat(o.discount) || 0), 0)
    let totalDiscountItem = master.products.reduce((cnt, o) => cnt + (parseFloat(o.discItem) || 0), 0)
    let totalDiscountInvoice = master.products.reduce((cnt, o) => cnt + (parseFloat(o.discInvoice) || 0), 0)
    let totalDPP = master.products.reduce((cnt, o) => cnt + (parseFloat(o.DPP) || 0), 0)
    let totalPPN = master.products.reduce((cnt, o) => cnt + (parseFloat(o.PPN) || 0), 0)
    let totalAfterDiscount = master.products.reduce((cnt, o) => cnt + (parseFloat(o.netto) || 0), 0)

    let tableFooterPromo = [
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: 'TOTAL PROMO', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalQtyPromo, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalDiscount1Promo, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalDiscount2Promo, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalDiscount3Promo, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalDiscountPromo, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalDiscountItemPromo, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalDiscountInvoicePromo, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalDPPPromo, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalPPNPromo, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalAfterDiscountPromo, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder }
    ]
    group.push(tableFooterPromo)

    let tableFooterNonPromo = [
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: 'TOTAL NON PROMO', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalQtyNonPromo, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalDiscount1NonPromo, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalDiscount2NonPromo, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalDiscount3NonPromo, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalDiscountNonPromo, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalDiscountItemNonPromo, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalDiscountInvoiceNonPromo, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalDPPNonPromo, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalPPNNonPromo, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalAfterDiscountNonPromo, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder }
    ]
    group.push(tableFooterNonPromo)

    tableBodies.push(group)

    let tableFooter = [
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalQty, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalDiscount1, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalDiscount2, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalDiscount3, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalDiscount, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalDiscountItem, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalDiscountInvoice, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalDPP, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalPPN, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: totalAfterDiscount, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder }
    ]
    tableFooters.push(tableFooter)
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
    fileName: 'Marketing-Promo'
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
