import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { numberFormat } from 'utils'
import { BasicReport } from 'components'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const PrintPDF = ({ user, listDaily, storeInfo, fromDate, toDate, category, brand }) => {
  // Declare Function
  const createTableBody = (tabledata) => {
    let body = []
    const rows = tabledata
    let count = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = []
        row.push({ text: count, alignment: 'center', fontSize: 11 })
        row.push({ text: (data.productCode || '').toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: (data.productName || '').toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: (data.qty || '').toString(), alignment: 'right', fontSize: 11 })
        row.push({ text: formatNumberIndonesia(data.total), alignment: 'right', fontSize: 11 })
        row.push({ text: formatNumberIndonesia(parseFloat(data.totalDiscount)), alignment: 'right', fontSize: 11 })
        row.push({ text: formatNumberIndonesia(parseFloat(data.DPP)), alignment: 'right', fontSize: 11 })
        row.push({ text: formatNumberIndonesia(parseFloat(data.PPN)), alignment: 'right', fontSize: 11 })
        row.push({ text: formatNumberIndonesia(parseFloat(data.netto)), alignment: 'right', fontSize: 11 })
        body.push(row)
      }
      count += 1
    }
    return body
  }

  // Declare Variable
  let qtyTotal = 0
  let grandTotal = 0
  let discountTotal = 0
  let dppTotal = 0
  let ppnTotal = 0
  let nettoTotal = 0
  if (listDaily.length > 0) {
    qtyTotal = listDaily.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
    grandTotal = listDaily.reduce((cnt, o) => cnt + parseFloat(o.total), 0)
    discountTotal = listDaily.reduce((cnt, o) => cnt + parseFloat(o.totalDiscount), 0)
    dppTotal = listDaily.reduce((cnt, o) => cnt + parseFloat(o.DPP), 0)
    ppnTotal = listDaily.reduce((cnt, o) => cnt + parseFloat(o.PPN), 0)
    nettoTotal = listDaily.reduce((cnt, o) => cnt + parseFloat(o.netto), 0)
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
            text: 'LAPORAN REKAP PENJUALAN',
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
                text: `\nPERIODE: ${moment(fromDate).format('DD-MMM-YYYY')}  TO  ${moment(toDate).format('DD-MMM-YYYY')}`,
                fontSize: 11,
                alignment: 'left'
              },
              {
                stack: [
                  {
                    text: `\nKATEGORY: ${category || 'ALL CATEGORY'}`,
                    fontSize: 11,
                    alignment: 'right'
                  },
                  {
                    text: `\nMERK: ${brand || 'ALL BRAND'}`,
                    fontSize: 11,
                    alignment: 'right'
                  }
                ]
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
              text: `Tanggal cetak: ${moment().format('DD-MMM-YYYY hh:mm:ss')}`,
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
      { fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'KODE', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'PRODUCT', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'QTY', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'TOTAL', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'DISKON', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'DPP', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'PPN', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'NETTO', style: 'tableHeader', alignment: 'center' }
    ]
  ]
  let tableBody = []
  try {
    tableBody = createTableBody(listDaily)
  } catch (e) {
    console.log(e)
  }
  const tableFooter = [
    [
      { text: 'Grand Total', colSpan: 3, alignment: 'center', fontSize: 12 },
      {},
      {},
      { text: formatNumberIndonesia(qtyTotal), alignment: 'right', fontSize: 12 },
      { text: formatNumberIndonesia(grandTotal), alignment: 'right', fontSize: 12 },
      { text: formatNumberIndonesia(discountTotal), alignment: 'right', fontSize: 12 },
      { text: formatNumberIndonesia(dppTotal), alignment: 'right', fontSize: 12 },
      { text: formatNumberIndonesia(ppnTotal), alignment: 'right', fontSize: 11 },
      { text: formatNumberIndonesia(nettoTotal), alignment: 'right', fontSize: 12 }
    ]
  ]

  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    width: ['4%', '14%', '23%', '4%', '11%', '11%', '11%', '11%', '11%'],
    pageMargins: [50, 145, 50, 60],
    pageSize: 'A3',
    pageOrientation: 'landscape',
    tableStyle: styles,
    layout: 'noBorder',
    tableHeader,
    tableBody,
    tableFooter,
    data: listDaily,
    header,
    footer
  }

  return (
    <BasicReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  listDaily: PropTypes.array,
  user: PropTypes.object.isRequired,
  storeInfo: PropTypes.object.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string
}

export default PrintPDF
