/**
 * Created by Veirry on 07/07/2020.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { RepeatExcelReport } from 'components'

const PrintXLS = ({ listTrans, storeInfo, fromDate, toDate }) => {
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
    { value: 'LAPORAN PEMBAYARAN DETAIL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
    { value: `${storeInfo.name}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant },
    { value: `PERIODE : ${moment(fromDate).format('DD-MMM-YYYY')}  TO  ${moment(toDate).format('DD-MMM-YYYY')}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.period }
  ]

  let tableTitle = []
  let tableBody = []
  let tableFooter = []
  let groupBy = (xs) => {
    return xs
      .reduce((prev, next) => {
        if (next.cost) {
          (prev[next.cost.bankId] = prev[next.cost.bankId] || []).push(next)
          return prev
        }
        (prev.cash = prev.cash || []).push(next)
        return prev
      }, {})
  }
  const groubedByTeam = groupBy(listTrans)
  let arr = Object.keys(groubedByTeam).map(index => groubedByTeam[index])
  for (let i = 0; i < arr.length; i += 1) {
    const item = arr[i][0]
    try {
      let title = [
        [
          { value: 'BANK', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
          { value: ':', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
          { value: `${item.cost ? item.cost.costBank.bankName : 'CASH'}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle }
        ]
      ]
      tableTitle.push(title)
    } catch (e) {
      console.log(e)
    }
  }
  for (let i = 0; i < arr.length; i += 1) {
    let itemArr = arr[i]
    let count = 1
    let header = [
      { value: 'NO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'TANGGAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'NO_FAKTUR', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'CASHIER', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'APPROVE BY', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'OPTION', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'EDC', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'CHARGE', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'AMOUNT', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'MEMO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder }
    ]
    let group = [header]
    for (let key in itemArr) {
      const item = itemArr[key]
      let body = [
        { value: `${count}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
        { value: `${item.transDate}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
        { value: `${item.pos.transNo}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
        { value: `${item.balance.balanceUser.fullName}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
        { value: `${item.balance && item.balance.balanceApprove ? item.balance.balanceApprove.fullName : '-'}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
        { value: `${item.paymentOption && item.paymentOption.typeName ? item.paymentOption.typeName : 'CASH'}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
        { value: `${item.cost && item.cost.costMachine ? item.cost.costMachine.name : 'CASH'}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
        { value: (parseFloat(item.chargeTotal)), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: (parseFloat(item.amount) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
        { value: `${item.description || '-'}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder }
      ]
      count += 1
      group.push(body)
    }
    tableBody.push(group)
    const chargeTotal = itemArr.reduce((cnt, o) => cnt + (parseFloat(o.chargeTotal) || 0), 0)
    const amountTotal = itemArr.reduce((cnt, o) => cnt + (parseFloat(o.amount) || 0), 0)
    let footer = [
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: chargeTotal, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: amountTotal, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder }
    ]
    tableFooter.push(footer)
  }

  let tableFilters = [
    [
      { value: 'NO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'TANGGAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'NO_FAKTUR', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'CASHIER', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'APPROVE BY', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'OPTION', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'EDC', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'BANK', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'CHARGE', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'AMOUNT', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader },
      { value: 'MEMO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader }
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
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader }
    ]
  ]
  let count = 1
  for (let i = 0; i < listTrans.length; i += 1) {
    let item = listTrans[i]
    tableFilters.push([
      { value: count.toString(), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody },
      { value: (item.transDate || ''), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
      { value: (item.pos.transNo || ''), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
      { value: item.balance.balanceUser.fullName, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
      { value: item.balance && item.balance.balanceApprove ? item.balance.balanceApprove.fullName : '-', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
      { value: item.paymentOption && item.paymentOption.typeName ? item.paymentOption.typeName : 'CASH', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
      { value: item.cost && item.cost.costMachine ? item.cost.costMachine.name : 'CASH', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
      { value: item.cost && item.cost.costBank ? item.cost.costBank.bankName : 'CASH', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody },
      { value: parseFloat(item.chargeTotal), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
      { value: parseFloat(item.amount), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody },
      { value: (item.description || '-'), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody }
    ])
    count += 1
  }

  // Declare additional Props
  const XLSProps = {
    className: 'button-width02 button-extra-large bgcolor-green',
    paperSize: 9,
    orientation: 'portrait',
    title,
    tableTitle,
    tableBody,
    tableFooter,
    data: listTrans,
    tableFilter: tableFilters,
    fileName: 'POS-Detail-Summary'
  }

  console.log('XLSProps', XLSProps)

  return (
    <RepeatExcelReport {...XLSProps} />
  )
}

PrintXLS.propTypes = {
  listTrans: PropTypes.object,
  storeInfo: PropTypes.string,
  fromDate: PropTypes.string,
  toDate: PropTypes.string
}

export default PrintXLS
