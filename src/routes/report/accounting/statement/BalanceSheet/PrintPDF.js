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
      let total = item.debit ? (item.debit * -1) : item.credit || 0
      groupBody.push([
        { text: '', alignment: 'left', fontSize: 11 },
        { text: (item.accountName || '').toString(), margin: [depth, 0, 0, 0], alignment: 'left', fontSize: 11 },
        { text: total >= 0 ? formatNumberIndonesia(total) : `(${formatNumberIndonesia(total * -1)})`, alignment: 'right', fontSize: 11 },
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
        { text: total >= 0 ? formatNumberIndonesia(total) : `(${formatNumberIndonesia(total * -1)})`, style: 'tableFooter', alignment: 'right', fontSize: 11 },
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
        { text: total >= 0 ? formatNumberIndonesia(total) : `(${formatNumberIndonesia(total * -1)})`, style: 'tableFooter', alignment: 'right', fontSize: 11 },
        { text: '', alignment: 'left', fontSize: 11 }
      ])
      grandTotal += parseFloat(total || 0)
    }
  }

  return { data: groupBody, total: grandTotal }
}

const createTableBodyProfit = (tabledata, {
  type,
  bodyTitle,
  totalTitle
}) => {
  let groupBody = []
  const rows = tabledata[type]
  groupBody.push([
    { text: '', alignment: 'right', fontSize: 11 },
    { text: bodyTitle, style: 'tableHeader', alignment: 'left', fontSize: 11 },
    { text: '', alignment: 'right', fontSize: 11 },
    { text: '', alignment: 'right', fontSize: 11 }
  ])
  for (let key in rows) {
    if (rows.hasOwnProperty(key)) {
      let item = rows[key]
      let total = item.debit ? (item.debit * -1) : item.credit || 0
      let row = [
        { text: '', alignment: 'left', fontSize: 11 },
        { text: `${item.accountCode} - ${item.accountName}`, alignment: 'left', fontSize: 11 },
        { text: total >= 0 ? formatNumberIndonesia(total) : `(${formatNumberIndonesia(total * -1)})`, alignment: 'right', fontSize: 11 },
        { text: '', alignment: 'left', fontSize: 11 }
      ]
      groupBody.push(row)
    }
  }
  const total = rows.reduce((prev, next) => (prev - parseFloat(next.debit || 0)) + parseFloat(next.credit || 0), 0)
  groupBody.push([
    { text: '', alignment: 'left', fontSize: 11 },
    { text: totalTitle, style: 'tableFooter', alignment: 'left', fontSize: 11 },
    { text: total >= 0 ? formatNumberIndonesia(total) : `(${formatNumberIndonesia(total * -1)})`, style: 'tableFooter', alignment: 'right', fontSize: 11 },
    { text: '', alignment: 'left', fontSize: 11 }
  ])
  return { total, groupBody }
}

