/**
 * Created by boo on 9/19/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'
import { numberFormat } from 'utils'

const { formatNumberIndonesia } = numberFormat

const createTableBody = (tabledata, bodyStruct) => {
  let groupBody = []
  let grandTotal = 0
  for (let key in bodyStruct) {
    const item = bodyStruct[key]
    const depth = 15 * (item.level != null ? item.level : 3)
    if (item.accountName) {
      groupBody.push([
        { text: '', alignment: 'left', fontSize: 11 },
        { text: (item.accountName || '').toString(), margin: [depth, 0, 0, 0], alignment: 'left', fontSize: 11 },
        { text: formatNumberIndonesia(parseFloat(item.debit ? (item.debit * -1) : item.credit || 0)), alignment: 'right', fontSize: 11 },
        { text: '', alignment: 'left', fontSize: 11 }
      ])
    } else {
      groupBody.push([
        { text: '', alignment: 'left', fontSize: 11 },
        { text: (item.bodyTitle || '').toString(), margin: [depth, 0, 0, 0], style: 'tableHeader', alignment: 'left', fontSize: 11 },
        { text: '', alignment: 'right', fontSize: 11 },
        { text: '', alignment: 'left', fontSize: 11 }
      ])
    }
    if (item.child) {
      const { data, total } = createTableBody(tabledata, item.child)
      groupBody = groupBody.concat(data)
      groupBody.push([
        { text: '', alignment: 'left', fontSize: 11 },
        { text: (item.totalTitle || '').toString(), style: 'tableFooter', margin: [depth, 0, 0, 0], alignment: 'left', fontSize: 11 },
        { text: formatNumberIndonesia(total), style: 'tableFooter', alignment: 'right', fontSize: 11 },
        { text: '', alignment: 'left', fontSize: 11 }
      ])
      grandTotal += total
    }
    if (item.type) {
      const accountData = tabledata[item.type]
      const total = accountData.reduce((prev, next) => (prev - parseFloat(next.debit || 0)) + parseFloat(next.credit || 0), 0)
      const { data } = createTableBody(tabledata, accountData)
      groupBody = groupBody.concat(data)
      groupBody.push([
        { text: '', alignment: 'left', fontSize: 11 },
        { text: (item.totalTitle || '').toString(), style: 'tableFooter', margin: [depth, 0, 0, 0], alignment: 'left', fontSize: 11 },
        { text: formatNumberIndonesia(total), style: 'tableFooter', alignment: 'right', fontSize: 11 },
        { text: '', alignment: 'left', fontSize: 11 }
      ])
      grandTotal += parseFloat(total || 0)
    }
  }

  return { data: groupBody, total: grandTotal }
}

const createProfitLossTableBody = (tabledata, {
  bodyTitle,
  totalTitle
}) => {
  let groupBody = []
  const rows = tabledata
  groupBody.push([
    { text: '', alignment: 'right', fontSize: 11 },
    { text: bodyTitle, style: 'tableHeader', alignment: 'left', fontSize: 11 },
    { text: '', alignment: 'right', fontSize: 11 },
    { text: '', alignment: 'right', fontSize: 11 }
  ])
  for (let key in rows) {
    if (rows.hasOwnProperty(key)) {
      let item = rows[key]
      let row = [
        { text: '', alignment: 'left', fontSize: 11 },
        { text: (item.accountName || '').toString(), alignment: 'left', fontSize: 11 },
        { text: formatNumberIndonesia(parseFloat(item.debit ? (item.debit * -1) : item.credit || 0)), alignment: 'right', fontSize: 11 },
        { text: '', alignment: 'left', fontSize: 11 }
      ]
      groupBody.push(row)
    }
  }
  const total = rows.reduce((prev, next) => (prev - parseFloat(next.debit || 0)) + parseFloat(next.credit || 0), 0)
  groupBody.push([
    { text: '', alignment: 'left', fontSize: 11 },
    { text: totalTitle, style: 'tableFooter', alignment: 'left', fontSize: 11 },
    { text: formatNumberIndonesia(total), style: 'tableFooter', alignment: 'right', fontSize: 11 },
    { text: '', alignment: 'left', fontSize: 11 }
  ])
  return { total, groupBody }
}

const getTotal = (data = []) => {
  if (!data) return 0
  return data.reduce((prev, next) => prev + parseFloat(next.debit ? (next.debit * -1) : next.credit || 0), 0)
}

const PrintPDF = ({ user, listTrans, storeInfo, from, to }) => {
  // Declare Variable
  const styles = {
    header: {
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 10]
    },
    subheader: {
      fontSize: 16,
      bold: true,
      margin: [0, 10, 0, 5]
    },
    tableExample: {
      margin: [0, 5, 0, 15]
    },
    tableHeader: {
      bold: true,
      fontSize: 13,
      color: 'black'
    },
    tableFooter: {
      bold: true,
      fontSize: 13,
      color: 'black',
      margin: [0, 0, 0, 15]
    },
    tableBody: {
      fontSize: 13,
      color: 'black',
      margin: [0, 15, 0, 15]
    },
    tableSeparator: {
      bold: true,
      fontSize: 13,
      color: 'black',
      margin: [0, 15, 0, 15]
    }
  }

  const header = {
    stack: [
      {
        stack: [
          {
            stack: storeInfo.stackHeader01
          },
          {
            text: 'LAPORAN ARUS KAS',
            style: 'header',
            fontSize: 18,
            alignment: 'center'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 740, y2: 5, lineWidth: 0.5 }]
          },
          {
            columns: [
              {
                text: `\nPERIODE: ${moment(from).format('DD-MMM-YYYY')}  TO  ${moment(to).format('DD-MMM-YYYY')}`,
                fontSize: 12,
                alignment: 'left'
              },
              {
                text: '',
                fontSize: 12,
                alignment: 'center'
              },
              {
                text: '',
                fontSize: 12,
                alignment: 'right'
              }
            ]
          }
        ]
      }
    ],
    margin: [50, 12, 50, 30]
  }
  const footer = (currentPage, pageCount) => {
    return {
      margin: [50, 30, 50, 0],
      stack: [
        {
          canvas: [{ type: 'line', x1: 0, y1: -8, x2: 740, y2: -8, lineWidth: 0.5 }]
        },
        {
          columns: [
            {
              text: `Tanggal cetak: ${moment().format('DD-MMM-YYYY HH:mm:ss')}`,
              margin: [0, 0, 0, 0],
              fontSize: 9,
              alignment: 'left'
            },
            {
              text: `Dicetak oleh: ${user.username}`,
              margin: [0, 0, 0, 0],
              fontSize: 9,
              alignment: 'center'
            },
            {
              text: `Halaman: ${(currentPage || 0).toString()} dari ${pageCount}`,
              fontSize: 9,
              margin: [0, 0, 0, 0],
              alignment: 'right'
            }
          ]
        }
      ]
    }
  }
  let tableBody = []
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
  try {
    const fixRevenue = listTrans.filter(filtered => filtered.accountType === 'REVE'
      || filtered.accountType === 'COGS'
      || filtered.accountType === 'EXPS'
      || filtered.accountType === 'OINC'
      || filtered.accountType === 'OEXP')
      .reduce((prev, next) => (prev - parseFloat(next.debit || 0)) + parseFloat(next.credit || 0), 0)
    const {
      groupBody: groupOperationBody
      // total: totalOperation
    }
      = createProfitLossTableBody(
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
        { bodyTitle: 'Aktifitas Operasi', totalTitle: 'Total Aktifitas Operasi' })

    const {
      groupBody: groupInvestmentBody
      // total: totalInvestment
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
    tableBody = tableBody.concat(groupOperationBody)
    tableBody = tableBody.concat(groupInvestmentBody)
    tableBody = tableBody.concat(groupFinancingBody)
  } catch (e) {
    console.log(e)
  }

  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    width: ['20%', '30%', '20%', '30%'],
    pageMargins: [50, 130, 50, 60],
    pageSize: 'A4',
    pageOrientation: 'landscape',
    tableStyle: styles,
    layout: 'noBorders',
    tableHeader: [],
    tableBody,
    tableFooter: [],
    data: listTrans,
    header,
    footer
  }

  return (
    <BasicReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  listTrans: PropTypes.array,
  user: PropTypes.object,
  storeInfo: PropTypes.object.isRequired,
  from: PropTypes.string.isRequired,
  to: PropTypes.string
}

export default PrintPDF
