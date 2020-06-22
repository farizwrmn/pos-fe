/**
 * Created by veirry on 28/11/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { numberFormat } from 'utils'
import { BasicReport, RepeatReport } from 'components'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const PrintPDF = ({ user, listRekap, storeInfo, period, year, activeKey }) => {
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
    tableTitle: {
      fontSize: 14,
      margin: [0, 20, 0, 8]
    },
    textLeft: {
      fontSize: 11,
      alignment: 'left'
    },
    textCenter: {
      fontSize: 11,
      alignment: 'center'
    },
    textRight: {
      fontSize: 11,
      alignment: 'right'
    }
  }
  // Declare Function
  const createTableBody = (tabledata) => {
    let inQty = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.pQty) || 0), 0)
    let outQty = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.sQty) || 0), 0)

    let body = []
    if (activeKey === '3') {
      body.push(
        [
          { fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' },
          { fontSize: 12, text: 'TANGGAL', style: 'tableHeader', alignment: 'center' },
          { fontSize: 12, text: 'NO_FAKTUR', style: 'tableHeader', alignment: 'center' },
          { fontSize: 12, text: 'TIPE', style: 'tableHeader', alignment: 'center' },
          { fontSize: 12, text: 'MASUK', style: 'tableHeader', alignment: 'center' },
          { fontSize: 12, text: 'KELUAR', style: 'tableHeader', alignment: 'center' },
          { fontSize: 12, text: 'TOTAL', style: 'tableHeader', alignment: 'center' }
        ]
      )
    }
    const rows = tabledata
    let count = 1
    let countQtyValue = 0
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        countQtyValue = ((parseFloat(countQtyValue) || 0) + (parseFloat(data.pQty) || 0)) - (parseFloat(data.sQty) || 0)
        let row = []
        switch (activeKey) {
          case '0':
            row.push({ text: count, style: 'textCenter' })
            row.push({ text: (data.productCode || '').toString(), style: 'textLeft' })
            row.push({ text: (data.productName || '').toString(), style: 'textLeft' })
            row.push({ text: formatNumberIndonesia(data.beginQty || 0), style: 'textRight' })
            row.push({ text: formatNumberIndonesia(data.purchaseQty || 0), style: 'textRight' })
            row.push({ text: formatNumberIndonesia(data.adjInQty || 0), style: 'textRight' })
            row.push({ text: formatNumberIndonesia(data.transferInQty || 0), style: 'textRight' })
            row.push({ text: formatNumberIndonesia(data.posQty || 0), style: 'textRight' })
            row.push({ text: formatNumberIndonesia(data.adjOutQty || 0), style: 'textRight' })
            row.push({ text: formatNumberIndonesia(data.transferOutQty || 0), style: 'textRight' })
            row.push({ text: formatNumberIndonesia(data.count || 0), style: 'textRight' })
            row.push({ text: formatNumberIndonesia(data.inTransitQty || 0), style: 'textRight' })
            row.push({ text: formatNumberIndonesia(data.inTransferQty || 0), style: 'textRight' })
            body.push(row)
            break
          case '1':
            row.push({ text: count, style: 'textCenter' })
            row.push({ text: (data.productCode || '').toString(), style: 'textLeft' })
            row.push({ text: (data.productName || '').toString(), style: 'textLeft' })
            row.push({ text: formatNumberIndonesia(data.count || 0), style: 'textRight' })
            body.push(row)
            break
          case '2':
            row.push({ text: count, style: 'textCenter' })
            row.push({ text: (data.productCode || '').toString(), style: 'textLeft' })
            row.push({ text: (data.productName || '').toString(), style: 'textLeft' })
            row.push({ text: formatNumberIndonesia(data.beginQty || 0), style: 'textRight' })
            row.push({ text: formatNumberIndonesia(data.purchaseQty || 0), style: 'textRight' })
            row.push({ text: formatNumberIndonesia(data.adjInQty || 0), style: 'textRight' })
            row.push({ text: formatNumberIndonesia(data.posQty || 0), style: 'textRight' })
            row.push({ text: formatNumberIndonesia(data.valuePrice || 0), style: 'textRight' })
            row.push({ text: formatNumberIndonesia(data.adjOutQty || 0), style: 'textRight' })
            row.push({ text: formatNumberIndonesia(data.count || 0), style: 'textRight' })
            body.push(row)
            break
          case '3':
            row.push({ text: count, style: 'textCenter' })
            row.push({ text: moment(data.transDate).format('DD-MMM-YYYY'), style: 'textLeft' })
            row.push({ text: (data.transNo || '').toString(), style: 'textLeft' })
            row.push({ text: (data.transType || '').toString(), style: 'textLeft' })
            row.push({ text: formatNumberIndonesia(parseFloat(data.pQty) || 0), style: 'textRight' })
            row.push({ text: formatNumberIndonesia(parseFloat(data.sQty) || 0), style: 'textRight' })
            row.push({ text: formatNumberIndonesia(countQtyValue), style: 'textRight' })
            body.push(row)
            break
          default:
        }
      }
      count += 1
    }
    if (activeKey === '3') {
      body.push(
        [
          { text: 'Total', colSpan: 4, style: 'textCenter' },
          {},
          {},
          {},
          { text: formatNumberIndonesia(inQty), style: 'textRight' },
          { text: formatNumberIndonesia(outQty), style: 'textRight' },
          {}
        ]
      )
    }
    return body
  }

  // Declare Variable
  let beginQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.beginQty), 0)
  let purchaseQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.purchaseQty), 0)
  let adjInQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjInQty), 0)
  let transferInQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transferInQty || 0), 0)
  let posQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.posQty), 0)
  let valuePrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.valuePrice), 0)
  let adjOutQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjOutQty), 0)
  let transferOutQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transferOutQty || 0), 0)
  let count = listRekap.reduce((cnt, o) => cnt + parseFloat(o.count), 0)
  let inTransitQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.inTransitQty || 0), 0)
  let inTransferQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.inTransferQty || 0), 0)

  let tableHeader = []
  let tableFooter = []
  let headerTitle
  let widths = []
  let underline
  let pageSize
  switch (activeKey) {
    case '0':
      headerTitle = 'LAPORAN REKAP FIFO'
      underline = 1050
      widths.push('2%', '10%', '19%', '6%', '8%', '9%', '4%', '8%', '9%', '6%', '6%', '6%', '7%')
      pageSize = { width: 842, height: 1150 }
      tableHeader.push(
        [
          { fontSize: 12, text: 'NO', rowSpan: 2, alignment: 'center' },
          { fontSize: 12, text: 'KODE PRODUK', rowSpan: 2, alignment: 'center' },
          { fontSize: 12, text: 'NAMA PRODUK', rowSpan: 2, alignment: 'center' },
          { fontSize: 12, text: 'SALDO AWAL', alignment: 'center' },
          { fontSize: 12, text: 'PEMBELIAN', alignment: 'center' },
          { fontSize: 12, text: 'ADJ IN + RETUR PENJUALAN', alignment: 'center' },
          { fontSize: 12, text: 'TR IN', alignment: 'center' },
          { fontSize: 12, text: 'PENJUALAN', alignment: 'center' },
          { fontSize: 12, text: 'ADJ OUT + RETUR PEMBELIAN', alignment: 'center' },
          { fontSize: 12, text: 'TR OUT', alignment: 'center' },
          { fontSize: 12, text: 'SALDO AKHIR', alignment: 'center' },
          { fontSize: 12, text: 'IN TRANSIT', alignment: 'center' },
          { fontSize: 12, text: 'IN TRANSFER', alignment: 'center' }
        ]
      )
      tableHeader.push(
        [
          {},
          {},
          {},
          { fontSize: 12, text: 'QTY', alignment: 'center' },
          { fontSize: 12, text: 'QTY', alignment: 'center' },
          { fontSize: 12, text: 'QTY', alignment: 'center' },
          { fontSize: 12, text: 'QTY', alignment: 'center' },
          { fontSize: 12, text: 'QTY', alignment: 'center' },
          { fontSize: 12, text: 'QTY', alignment: 'center' },
          { fontSize: 12, text: 'QTY', alignment: 'center' },
          { fontSize: 12, text: 'QTY', alignment: 'center' },
          { fontSize: 12, text: 'QTY', alignment: 'center' },
          { fontSize: 12, text: 'QTY', alignment: 'center' }
        ]
      )
      tableFooter.push(
        [
          { text: 'Total', colSpan: 3, alignment: 'center', fontSize: 12 },
          {},
          {},
          { text: formatNumberIndonesia(beginQty), style: 'textRight' },
          { text: formatNumberIndonesia(purchaseQty), style: 'textRight' },
          { text: formatNumberIndonesia(adjInQty), style: 'textRight' },
          { text: formatNumberIndonesia(transferInQty), style: 'textRight' },
          { text: formatNumberIndonesia(posQty), style: 'textRight' },
          { text: formatNumberIndonesia(adjOutQty), style: 'textRight' },
          { text: formatNumberIndonesia(transferOutQty), style: 'textRight' },
          { text: formatNumberIndonesia(count), style: 'textRight' },
          { text: formatNumberIndonesia(inTransitQty), style: 'textRight' },
          { text: formatNumberIndonesia(inTransferQty), style: 'textRight' }
        ]
      )
      break
    case '1':
      headerTitle = 'LAPORAN SISA SALDO STOCK'
      underline = 747
      widths.push('6%', '30%', '50%', '15%')
      pageSize = 'A4'
      tableHeader.push(
        [
          { fontSize: 12, text: 'NO', alignment: 'center' },
          { fontSize: 12, text: 'KODE PRODUK', alignment: 'center' },
          { fontSize: 12, text: 'NAMA PRODUK', alignment: 'center' },
          { fontSize: 12, text: 'SALDO', alignment: 'center' }
        ]
      )
      tableFooter.push(
        [
          { text: 'Total', colSpan: 3, alignment: 'center', fontSize: 12 },
          {},
          {},
          { text: formatNumberIndonesia(count), alignment: 'right', fontSize: 12 }
        ]
      )
      break
    case '2':
      headerTitle = 'LAPORAN NILAI PERSEDIAAN'
      underline = 1330
      widths.push('4%', '13%', '21%', '8%', '8%', '11%', '8%', '8%', '11%', '8%')
      pageSize = { width: 842, height: 1430 }
      tableHeader.push(
        [
          { fontSize: 12, text: 'NO', rowSpan: 2, alignment: 'center' },
          { fontSize: 12, text: 'KODE PRODUK', rowSpan: 2, alignment: 'center' },
          { fontSize: 12, text: 'NAMA PRODUK', rowSpan: 2, alignment: 'center' },
          { fontSize: 12, text: 'SALDO AWAL', alignment: 'center' },
          { fontSize: 12, text: 'PEMBELIAN', alignment: 'center' },
          { fontSize: 12, text: 'ADJ IN + RETUR PENJUALAN', alignment: 'center' },
          { fontSize: 12, text: 'PENJUALAN', colSpan: 2, alignment: 'center' },
          {},
          { fontSize: 12, text: 'ADJ OUT + RETUR PEMBELIAN', alignment: 'center' },
          { fontSize: 12, text: 'SALDO AKHIR', alignment: 'center' }
        ]
      )
      tableHeader.push(
        [
          {},
          {},
          {},
          { fontSize: 12, text: 'QTY', alignment: 'center' },
          { fontSize: 12, text: 'QTY', style: 'tableHeader', alignment: 'center' },
          { fontSize: 12, text: 'QTY', alignment: 'center' },
          { fontSize: 12, text: 'QTY', alignment: 'center' },
          { fontSize: 12, text: 'PENJUALAN', alignment: 'center' },
          { fontSize: 12, text: 'QTY', alignment: 'center' },
          { fontSize: 12, text: 'QTY', alignment: 'center' }
        ]
      )
      tableFooter.push(
        [
          { text: 'Total', colSpan: 3, alignment: 'center', fontSize: 12 },
          {},
          {},
          { text: formatNumberIndonesia(beginQty), style: 'textRight' },
          { text: formatNumberIndonesia(purchaseQty), style: 'textRight' },
          { text: formatNumberIndonesia(adjInQty), style: 'textRight' },
          { text: formatNumberIndonesia(posQty), style: 'textRight' },
          { text: formatNumberIndonesia(valuePrice), style: 'textRight' },
          { text: formatNumberIndonesia(adjOutQty), style: 'textRight' },
          { text: formatNumberIndonesia(count), style: 'textRight' }
        ]
      )
      break
    case '3':
      headerTitle = 'LAPORAN KARTU STOK FIFO'
      underline = 742
      pageSize = 'A4'
      break
    default:
  }

  const header = {
    stack: [
      {
        stack: [
          {
            stack: storeInfo.stackHeader01
          },
          {
            text: headerTitle,
            style: 'header',
            fontSize: 18,
            alignment: 'center'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: underline, y2: 5, lineWidth: 0.5 }]
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
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: underline, y2: 5, lineWidth: 0.5 }]
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

  let tableBody = []
  let tableTitle = []
  try {
    if (activeKey === '3') {
      let groupBy = (xs, key) => {
        return xs.reduce((rv, x) => {
          (rv[x[key]] = rv[x[key]] || []).push(x)
          return rv
        }, {})
      }
      let groubedByTeam = groupBy(listRekap, 'productCode')
      let arr = Object.keys(groubedByTeam).map(index => groubedByTeam[index])
      for (let i = 0; i < arr.length; i += 1) {
        tableBody.push(createTableBody(arr[i]))
        widths.push(['6%', '20%', '30%', '14%', '10%', '10%', '10%'])
        tableTitle.push({ text: `Produk : ${arr[i][0].productCode} - ${arr[i][0].productName}`, style: 'tableTitle' })
      }
    } else {
      tableBody = createTableBody(listRekap)
    }
  } catch (e) {
    console.log(e)
  }

  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    width: widths,
    pageMargins: [50, 130, 50, 60],
    pageSize,
    pageOrientation: 'landscape',
    tableStyle: styles,
    layout: 'noBorder',
    tableHeader,
    tableBody,
    tableTitle,
    tableFooter,
    data: listRekap,
    header,
    footer
  }

  let reportType = (<BasicReport {...pdfProps} />)
  if (activeKey === '3') {
    reportType = (<RepeatReport {...pdfProps} />)
  }

  return (
    { ...reportType }
  )
}

PrintPDF.propTypes = {
  listRekap: PropTypes.array,
  dataSource: PropTypes.array,
  user: PropTypes.object.isRequired,
  period: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  storeInfo: PropTypes.object.isRequired
}

export default PrintPDF
