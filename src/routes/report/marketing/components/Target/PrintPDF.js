/**
 * Created by boo on 9/19/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'
import { numberFormat } from 'utils'

const { formatNumberIndonesia } = numberFormat

const PrintPDF = ({ user, listTrans, storeInfo, fromDate, toDate, from = moment(fromDate, 'M').format('MMMM'), to = moment(toDate, 'M').format('MMMM') }) => {
  // Declare Function
  const createTableBody = (tabledata) => {
    let body = []
    const rows = tabledata
    let count = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        const dataTotal = data.report
        const dataFrom = dataTotal.filter(x => Number(x.period) === Number(fromDate))[0] || {}
        const dataTo = dataTotal.filter(x => Number(x.period) === Number(toDate))[0] || {}
        const filterDataLatest = dataTotal.filter(x => Number(x.period) <= Number(toDate))

        const dataLatest = filterDataLatest[filterDataLatest.length - 1] || {}

        const costDataFrom = data.costFrom.reduce((prev, next) => prev + next.posPrice, 0)
        const costDataTo = data.costTo.reduce((prev, next) => prev + next.posPrice, 0)

        const gpmFrom = ((dataFrom.netto - costDataFrom) / dataFrom.netto) * 100
        const gpmTo = ((dataTo.netto - costDataTo) / dataTo.netto) * 100

        const row = [
          { text: count, style: 'tableDataCount' },
          { text: data.categoryName, style: 'tableData' },

          { text: formatNumberIndonesia(dataLatest.currentTotalUnitEntry / Number(toDate)), style: 'tableDataNumber' },
          { text: formatNumberIndonesia(dataFrom.unitEntry), style: 'tableDataNumber' },
          { text: formatNumberIndonesia(dataTo.unitEntry), style: 'tableDataNumber' },

          { text: formatNumberIndonesia(dataLatest.currentTotalQty / Number(toDate)), style: 'tableDataNumber' },
          { text: formatNumberIndonesia(dataFrom.qty), style: 'tableDataNumber' },
          { text: formatNumberIndonesia(dataTo.qty), style: 'tableDataNumber' },

          { text: formatNumberIndonesia(dataLatest.currentTotalPrice / Number(toDate)), style: 'tableDataNumber' },
          { text: formatNumberIndonesia(dataFrom.netto), style: 'tableDataNumber' },
          { text: formatNumberIndonesia(dataTo.netto), style: 'tableDataNumber' },

          { text: '-', style: 'tableDataNumber' },
          { text: `${formatNumberIndonesia(gpmFrom)} ${gpmFrom ? '%' : ''}`, style: 'tableDataNumber' },
          { text: `${formatNumberIndonesia(gpmTo)} ${gpmTo ? '%' : ''}`, style: 'tableDataNumber' }
          // { text: formatNumberIndonesia(costDataFrom), style: 'tableDataNumber' },
          // { text: formatNumberIndonesia(costDataTo), style: 'tableDataNumber' }
        ]
        body.push(row)
      }
      count += 1
    }
    return body
  }

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
    tableData: {
      alignment: 'left', fontSize: 11
    },
    tableDataCount: {
      alignment: 'center',
      fontSize: 11
    },
    tableDataNumber: {
      alignment: 'right',
      fontSize: 11
    },
    tableHeader: {
      bold: true,
      alignment: 'center',
      fontSize: 12,
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
            text: 'LAPORAN TARGET PENJUALAN',
            style: 'header',
            fontSize: 18,
            alignment: 'center'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1330, y2: 5, lineWidth: 0.5 }]
          },
          {
            columns: [
              {
                text: `\nPERIODE: ${from} TO ${to}`,
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
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1330, y2: 5, lineWidth: 0.5 }]
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

  const tableHeader = [
    [
      { text: 'NO', rowSpan: 2, style: 'tableHeader' },
      { text: 'CATEGORY/BRAND', rowSpan: 2, style: 'tableHeader' },
      { text: 'UNIT ENTRY', colSpan: 3, style: 'tableHeader' },
      { text: '', style: 'tableHeader' },
      { text: '', style: 'tableHeader' },
      { text: 'QTY', colSpan: 3, style: 'tableHeader' },
      { text: '', style: 'tableHeader' },
      { text: '', style: 'tableHeader' },
      { text: 'SALES', colSpan: 3, style: 'tableHeader' },
      { text: '', style: 'tableHeader' },
      { text: '', style: 'tableHeader' },
      { text: 'GPM (%)', colSpan: 3, style: 'tableHeader' },
      { text: '', style: 'tableHeader' },
      { text: '', style: 'tableHeader' }
    ],
    [
      { text: '', style: 'tableHeader' },
      { text: '', style: 'tableHeader' },
      { text: 'YTD AVG', style: 'tableHeader' },
      { text: from, style: 'tableHeader' },
      { text: to, style: 'tableHeader' },
      { text: 'YTD AVG', style: 'tableHeader' },
      { text: from, style: 'tableHeader' },
      { text: to, style: 'tableHeader' },
      { text: 'YTD AVG', style: 'tableHeader' },
      { text: from, style: 'tableHeader' },
      { text: to, style: 'tableHeader' },
      { text: 'YTD AVG', style: 'tableHeader' },
      { text: from, style: 'tableHeader' },
      { text: to, style: 'tableHeader' }
    ]
  ]

  let tableBody = []
  try {
    tableBody = createTableBody(listTrans)
  } catch (e) {
    console.log(e)
  }

  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    width: ['5%',
      '11%',
      '7%',
      '7%',
      '7%',
      '7%',
      '7%',
      '7%',
      '7%',
      '7%',
      '7%',
      '7%',
      '7%',
      '7%'
    ],
    pageMargins: [50, 130, 50, 60],
    pageSize: { width: 842, height: 1430 },
    pageOrientation: 'landscape',
    tableStyle: styles,
    layout: 'noBorder',
    tableHeader,
    tableBody,
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
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired
}

export default PrintPDF
