/**
 * Created by Veirry on 17/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { numberFormat } from 'utils'
import moment from 'moment'
import { createTableBody } from './utils'

const { formatNumberIndonesia } = numberFormat

const Browse = ({ from, to, compareFrom, compareTo, listTrans, listCompare, ...browseProps }) => {
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
    REVE: [],
    COGS: [],
    EXPS: [],
    OINC: [],
    OEXP: [],
    ...groubedByTeam
  }
  const groupCompare = {
    REVE: [],
    COGS: [],
    EXPS: [],
    OINC: [],
    OEXP: [],
    ...groubedByTeamCompare
  }
  try {
    // Start - REVE
    const { dataSource: dataREVESource, total: totalREVE, totalCompare: totalCompareREVE } = createTableBody(group, { groupCompare, type: 'REVE', bodyTitle: 'PENDAPATAN', totalTitle: 'Jumlah Pendapatan' })
    // End - REVE
    dataSource = dataSource.concat(dataREVESource)

    // Start - COGS
    const { dataSource: dataCOGSBody, total: totalCOGS, totalCompare: totalCompareCOGS } = createTableBody(group, { groupCompare, type: 'COGS', bodyTitle: 'BEBAN POKOK PENJUALAN', totalTitle: 'Jumlah Beban Pokok Penjualan' })
    dataSource = dataSource.concat(dataCOGSBody)
    // End - COGS

    const labaKotor = totalREVE + totalCOGS
    const labaKotorCompare = totalCompareREVE + totalCompareCOGS
    dataSource = dataSource.concat([
      {
        key: 'LABA KOTOR',
        accountName: 'LABA KOTOR',
        value: formatNumberIndonesia(labaKotor),
        compare: formatNumberIndonesia(labaKotorCompare)
      }
    ])

    // Start - EXPS
    const { dataSource: dataEXPSBody, total: totalEXPS, totalCompare: totalCompareEXPS } = createTableBody(group, {
      groupCompare,
      type: 'EXPS',
      totalTitle: 'Jumlah Beban Operasional',
      bodyTitle: 'BEBAN OPERASIONAL'
    })
    dataSource = dataSource.concat(dataEXPSBody)
    // End - EXPS

    const operationalRevenue = labaKotor + totalEXPS
    const operationalRevenueCompare = labaKotorCompare + totalCompareEXPS
    dataSource = dataSource.concat([
      {
        key: 'PENDAPATAN OPERASIONAL',
        accountName: 'PENDAPATAN OPERASIONAL',
        value: formatNumberIndonesia(operationalRevenue),
        compare: formatNumberIndonesia(operationalRevenueCompare)
      }
    ])

    // Start - OINC
    const { dataSource: dataOINCBody, total: totalOINC, totalCompare: totalCompareOINC } = createTableBody(group, { groupCompare, type: 'OINC', bodyTitle: 'PENDAPATAN NON OPERASIONAL', totalTitle: 'Jumlah Pendapatan Non Operasional' })
    dataSource = dataSource.concat(dataOINCBody)
    // End - OINC

    // Start - OEXP
    const { dataSource: dataOXPSBody, total: totalOXPS, totalCompare: totalCompareOXPS } = createTableBody(group, {
      groupCompare,
      type: 'OEXP',
      bodyTitle: 'BEBAN NON OPERASIONAL',
      totalTitle: 'Jumlah Beban Non Operasional'
    })
    dataSource = dataSource.concat(dataOXPSBody)
    // End - OEXP

    const nonOperationalRevenue = totalOINC + totalOXPS
    const nonOperationalRevenueCompare = totalCompareOINC + totalCompareOXPS
    const fixRevenue = operationalRevenue + nonOperationalRevenue
    const fixRevenueCompare = operationalRevenueCompare + nonOperationalRevenueCompare
    dataSource = dataSource.concat([
      {
        key: 'Jumlah Pendapatan dan Beban Non Operasional',
        accountName: 'Jumlah Pendapatan dan Beban Non Operasional',
        value: nonOperationalRevenue >= 0 ? formatNumberIndonesia(nonOperationalRevenue) : `(${formatNumberIndonesia(nonOperationalRevenue * -1)})`,
        compare: nonOperationalRevenueCompare >= 0 ? formatNumberIndonesia(nonOperationalRevenueCompare) : `(${formatNumberIndonesia(nonOperationalRevenueCompare * -1)})`
      },
      {
        key: 'LABA BERSIH (SEBELUM PAJAK)',
        accountName: 'LABA BERSIH (SEBELUM PAJAK)',
        value: fixRevenue >= 0 ? formatNumberIndonesia(fixRevenue) : `(${formatNumberIndonesia(fixRevenue * -1)})`,
        compare: fixRevenueCompare >= 0 ? formatNumberIndonesia(fixRevenueCompare) : `(${formatNumberIndonesia(fixRevenueCompare * -1)})`
      },
      {
        key: 'LABA BERSIH (SETELAH PAJAK)',
        accountName: 'LABA BERSIH (SETELAH PAJAK)',
        value: fixRevenue >= 0 ? formatNumberIndonesia(fixRevenue) : `(${formatNumberIndonesia(fixRevenue * -1)})`,
        compare: fixRevenueCompare >= 0 ? formatNumberIndonesia(fixRevenueCompare) : `(${formatNumberIndonesia(fixRevenueCompare * -1)})`
      }
    ])
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
      title: `${moment(from).format('ll')} - ${moment(to).format('ll')}`,
      dataIndex: 'value',
      key: 'value',
      width: '155px',
      render: text => formatNumberIndonesia(text)
    }
  ]

  if (compareFrom && compareTo && compareFrom !== '' && compareTo !== '') {
    columns = columns.concat([
      {
        title: `${moment(compareFrom).format('ll')} - ${moment(compareTo).format('ll')}`,
        dataIndex: 'compare',
        key: 'compare',
        width: '155px',
        render: text => formatNumberIndonesia(text)
      }
    ])
  }

  return (
    <Table
      {...browseProps}
      dataSource={dataSource}
      pagination={false}
      bordered
      columns={columns}
      simple
      size="small"
    />
  )
}

Browse.propTypes = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func
}

export default Browse
