import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { RepeatExcelReport } from 'components'

const PrintXLS = ({ listRekap, storeInfo, from, to }) => {
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
    { value: 'LAPORAN HISTORY BUKU BESAR', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
    { value: `${storeInfo.name}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant },
    { value: `PERIODE : ${moment(from).format('DD-MMM-YYYY')}  TO  ${moment(to).format('DD-MMM-YYYY')}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.period }
  ]

  let tableTitles = []
  let tableBodies = []
  let tableFooters = []
  for (let i = 0; i < listRekap.length; i += 1) {
    let master = listRekap[i]
    let tableTitle = [
      [
        { value: 'AKUN', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: ':', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: `${master.accountCode}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: `${master.accountName}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle }
      ]
    ]
    tableTitles.push(tableTitle)

    const diffData = master.items.reduce((group, item) => {
      (group[item.accountId] = group[item.accountId] || []).push(item)
      return group
    }, [])

    let group = []
    let amount = 0
    for (let key in diffData) {
      let header = []
      header.push([
        { value: 'NO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'TANGGAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'REF', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'KODE', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'AKUN', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'DESKRIPSI', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'DEBIT', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'CREDIT', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'SALDO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder }
      ])
      if (diffData[key] && diffData[key][0] && diffData[key][0].amount != null) {
        const beginValue = diffData[key][0].amount - ((diffData[key][0].debit || 0) - (diffData[key][0].credit || 0))
        header.push([
          { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody, border: styles.tableBorder },
          { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody, border: styles.tableBorder },
          { value: 'SALDO AWAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody, border: styles.tableBorder },
          { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody, border: styles.tableBorder },
          { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody, border: styles.tableBorder },
          { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody, border: styles.tableBorder },
          { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody, border: styles.tableBorder },
          { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody, border: styles.tableBorder },
          { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody, border: styles.tableBorder },
          { value: parseFloat(beginValue), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder }
        ])
      }
      for (let i = 0; i < header.length; i += 1) {
        group.push(header[i])
      }
      let count = 1
      for (let n = 0; n < diffData[key].length; n += 1) {
        let data = diffData[key][n]
        let tableBody = [
          { value: `${count}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
          { value: `${data.transDate}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
          { value: `${data.transNo}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
          { value: `${data.accountCode}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
          { value: `${data.accountName}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
          { value: `${data.description || ''}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
          { value: (parseFloat(data.debit) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: (parseFloat(data.credit) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: (parseFloat(data.amount) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder }
        ]
        group.push(tableBody)
        amount = data.amount
        count += 1
      }
    }
    tableBodies.push(group)

    // let debit = master.items.reduce((cnt, o) => cnt + (parseFloat(o.debit) || 0), 0)
    // let credit = master.items.reduce((cnt, o) => cnt + (parseFloat(o.credit) || 0), 0)

    let tableFooter = [
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: 'SALDO AKHIR', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: amount, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder }
    ]
    tableFooters.push(tableFooter)
  }

  let tableFilters = [
    [
      { value: 'NO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'TANGGAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'REF', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'KODE', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'AKUN', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'DESKRIPSI', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'DEBIT', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'CREDIT', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'SALDO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader }
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
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader }
    ]
  ]
  let count = 1
  for (let i = 0; i < listRekap.length; i += 1) {
    let master = listRekap[i]
    for (let key in master.items) {
      let item = master.items[key]
      tableFilters.push([
        { value: `${count}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
        { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody },
        { value: (item.transDate || ''), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
        { value: (item.transNo || ''), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
        { value: (item.accountCode || ''), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
        { value: (item.accountName || ''), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
        { value: (item.description || ''), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
        { value: (parseFloat(item.debit) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: (parseFloat(item.credit) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
        { value: (parseFloat(item.amount) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody }
      ])
      count += 1
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
    data: listRekap,
    tableFilter: [],
    fileName: 'POS-General-Ledger'
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
