/**
 * Created by veirry on 28/11/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { numberFormat } from 'utils'
import { BasicReport } from 'components'
import { getDistPriceName } from 'utils/string'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const PrintPDF = ({ activeKey, user, listRekap, storeInfo, period, year }) => {
  // Declare Function
  const createTableBody = (tabledata) => {
    let body = []
    const rows = tabledata
    let count = 1
    for (let key = 0; key < rows.length; key += 1) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = [
          { text: count, alignment: 'center', fontSize: 11 },
          { text: (data.productCode || '').toString(), alignment: 'left', fontSize: 11 },
          { text: (data.productName || '').toString(), alignment: 'left', fontSize: 11 },
          { text: formatNumberIndonesia(data.sellPrice), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.distPrice01), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.distPrice02), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.distPrice03), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(parseFloat(data.amount)), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.count), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.costPrice), alignment: 'right', fontSize: 11 }
        ]
        body.push(row)
      }
      count += 1
    }
    return body
  }

  // Declare Variable
  let count = listRekap.reduce((cnt, o) => cnt + parseFloat(o.count), 0)
  let amount = listRekap.reduce((cnt, o) => cnt + (parseFloat(o.costPrice) * parseFloat(o.count)), 0)

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
            text: activeKey === '0' ? 'LAPORAN REKAP FIFO' : 'LAPORAN SISA SALDO STOCK',
            style: 'header',
            fontSize: 18,
            alignment: 'center'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1550, y2: 5, lineWidth: 0.5 }]
          },
          {
            columns: [
              {
                text: `\nPERIODE: ${moment(period, 'MM').format('MMMM').concat('-', year)}`,
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
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1550, y2: 5, lineWidth: 0.5 }]
        },
        {
          columns: [
            {
              text: `Tanggal cetak: ${moment().format('LLLL')}`,
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

  let tableHeader = [
    [
      { fontSize: 12, text: 'NO', alignment: 'center' },
      { fontSize: 12, text: 'KODE PRODUK', alignment: 'center' },
      { fontSize: 12, text: 'NAMA PRODUK', alignment: 'center' },
      { fontSize: 12, text: getDistPriceName('sellPrice'), alignment: 'center' },
      { fontSize: 12, text: getDistPriceName('distPrice01'), alignment: 'center' },
      { fontSize: 12, text: getDistPriceName('distPrice02'), alignment: 'center' },
      { fontSize: 12, text: getDistPriceName('distPrice03'), alignment: 'center' },
      { fontSize: 12, text: 'HPP (MASTER)', alignment: 'center' },
      { fontSize: 12, text: 'SALDO', alignment: 'center' },
      { fontSize: 12, text: 'JUMLAH', alignment: 'center' }
    ]
  ]

  let tableBody = []
  try {
    tableBody = createTableBody(listRekap)
  } catch (e) {
    console.log(e)
  }

  let tableFooter = [
    [
      { text: 'Total', colSpan: 4, alignment: 'center', fontSize: 12 },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      { text: formatNumberIndonesia(count), alignment: 'right', fontSize: 12 },
      { text: formatNumberIndonesia(amount), alignment: 'right', fontSize: 12 }
    ]
  ]

  let widths = [
    '5%',
    '12%',
    '12%',
    '10%',
    '10%',
    '10%',
    '10%',
    '10%',
    '10%',
    '10%',
    '10%'
  ]

  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    width: widths,
    pageMargins: [50, 130, 50, 60],
    pageSize: { width: 1165, height: 1650 },
    pageOrientation: 'landscape',
    tableStyle: styles,
    layout: 'noBorder',
    tableHeader,
    tableBody,
    tableFooter,
    data: listRekap,
    header,
    footer
  }

  return (
    <BasicReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  listRekap: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  period: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  storeInfo: PropTypes.object
}

export default PrintPDF