const PrintPDF = ({ user, listTrans, listProfit, storeInfo, to }) => {
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
            text: 'LAPORAN NERACA',
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
                text: `\nPERIODE: ${moment(to).format('DD-MMM-YYYY')}`,
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
    BANK: [],
    AREC: [],
    OCAS: [],

    FASS: [],
    DEPR: [],
    OASS: [],

    APAY: [],
    OCLY: [],
    LTLY: [],

    EQTY: [],
    PRFT: [],
    INTR: [],
    ...groubedByTeam
  }
  const groubedByTeamProfit = groupBy(listProfit, 'accountType')

  const groupProfit = {
    REVE: [],
    COGS: [],
    EXPS: [],
    OINC: [],
    OEXP: [],
    ...groubedByTeamProfit
  }
  try {
    // Start - REVE
    const { total: totalREVE } = createTableBodyProfit(groupProfit, { type: 'REVE', bodyTitle: 'PENDAPATAN', totalTitle: 'Jumlah Pendapatan' })
    // End - REVE

    // Start - COGS
    const { total: totalCOGS } = createTableBodyProfit(groupProfit, { type: 'COGS', bodyTitle: 'BEBAN POKOK PENJUALAN', totalTitle: 'Jumlah Beban Pokok Penjualan' })
    // End - COGS

    const labaKotor = totalREVE + totalCOGS

    // Start - EXPS
    const { total: totalEXPS } = createTableBodyProfit(groupProfit, {
      type: 'EXPS',
      totalTitle: 'Jumlah Beban Operasional',
      bodyTitle: 'BEBAN OPERASIONAL'
    })
    // End - EXPS

    const operationalRevenue = labaKotor + totalEXPS

    // Start - OINC
    const { total: totalOINC } = createTableBodyProfit(groupProfit, { type: 'OINC', bodyTitle: 'PENDAPATAN NON OPERASIONAL', totalTitle: 'Jumlah Pendapatan Non Operasional' })
    // End - OINC

    // Start - OEXP
    const { total: totalOXPS } = createTableBodyProfit(groupProfit, {
      type: 'OEXP',
      bodyTitle: 'BEBAN NON OPERASIONAL',
      totalTitle: 'Jumlah Beban Non Operasional'
    })
    // End - OEXP
    const nonOperationalRevenue = totalOINC + totalOXPS
    const fixRevenue = operationalRevenue + nonOperationalRevenue

    group.PRFT = [
      {
        accountCode: 'SYSTEM',
        accountId: 31,
        accountName: 'Laba Ditahan',
        accountParentId: null,
        accountType: 'APAY',
        createdBy: 'SYSTEM',
        credit: 0,
        debit: fixRevenue,
        entryType: 'C',
        transactionType: 'PRFT'
      }
    ]

    // const totalPersediaan = listRekap && listRekap.length ? listRekap.reduce((cnt, o) => cnt + parseFloat(o.amount), 0) : 0
    // group.INTR = [
    //   {
    //     accountCode: 'SYSTEM',
    //     accountId: 31,
    //     accountName: 'Persediaan Barang Dagang',
    //     accountParentId: null,
    //     accountType: 'INTR',
    //     createdBy: 'SYSTEM',
    //     credit: 0,
    //     debit: -1 * totalPersediaan,
    //     entryType: 'D',
    //     transactionType: 'INTR'
    //   }
    // ]

    const { data: groupBANKBody } = createTableBody(
      group,
      [
        {
          bodyTitle: 'ASET',
          totalTitle: 'Jumlah Aset',
          level: 0,
          child: [
            {
              bodyTitle: 'ASET LANCAR',
              level: 1,
              totalTitle: 'Jumlah Aset Lancar',
              child: [
                {
                  type: 'BANK',
                  level: 2,
                  bodyTitle: 'Kas dan Setara Kas',
                  totalTitle: 'Jumlah Kas dan Setara Kas'
                },
                {
                  type: 'AREC',
                  level: 2,
                  bodyTitle: 'Piutang Usaha',
                  totalTitle: 'Jumlah Piutang Usaha'
                },
                {
                  type: 'INTR',
                  level: 2,
                  bodyTitle: 'Persediaan',
                  totalTitle: 'Jumlah Persediaan'
                },
                {
                  type: 'OCAS',
                  level: 2,
                  bodyTitle: 'Aset Lancar Lainnya',
                  totalTitle: 'Jumlah Aset Lancar Lainnya'
                }
              ]
            },
            {
              bodyTitle: 'ASET TIDAK LANCAR',
              level: 1,
              totalTitle: 'Jumlah Aset Tidak Lancar',
              child: [
                {
                  type: 'FASS',
                  level: 2,
                  bodyTitle: 'Nilai Histori',
                  totalTitle: 'Jumlah Nilai Histori'
                },
                {
                  type: 'DEPR',
                  level: 2,
                  bodyTitle: 'Akumulasi Penyusutan',
                  totalTitle: 'Jumlah Akumulasi Penyusutan'
                }
              ]
            }
          ]
        },
        {
          bodyTitle: 'KEWAJIBAN DAN EKUITAS',
          totalTitle: 'Jumlah Kewajiban dan Ekuitas',
          level: 0,
          child: [
            {
              bodyTitle: 'KEWAJIBAN JANGKA PENDEK',
              level: 1,
              totalTitle: 'Jumlah Kewajiban Jangka Pendek',
              child: [
                {
                  type: 'APAY',
                  level: 2,
                  bodyTitle: 'Hutang Usaha',
                  totalTitle: 'Jumlah Hutang Usaha'
                },
                {
                  type: 'OCLY',
                  level: 2,
                  bodyTitle: 'Kewajiban Jangka Pendek Lainnya',
                  totalTitle: 'Jumlah Kewajiban Jangka Pendek Lainnya'
                }
              ]
            },
            {
              type: 'LTLY',
              level: 1,
              bodyTitle: 'Kewajiban Jangka Panjang',
              totalTitle: 'Jumlah Kewajiban Jangka Panjang'
            },
            {
              type: 'EQTY',
              level: 1,
              bodyTitle: 'Ekuitas',
              totalTitle: 'Jumlah Ekuitas'
            },
            {
              type: 'PRFT',
              level: 1,
              bodyTitle: 'Laba Ditahan',
              totalTitle: 'Jumlah Laba'
            }
          ]
        }
      ])
    tableBody = tableBody.concat(groupBANKBody)
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
