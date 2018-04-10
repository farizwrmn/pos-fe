/**
 * Created by veirry on 28/11/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'

const PrintPDF = ({ activeKey, user, listRekap, storeInfo, period, year }) => {
  // Declare Function
  const createTableBody = (tabledata) => {
    let body = []
    const rows = tabledata
    let count = 1
    for (let key = 0; key < rows.length; key += 1) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = []
        switch (activeKey) {
          case '0':
            row.push({ text: count, alignment: 'center', fontSize: 11 })
            row.push({ text: (data.productCode || '').toString(), alignment: 'left', fontSize: 11 })
            row.push({ text: (data.productName || '').toString(), alignment: 'left', fontSize: 11 })
            row.push({ text: data.beginQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
            row.push({ text: data.beginPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
            row.push({ text: data.purchaseQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
            row.push({ text: data.purchasePrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
            row.push({ text: data.adjInQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
            row.push({ text: data.adjInPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
            row.push({ text: data.posQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
            row.push({ text: data.posPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
            row.push({ text: data.adjOutQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
            row.push({ text: data.adjOutPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
            row.push({ text: data.count.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
            row.push({ text: data.amount.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
            body.push(row)
            break
          case '1':
            row.push({ text: count, alignment: 'center', fontSize: 11 })
            row.push({ text: (data.productCode || '').toString(), alignment: 'left', fontSize: 11 })
            row.push({ text: (data.productName || '').toString(), alignment: 'left', fontSize: 11 })
            row.push({ text: (parseFloat(data.amount) / parseFloat(data.count)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
            row.push({ text: data.count.toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
            row.push({ text: data.amount.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
            body.push(row)
            break
          default:
        }
      }
      count += 1
    }
    return body
  }

  // Declare Variable
  let beginQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.beginQty), 0)
  let beginPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.beginPrice), 0)
  let purchaseQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.purchaseQty), 0)
  let purchasePrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.purchasePrice), 0)
  let adjInQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjInQty), 0)
  let adjInPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjInPrice), 0)
  let posQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.posQty), 0)
  let posPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.posPrice), 0)
  let adjOutQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjOutQty), 0)
  let adjOutPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjOutPrice), 0)
  let count = listRekap.reduce((cnt, o) => cnt + parseFloat(o.count), 0)
  let amount = listRekap.reduce((cnt, o) => cnt + parseFloat(o.amount), 0)
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
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: activeKey === '0' ? 1150 : 742, y2: 5, lineWidth: 0.5 }]
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
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: activeKey === '0' ? 1150 : 742, y2: 5, lineWidth: 0.5 }]
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

  let tableHeader = []
  switch (activeKey) {
    case '0':
      tableHeader.push(
        [
          { fontSize: 12, text: 'NO', rowSpan: 2, alignment: 'center' },
          { fontSize: 12, text: 'KODE PRODUK', rowSpan: 2, alignment: 'center' },
          { fontSize: 12, text: 'NAMA PRODUK', rowSpan: 2, alignment: 'center' },
          { fontSize: 12, text: 'SALDO AWAL', colSpan: 2, alignment: 'center' },
          {},
          { fontSize: 12, text: 'PEMBELIAN', colSpan: 2, alignment: 'center' },
          {},
          { fontSize: 12, text: 'ADJ IN + RETUR PENJUALAN', colSpan: 2, alignment: 'center' },
          {},
          { fontSize: 12, text: 'PENJUALAN', colSpan: 2, alignment: 'center' },
          {},
          { fontSize: 12, text: 'ADJ OUT + RETUR PEMBELIAN', colSpan: 2, alignment: 'center' },
          {},
          { fontSize: 12, text: 'SALDO AKHIR', colSpan: 2, alignment: 'center' },
          {}
        ]
      )
      tableHeader.push(
        [
          {},
          {},
          {},
          { fontSize: 12, text: 'QTY', alignment: 'center' },
          { fontSize: 12, text: 'HPP', alignment: 'center' },
          { fontSize: 12, text: 'QTY', style: 'tableHeader', alignment: 'center' },
          { fontSize: 12, text: 'HPP', alignment: 'center' },
          { fontSize: 12, text: 'QTY', alignment: 'center' },
          { fontSize: 12, text: 'HPP', alignment: 'center' },
          { fontSize: 12, text: 'QTY', alignment: 'center' },
          { fontSize: 12, text: 'HPP', alignment: 'center' },
          { fontSize: 12, text: 'QTY', alignment: 'center' },
          { fontSize: 12, text: 'HPP', alignment: 'center' },
          { fontSize: 12, text: 'QTY', alignment: 'center' },
          { fontSize: 12, text: 'HPP', alignment: 'center' }
        ]
      )
      break
    case '1':
      tableHeader.push([
        { fontSize: 12, text: 'NO', alignment: 'center' },
        { fontSize: 12, text: 'KODE PRODUK', alignment: 'center' },
        { fontSize: 12, text: 'NAMA PRODUK', alignment: 'center' },
        { fontSize: 12, text: 'HPP', alignment: 'center' },
        { fontSize: 12, text: 'SALDO', alignment: 'center' },
        { fontSize: 12, text: 'JUMLAH', alignment: 'center' }
      ])
      break
    default:
  }

  let tableBody = []
  try {
    tableBody = createTableBody(listRekap)
  } catch (e) {
    console.log(e)
  }

  let tableFooter = []
  switch (activeKey) {
    case '0':
      tableFooter.push(
        [
          { text: 'Total', colSpan: 3, alignment: 'center', fontSize: 12 },
          {},
          {},
          { text: `${beginQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 10 },
          { text: `${beginPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 10 },
          { text: `${purchaseQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 10 },
          { text: `${purchasePrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 10 },
          { text: `${adjInQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 10 },
          { text: `${adjInPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 10 },
          { text: `${posQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 10 },
          { text: `${posPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 10 },
          { text: `${adjOutQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 10 },
          { text: `${adjOutPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 10 },
          { text: `${count.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 10 },
          { text: `${amount.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 10 }
        ]
      )
      break
    case '1':
      tableFooter.push(
        [
          { text: 'Total', colSpan: 4, alignment: 'center', fontSize: 12 },
          {},
          {},
          {},
          { text: `${count.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 },
          { text: `${amount.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 }
        ]
      )
      break
    default:
  }

  let widths = []
  switch (activeKey) {
    case '0':
      widths.push('4%', '11%', '13%', '4%', '8%', '4%', '8%', '4%', '8%', '4%', '8%', '4%', '8%', '4%', '8%')
      break
    case '1':
      widths.push('5%', '20%', '35%', '15%', '10%', '15%')
      break
    default:
  }

  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    width: widths,
    pageMargins: [50, 130, 50, 60],
    pageSize: activeKey === '0' ? { width: 842, height: 1250 } : 'A4',
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
