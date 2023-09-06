/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { numberFormat } from 'utils'
import moment from 'moment'
import { createTableBodyBrowse, createTableBodyProfit } from './utils'

const { formatNumberIndonesia } = numberFormat

const Browse = ({ onGetDetail, from, to, compareFrom, compareTo, listTrans, listCompare, listProfit, listProfitCompare, ...browseProps }) => {
  let dataSource = []
  let groupBy = (xs, key) => {
    return xs
      .reduce((prev, next) => {
        (prev[next[key]] = prev[next[key]] || []).push(next)
        return prev
      }, {})
  }
  const groubedByTeam = groupBy(listTrans, 'accountType')
  const groubedByTeamCompare = groupBy(listCompare, 'accountType')
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
  const groupCompare = {
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
    ...groubedByTeamCompare
  }
  const groubedByTeamProfit = groupBy(listProfit, 'accountType')
  const groubedByTeamProfitCompare = groupBy(listProfitCompare, 'accountType')

  const groupProfit = {
    REVE: [],
    COGS: [],
    EXPS: [],
    OINC: [],
    OEXP: [],
    ...groubedByTeamProfit
  }

  const groupProfitCompare = {
    REVE: [],
    COGS: [],
    EXPS: [],
    OINC: [],
    OEXP: [],
    ...groubedByTeamProfitCompare
  }
  try {
    // Start - REVE
    const { total: totalREVE, totalCompare: totalCompareREVE } = createTableBodyProfit(groupProfit, { groupCompare: groupProfitCompare, type: 'REVE', bodyTitle: 'PENDAPATAN', totalTitle: 'Jumlah Pendapatan' })
    // End - REVE

    // Start - COGS
    const { total: totalCOGS, totalCompare: totalCompareCOGS } = createTableBodyProfit(groupProfit, { groupCompare: groupProfitCompare, type: 'COGS', bodyTitle: 'BEBAN POKOK PENJUALAN', totalTitle: 'Jumlah Beban Pokok Penjualan' })
    // End - COGS

    const labaKotor = totalREVE + totalCOGS
    const labaKotorCompare = totalCompareREVE + totalCompareCOGS

    // Start - EXPS
    const { total: totalEXPS, totalCompare: totalCompareEXPS } = createTableBodyProfit(groupProfit, {
      groupCompare: groupProfitCompare,
      type: 'EXPS',
      totalTitle: 'Jumlah Beban Operasional',
      bodyTitle: 'BEBAN OPERASIONAL'
    })
    // End - EXPS

    const operationalRevenue = labaKotor + totalEXPS
    const operationalRevenueCompare = labaKotorCompare + totalCompareEXPS

    // Start - OINC
    const { total: totalOINC, totalCompare: totalCompareOINC } = createTableBodyProfit(groupProfit, { groupCompare: groupProfitCompare, type: 'OINC', bodyTitle: 'PENDAPATAN NON OPERASIONAL', totalTitle: 'Jumlah Pendapatan Non Operasional' })
    // End - OINC

    // Start - OEXP
    const { total: totalOXPS, totalCompare: totalCompareOXPS } = createTableBodyProfit(groupProfit, {
      groupCompare: groupProfitCompare,
      type: 'OEXP',
      bodyTitle: 'BEBAN NON OPERASIONAL',
      totalTitle: 'Jumlah Beban Non Operasional'
    })
    // End - OEXP
    const nonOperationalRevenue = totalOINC + totalOXPS
    const nonOperationalRevenueCompare = totalCompareOINC + totalCompareOXPS
    const fixRevenue = operationalRevenue + nonOperationalRevenue
    const fixRevenueCompare = operationalRevenueCompare + nonOperationalRevenueCompare

    group.PRFT = group.PRFT.concat([
      {
        accountCode: 'SYSTEM',
        accountId: 31,
        accountName: 'Laba Belum Dialokasikan Tahun Ini',
        accountParentId: null,
        accountType: 'APAY',
        createdBy: 'SYSTEM',
        credit: 0,
        debit: fixRevenue - fixRevenueCompare,
        entryType: 'C',
        transactionType: 'PRFT'
      },
      {
        accountCode: 'SYSTEM',
        accountId: 31,
        accountName: 'Laba Belum Dialokasikan Tahun Lalu',
        accountParentId: null,
        accountType: 'APAY',
        createdBy: 'SYSTEM',
        credit: 0,
        debit: fixRevenueCompare,
        entryType: 'C',
        transactionType: 'PRFT'
      }
    ])

    groupCompare.PRFT = groupCompare.PRFT.concat([
      {
        accountCode: 'SYSTEM',
        accountId: 31,
        accountName: 'Laba Belum Dialokasikan Tahun Ini',
        accountParentId: null,
        accountType: 'APAY',
        createdBy: 'SYSTEM',
        credit: 0,
        debit: fixRevenueCompare,
        entryType: 'C',
        transactionType: 'PRFT'
      },
      {
        accountCode: 'SYSTEM',
        accountId: 31,
        accountName: 'Laba Belum Dialokasikan Tahun Lalu',
        accountParentId: null,
        accountType: 'APAY',
        createdBy: 'SYSTEM',
        credit: 0,
        debit: 0,
        entryType: 'C',
        transactionType: 'PRFT'
      }
    ])

    const { dataSource: groupBANKBody } = createTableBodyBrowse(
      group,
      groupCompare,
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
                  bodyTitle: 'Aset Tetap',
                  totalTitle: 'Jumlah Aset Tetap'
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
    dataSource = groupBANKBody
  } catch (e) {
    console.log(e)
  }

  let columns = [
    {
      title: 'Account',
      dataIndex: 'accountName',
      key: 'accountName',
      width: '175px'
    },
    {
      title: moment(to).format('ll'),
      dataIndex: 'value',
      key: 'value',
      width: '155px',
      render: text => formatNumberIndonesia(text)
    }
  ]

  if (compareTo && compareTo !== '') {
    columns = columns.concat([
      {
        title: moment(compareTo).format('ll'),
        dataIndex: 'compare',
        key: 'compare',
        width: '155px',
        render: text => formatNumberIndonesia(text)
      }
    ])
  }

  const onClickDetail = (record) => {
    onGetDetail(record)
  }

  console.log('dataSource', dataSource)

  return (
    <Table
      {...browseProps}
      dataSource={dataSource}
      bordered
      pagination={false}
      columns={columns}
      simple
      onRowClick={record => onClickDetail(record)}
      size="small"
    />
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
