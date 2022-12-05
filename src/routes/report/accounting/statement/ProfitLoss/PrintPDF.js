/**
 * Created by boo on 9/19/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'
import { numberFormat } from 'utils'
import { createTableBody } from './utils'

const { formatNumberIndonesia } = numberFormat

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
            text: 'LAPORAN LABA RUGI',
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
    REVE: [],
    COGS: [],
    EXPS: [],
    OINC: [],
    OEXP: [],
    ...groubedByTeam
  }
  try {
    // Start - REVE
    const { groupBody: groupREVEBody, total: totalREVE } = createTableBody(group, { type: 'REVE', bodyTitle: 'PENDAPATAN', totalTitle: 'Jumlah Pendapatan' })
    tableBody = tableBody.concat(groupREVEBody)
    // End - REVE

    // Start - COGS
    const { groupBody: groupCOGSBody, total: totalCOGS } = createTableBody(group, { type: 'COGS', bodyTitle: 'BEBAN POKOK PENJUALAN', totalTitle: 'Jumlah Beban Pokok Penjualan' })
    tableBody = tableBody.concat(groupCOGSBody)
    // End - COGS

    const labaKotor = totalREVE + totalCOGS
    tableBody = tableBody.concat([
      [
        { text: '', alignment: 'right', fontSize: 11 },
        { text: 'LABA KOTOR', style: 'tableSeparator', alignment: 'left', fontSize: 11 },
        { text: formatNumberIndonesia(labaKotor), style: 'tableSeparator', alignment: 'right', fontSize: 11 },
        { text: '', alignment: 'right', fontSize: 11 }
      ]
    ])

    // Start - EXPS
    const { groupBody: groupEXPSBody, total: totalEXPS } = createTableBody(group, {
      type: 'EXPS',
      totalTitle: 'Jumlah Beban Operasional',
      bodyTitle: 'BEBAN OPERASIONAL'
    })
    tableBody = tableBody.concat(groupEXPSBody)
    // End - EXPS

    const operationalRevenue = labaKotor + totalEXPS
    tableBody = tableBody.concat([
      [
        { text: '', alignment: 'right', fontSize: 11 },
        { text: 'PENDAPATAN OPERASIONAL', style: 'tableSeparator', alignment: 'left', fontSize: 11 },
        { text: formatNumberIndonesia(operationalRevenue), style: 'tableSeparator', alignment: 'right', fontSize: 11 },
        { text: '', alignment: 'right', fontSize: 11 }
      ]
    ])

    // Start - OINC
    const { groupBody: groupOINCBody, total: totalOINC } = createTableBody(group, { type: 'OINC', bodyTitle: 'PENDAPATAN NON OPERASIONAL', totalTitle: 'Jumlah Pendapatan Non Operasional' })
    tableBody = tableBody.concat(groupOINCBody)
    // End - OINC

    // Start - OEXP
    const { groupBody: groupOXPSBody, total: totalOXPS } = createTableBody(group, {
      type: 'OEXP',
      bodyTitle: 'BEBAN NON OPERASIONAL',
      totalTitle: 'Jumlah Beban Non Operasional'
    })
    tableBody = tableBody.concat(groupOXPSBody)
    // End - OEXP

    const nonOperationalRevenue = totalOINC + totalOXPS
    const fixRevenue = operationalRevenue + nonOperationalRevenue
    tableBody = tableBody.concat([
      [
        { text: '', alignment: 'right', fontSize: 11 },
        { text: 'Jumlah Pendapatan dan Beban Non Operasional', style: 'tableFooter', alignment: 'left', fontSize: 11 },
        { text: nonOperationalRevenue >= 0 ? formatNumberIndonesia(nonOperationalRevenue) : `(${formatNumberIndonesia(nonOperationalRevenue * -1)})`, style: 'tableFooter', alignment: 'right', fontSize: 11 },
        { text: '', alignment: 'right', fontSize: 11 }
      ],
      [
        { text: '', alignment: 'right', fontSize: 11 },
        { text: 'LABA BERSIH (SEBELUM PAJAK)', style: 'tableHeader', alignment: 'left', fontSize: 11 },
        { text: fixRevenue >= 0 ? formatNumberIndonesia(fixRevenue) : `(${formatNumberIndonesia(fixRevenue * -1)})`, style: 'tableHeader', alignment: 'right', fontSize: 11 },
        { text: '', alignment: 'right', fontSize: 11 }
      ],
      [
        { text: '', alignment: 'right', fontSize: 11 },
        { text: 'LABA BERSIH (SETELAH PAJAK)', style: 'tableFooter', alignment: 'left', fontSize: 11 },
        { text: fixRevenue >= 0 ? formatNumberIndonesia(fixRevenue) : `(${formatNumberIndonesia(fixRevenue * -1)})`, style: 'tableFooter', alignment: 'right', fontSize: 11 },
        { text: '', alignment: 'right', fontSize: 11 }
      ]
    ])
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
