/**
 * Created by Veirry on 07/07/2020.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { RepeatExcelReport } from 'components'

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
  tableTotal: {
    name: 'Courier New',
    family: 4,
    size: 11,
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

const groupByType = (
  list,
  {
    type,
    bodyTitle,
    totalTitle
  }
) => {
  let groupBody = [
    [{ value: bodyTitle, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle, border: styles.tableTitle }]
  ]
  for (let key in list[type]) {
    const item = list[type][key]
    try {
      let body = [
        { value: `     ${item.accountCode} - ${item.accountName}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
        { value: (parseFloat(item.debit ? (item.debit * -1) : item.credit || 0)), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder }
      ]
      groupBody.push(body)
    } catch (e) {
      console.log(e)
    }
  }
  const total = list[type].reduce((prev, next) => (prev - parseFloat(next.debit || 0)) + parseFloat(next.credit || 0), 0)
  groupBody.push([
    { value: totalTitle, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTotal, border: styles.tableBorder },
    { value: parseFloat(total), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTotal, border: styles.tableBorder }
  ])
  return {
    groupBody,
    total
  }
}

const PrintXLS = ({ listTrans, storeInfo, fromDate, toDate }) => {
  const title = [
    { value: 'LAPORAN LABA RUGI', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
    { value: `${storeInfo.name}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant },
    { value: `PERIODE : ${moment(fromDate).format('DD-MMM-YYYY')}  TO  ${moment(toDate).format('DD-MMM-YYYY')}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.period }
  ]

  let tableTitle = []
  let tableBody = []
  let tableFooter = []
  let groupBy = (xs, key) => {
    return xs
      .reduce((prev, next) => {
        (prev[next[key]] = prev[next[key]] || []).push(next)
        return prev
      }, {})
  }
  const groubedByTeam = groupBy(listTrans, 'accountType')

  const group = {
    REVE: [],
    COGS: [],
    EXPS: [],
    OINC: [],
    OEXP: [],
    ...groubedByTeam
  }

  const ProcedureOfList = () => {
    // Start - REVE
    const { groupBody: groupREVEBody, total: totalREVE } = groupByType(group, { type: 'REVE', bodyTitle: 'PENDAPATAN', totalTitle: 'Jumlah Pendapatan' })
    tableBody.push(groupREVEBody)
    // End - REVE

    // Start - COGS
    const { groupBody: groupCOGSBody, total: totalCOGS } = groupByType(group, { type: 'COGS', bodyTitle: 'BEBAN POKOK PENJUALAN', totalTitle: 'Jumlah Beban Pokok Penjualan' })
    tableBody.push(groupCOGSBody)
    // End - COGS

    // Start - Laba Kotor
    const labaKotor = totalREVE + totalCOGS
    tableBody.push([
      [
        { value: 'LABA KOTOR', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTotal, border: styles.tableBorder },
        { value: parseFloat(labaKotor), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTotal, border: styles.tableBorder }
      ]
    ])
    // End - Laba Kotor

    // Start - EXPS
    const { groupBody: groupEXPSBody, total: totalEXPS } = groupByType(group, {
      type: 'EXPS',
      totalTitle: 'Jumlah Beban Operasional',
      bodyTitle: 'BEBAN OPERASIONAL'
    })
    tableBody.push(groupEXPSBody)
    // End - EXPS

    // Start - Pendapatan Operasional
    const operationalRevenue = labaKotor + totalEXPS
    tableBody.push([
      [
        { value: 'PENDAPATAN OPERASIONAL', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTotal, border: styles.tableBorder },
        { value: parseFloat(operationalRevenue), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTotal, border: styles.tableBorder }
      ]
    ])
    // End - Pendapatan Operasional

    // Start - OINC
    const { groupBody: groupOINCBody, total: totalOINC } = groupByType(group, { type: 'OINC', bodyTitle: 'PENDAPATAN NON OPERASIONAL', totalTitle: 'Jumlah Pendapatan Non Operasional' })
    tableBody.push(groupOINCBody)
    // End - OINC

    // Start - OEXP
    const { groupBody: groupOXPSBody, total: totalOXPS } = groupByType(group, {
      type: 'OEXP',
      bodyTitle: 'BEBAN NON OPERASIONAL',
      totalTitle: 'Jumlah Beban Non Operasional'
    })
    tableBody.push(groupOXPSBody)
    // End - OEXP

    // Start - Jumlah Non Operasional
    const nonOperationalRevenue = totalOINC + totalOXPS
    const fixRevenue = operationalRevenue + nonOperationalRevenue
    tableBody.push([
      [
        { value: 'Jumlah Pendapatan dan Beban Non Operasional', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTotal, border: styles.tableBorder },
        { value: parseFloat(nonOperationalRevenue), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTotal, border: styles.tableBorder }
      ],
      [
        { value: 'LABA BERSIH (SEBELUM PAJAK)', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTotal, border: styles.tableBorder },
        { value: parseFloat(fixRevenue), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTotal, border: styles.tableBorder }
      ],
      [
        { value: 'LABA BERSIH (SETELAH PAJAK)', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTotal, border: styles.tableBorder },
        { value: parseFloat(fixRevenue), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTotal, border: styles.tableBorder }
      ]
    ])
    // End - Jumlah Non Operasional
  }

  try {
    ProcedureOfList()
  } catch (error) {
    console.log('error', error)
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
    data: tableBody,
    fileName: 'Accounting-Detail-Summary'
  }

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
