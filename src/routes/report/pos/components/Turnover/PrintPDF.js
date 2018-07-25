/**
 * Created by veirry on 28/11/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { RepeatReport } from 'components'
import { numberFormat } from 'utils'

const { formatNumberIndonesia } = numberFormat

const PrintPDF = ({ user, listTrans, storeInfo, fromDate, toDate }) => {
  // Declare Variable
  let allDppTotal = listTrans.reduce((cnt, o) => cnt + (o.DPP || 0), 0)
  let allCostPriceTotal = listTrans.reduce((cnt, o) => cnt + (o.costPrice || 0), 0)
  let allQtyTotal = listTrans.reduce((cnt, o) => cnt + (o.qty || 0), 0)
  let allCostPriceNextTotal = listTrans.reduce((cnt, o) => cnt + (o.costPriceNext || 0), 0)
  let allDppNextTotal = listTrans.reduce((cnt, o) => cnt + (o.DPPNext || 0), 0)
  let allQtyNextTotal = listTrans.reduce((cnt, o) => cnt + (o.qtyNext || 0), 0)
  // let allCostPriceNextEvoTotal = listTrans.reduce((cnt, o) => cnt + (o.costPriceNextEvo || 0), 0)
  // let allDppNextEvoTotal = listTrans.reduce((cnt, o) => cnt + (o.DPPNextEvo || 0), 0)
  // let allQtyNextEvoTotal = listTrans.reduce((cnt, o) => cnt + (o.qtyNextEvo || 0), 0)
  const width = []
  // Declare Function
  const createTableBody = (tabledata) => {
    const headers = [
      [
        { fontSize: 12, text: '', colSpan: 2, style: 'tableHeader', alignment: 'center' },
        {},
        { fontSize: 12, text: `PERIODE: ${moment(fromDate, 'M-YYYY').format('MMM-YYYY')}`, colSpan: 5, style: 'tableHeader', alignment: 'center' },
        {},
        {},
        {},
        {},
        {},
        { fontSize: 12, text: `PERIODE: ${moment(toDate, 'M-YYYY').format('MMM-YYYY')}`, colSpan: 6, style: 'tableHeader', alignment: 'center' },
        {},
        {},
        {},
        {},
        {}
      ],
      [
        { fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'CATEGORY', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'QTY', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'TURNOVER', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'MARGIN', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'WEIGHT (of total Turnover)', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'SOA / % KPI', style: 'tableHeader', alignment: 'center' },
        {},
        { fontSize: 12, text: 'QTY', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'EVO (%)', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'TURNOVER', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'EVO (%)', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'MARGIN', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'EVO (%)', style: 'tableHeader', alignment: 'center' }
      ]
    ]
    let body = headers
    const rows = tabledata
    let count = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = [
          { text: count, alignment: 'center', fontSize: 11 },
          { text: (data.categoryName || '').toString(), alignment: 'left', fontSize: 11 },
          { text: formatNumberIndonesia(data.qty || 0), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.DPP || 0), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.costPrice || 0), alignment: 'right', fontSize: 11 },
          { text: `${formatNumberIndonesia(100 - (((allDppTotal - data.DPP) / (allDppTotal > 0 ? allDppTotal : 1)) * 100) || 0)}%`, alignment: 'right', fontSize: 11 },
          { text: `${formatNumberIndonesia(100 - (((allQtyTotal - data.qty) / (allQtyTotal > 0 ? allQtyTotal : 1)) * 100) || 0)}%`, alignment: 'right', fontSize: 11 },
          {},
          { text: formatNumberIndonesia(data.qtyNext || 0), alignment: 'right', fontSize: 11 },
          { text: `${formatNumberIndonesia(data.qtyNextEvo || 0)}%`, alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.DPPNext || 0), alignment: 'right', fontSize: 11 },
          { text: `${formatNumberIndonesia(data.DPPNextEvo || 0)}%`, alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.costPriceNext || 0), alignment: 'right', fontSize: 11 },
          { text: `${formatNumberIndonesia(data.costPriceNextEvo || 0)}%`, alignment: 'right', fontSize: 11 }
        ]
        body.push(row)
      }
      count += 1
    }
    let weightTotal = (rows || {}).reduce((cnt, o) => cnt + ((100 - (((allDppTotal - o.DPP) / allDppTotal) * 100)) || 0), 0)
    let soaTotal = (rows || {}).reduce((cnt, o) => cnt + ((100 - (((allQtyTotal - o.qty) / allQtyTotal) * 100)) || 0), 0)
    let dppTotal = (rows || {}).reduce((cnt, o) => cnt + (o.DPP || 0), 0)
    let costPriceTotal = (rows || {}).reduce((cnt, o) => cnt + (o.costPrice || 0), 0)
    let qtyTotal = (rows || {}).reduce((cnt, o) => cnt + (o.qty || 0), 0)
    let costPriceNextTotal = (rows || {}).reduce((cnt, o) => cnt + (o.costPriceNext || 0), 0)
    let dppNextTotal = (rows || {}).reduce((cnt, o) => cnt + (o.DPPNext || 0), 0)
    let qtyNextTotal = (rows || {}).reduce((cnt, o) => cnt + (o.qtyNext || 0), 0)
    // let costPriceNextEvoTotal = (rows || {}).reduce((cnt, o) => cnt + (o.costPriceNextEvo || 0), 0)
    // let dppNextEvoTotal = (rows || {}).reduce((cnt, o) => cnt + (o.DPPNextEvo || 0), 0)
    // let qtyNextEvoTotal = (rows || {}).reduce((cnt, o) => cnt + (o.qtyNextEvo || 0), 0)
    const tableFooter = [
      { text: 'TOTAL', colSpan: 2, alignment: 'center', fontSize: 12 },
      {},
      { text: formatNumberIndonesia(qtyTotal), alignment: 'right', fontSize: 12 },
      { text: formatNumberIndonesia(dppTotal), alignment: 'right', fontSize: 12 },
      { text: formatNumberIndonesia(costPriceTotal), alignment: 'right', fontSize: 12 },
      { text: `${formatNumberIndonesia(weightTotal)} %`, alignment: 'right', fontSize: 12 },
      { text: `${formatNumberIndonesia(soaTotal)} %`, alignment: 'right', fontSize: 12 },
      {},
      { text: formatNumberIndonesia(qtyNextTotal), alignment: 'right', fontSize: 12 },
      { text: `${formatNumberIndonesia(qtyNextTotal !== 0 ? (((qtyTotal - qtyNextTotal) / (qtyNextTotal > 0 ? qtyNextTotal : 1)) * 100) : 0)} %`, alignment: 'right', fontSize: 12 },
      { text: formatNumberIndonesia(dppNextTotal), alignment: 'right', fontSize: 12 },
      { text: `${formatNumberIndonesia(dppNextTotal !== 0 ? (((dppTotal - dppNextTotal) / (dppNextTotal > 0 ? dppNextTotal : 1)) * 100) : 0)} %`, alignment: 'right', fontSize: 12 },
      { text: formatNumberIndonesia(costPriceNextTotal), alignment: 'right', fontSize: 12 },
      { text: `${formatNumberIndonesia(costPriceNextTotal !== 0 ? ((costPriceTotal - costPriceNextTotal) / (costPriceNextTotal > 0 ? costPriceNextTotal : 1)) * 100 : 0)} %`, alignment: 'right', fontSize: 12 }
    ]
    body.push(tableFooter)
    width.push([
      '3%', // no
      '10%', // category
      '5%', // qty
      '9%', // turnover
      '9%', // margin
      '9%', // weight
      '9%', // soa
      '1%',
      '5%', // qty
      '7%', // evo
      '9%', // turnover
      '7%', // evo
      '9%', // margin
      '7%' // evo
    ])
    return body
  }

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
            text: 'LAPORAN PRODUCT & SERVICE (COMPARE)',
            style: 'header',
            fontSize: 18,
            alignment: 'center'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1080, y2: 5, lineWidth: 0.5 }]
          },
          {
            columns: [
              {
                text: `\nPERIODE: ${moment(fromDate, 'M-YYYY').format('MMM-YYYY')}  TO  ${moment(toDate, 'M-YYYY').format('MMM-YYYY')}`,
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
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1080, y2: 5, lineWidth: 0.5 }]
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
  let groupBy = (xs, key) => {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x)
      return rv
    }, {})
  }
  let groubedByTeam = groupBy(listTrans, 'sort')
  let arr = Object.keys(groubedByTeam).map(index => groubedByTeam[index])
  const getTableBody = (data) => {
    let body = []
    for (let i = 0; i < data.length; i += 1) {
      body.push(createTableBody(data[i]))
    }
    const extra = [
      [
        { fontSize: 12, text: 'GRAND TOTAL', colSpan: 2, style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: formatNumberIndonesia(allQtyTotal || 0), style: 'tableHeader', alignment: 'right' },
        { fontSize: 12, text: formatNumberIndonesia(allDppTotal || 0), style: 'tableHeader', alignment: 'right' },
        { fontSize: 12, text: formatNumberIndonesia(allCostPriceTotal || 0), style: 'tableHeader', alignment: 'right' },
        { fontSize: 12, text: '100 %', style: 'tableHeader', alignment: 'right' },
        { fontSize: 12, text: '100 %', style: 'tableHeader', alignment: 'right' },
        {},
        { fontSize: 12, text: formatNumberIndonesia(allQtyNextTotal || 0), style: 'tableHeader', alignment: 'right' },
        { fontSize: 12, text: `${formatNumberIndonesia(allQtyNextTotal !== 0 ? (((allQtyTotal - allQtyNextTotal) / (allQtyNextTotal > 0 ? allQtyNextTotal : 1)) * 100) : 0)} %`, style: 'tableHeader', alignment: 'right' },
        { fontSize: 12, text: formatNumberIndonesia(allDppNextTotal || 0), style: 'tableHeader', alignment: 'right' },
        { fontSize: 12, text: `${formatNumberIndonesia(allDppNextTotal !== 0 ? (((allDppTotal - allDppNextTotal) / (allDppNextTotal > 0 ? allDppNextTotal : 1)) * 100) : 0)} %`, style: 'tableHeader', alignment: 'right' },
        { fontSize: 12, text: formatNumberIndonesia(allCostPriceNextTotal || 0), style: 'tableHeader', alignment: 'right' },
        { fontSize: 12, text: `${formatNumberIndonesia(allCostPriceNextTotal !== 0 ? (((allCostPriceTotal - allCostPriceNextTotal) / (allCostPriceNextTotal > 0 ? allCostPriceNextTotal : 1)) * 100) : 0)} %`, style: 'tableHeader', alignment: 'right' }
      ]
    ]
    body.push(extra)
    width.push([
      '3%', // no
      '10%', // category
      '5%', // qty
      '9%', // turnover
      '9%', // margin
      '9%', // weight
      '9%', // soa
      '1%',
      '5%', // qty
      '7%', // evo
      '9%', // turnover
      '7%', // evo
      '9%', // margin
      '7%' // evo
    ])
    return body
  }

  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    width,
    pageMargins: [50, 130, 50, 60],
    pageSize: 'A3',
    tableMargin: [0, 8],
    pageOrientation: 'landscape',
    tableStyle: styles,
    layout: 'noBorder',
    tableBody: arr.length ? getTableBody(arr) : [],
    data: listTrans,
    header,
    footer
  }

  return (
    <RepeatReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  listTrans: PropTypes.array,
  user: PropTypes.object,
  storeInfo: PropTypes.object.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired
}

export default PrintPDF
