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

const getTotal = (data = []) => {
  if (!data) return 0
  return data.reduce((prev, next) => prev + parseFloat(next.debit ? (next.debit * -1) : next.credit || 0), 0)
}

const createProfitLossTableBody = (
  list,
  {
    bodyTitle,
    totalTitle
  }
) => {
  let groupBody = [
    [{ value: bodyTitle, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle, border: styles.tableTitle }]
  ]
  for (let key in list) {
    const item = list[key]
    try {
      let body = [
        { value: `     ${item.accountName}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
        { value: (parseFloat(item.debit ? (item.debit * -1) : item.credit || 0)), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder }
      ]
      groupBody.push(body)
    } catch (e) {
      console.log(e)
    }
  }
  const total = list.reduce((prev, next) => (prev - parseFloat(next.debit || 0)) + parseFloat(next.credit || 0), 0)
  groupBody.push([
    { value: totalTitle, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTotal, border: styles.tableBorder },
    { value: parseFloat(total), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTotal, border: styles.tableBorder }
  ])
  return {
    groupBody,
    total
  }
}

const createTableBody = (tabledata, bodyStruct) => {
  let groupBody = []
  let grandTotal = 0
  for (let key in bodyStruct) {
    const item = bodyStruct[key]
    const depth = ('\t').repeat(0)
    if (item.accountName) {
      groupBody.push([
        { value: `${depth}${item.accountName}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
        { value: parseFloat(item.debit ? (item.debit * -1) : item.credit || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder }
      ])
    } else {
      groupBody.push([
        { value: `${depth}${item.bodyTitle}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder }
      ])
    }
    if (item.child) {
      const { data, total } = createTableBody(tabledata, item.child)
      groupBody = groupBody.concat(data)
      groupBody.push([
        { value: `${depth}${item.totalTitle}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTotal, border: styles.tableBorder },
        { value: parseFloat(total), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTotal, border: styles.tableBorder }
      ])
      grandTotal += total
    }
    if (item.type) {
      const accountData = tabledata[item.type]
      const total = accountData.reduce((prev, next) => (prev - parseFloat(next.debit || 0)) + parseFloat(next.credit || 0), 0)
      const { data } = createTableBody(tabledata, accountData)
      groupBody = groupBody.concat(data)
      groupBody.push([
        { value: `${depth}${item.totalTitle}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTotal, border: styles.tableBorder },
        { value: parseFloat(total), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTotal, border: styles.tableBorder }
      ])
      grandTotal += parseFloat(total || 0)
    }
  }

  return { data: groupBody, total: grandTotal }
}

const PrintXLS = ({ listTrans, storeInfo, fromDate, toDate }) => {
  const title = [
    { value: 'LAPORAN ARUS KAS', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
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
    // BalanceSheet
    BANK: [],
    AREC: [], // 4 - Piutang Usaha
    INTR: [], // 5 - Persediaan
    OCAS: [], // 6 - Aset Lancar Lainnya

    FASS: [], // 7 - Aset Tetap
    DEPR: [], // 1 - Penyusutan
    OASS: [], // 8 - Aset Lainnya

    APAY: [], // 2 - Hutang Usaha
    OCLY: [], // 3 - Kewajiban Jangka Pendek
    LTLY: [], // 9 - Kewajiban Jangka Panjang

    EQTY: [], // 10 - Modal

    // ProfitLoss
    REVE: [],
    COGS: [],
    EXPS: [],
    OINC: [],
    OEXP: [],
    ...groubedByTeam
  }

  const ProcedureOfList = () => {
    const fixRevenue = listTrans.filter(filtered => filtered.accountType === 'REVE'
      || filtered.accountType === 'COGS'
      || filtered.accountType === 'EXPS'
      || filtered.accountType === 'OINC'
      || filtered.accountType === 'OEXP')
      .reduce((prev, next) => (prev - parseFloat(next.debit || 0)) + parseFloat(next.credit || 0), 0)
    console.log('group', group)
    // Start - REVE
    const {
      groupBody: groupREVEBody
      // total: totalREVE
    } = createProfitLossTableBody(
      [
        {
          accountName: 'Laba/Rugi',
          credit: fixRevenue
        },
        {
          accountName: 'Tambah Akumulasi Penyusutan',
          credit: getTotal(group.DEPR)
        },
        {
          accountName: 'Tambah Hutang Usaha',
          credit: getTotal(group.APAY)
        },
        {
          accountName: 'Tambah Kewajiban Jangka Pendek',
          credit: getTotal(group.OCLY)
        },
        {
          accountName: 'Kurang Piutang Usaha',
          credit: getTotal(group.AREC)
        },
        {
          accountName: 'Kurang Persediaan',
          credit: getTotal(group.INTR)
        },
        {
          accountName: 'Kurang Aset Lancar Lainnya',
          credit: getTotal(group.OCAS)
        }
      ],
      { bodyTitle: 'PENDAPATAN', totalTitle: 'Jumlah Pendapatan' })
    const {
      groupBody: groupInvestmentBody
      // total: totalREVE
    } = createProfitLossTableBody(
      [
        {
          accountName: 'Kurang Aset Tetap',
          credit: getTotal(group.FASS)
        },
        {
          accountName: 'Kurang Aset Lainnya',
          credit: getTotal(group.OASS)
        }
      ],
      { bodyTitle: 'Investasi', totalTitle: 'Total Investasi' })
    const {
      groupBody: groupFinancingBody
      // total: totalFinancing
    } = createProfitLossTableBody(
      [
        {
          accountName: 'Tambah Kewajiban Jangka Panjang',
          credit: getTotal(group.LTLY)
        },
        {
          accountName: 'Tambah Modal',
          credit: getTotal(group.EQTY)
        }
      ],
      { bodyTitle: 'Pendanaan', totalTitle: 'Total Pendanaan' })
    tableBody.push(groupREVEBody)
    tableBody.push(groupInvestmentBody)
    tableBody.push(groupFinancingBody)
    // End - REVE
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
