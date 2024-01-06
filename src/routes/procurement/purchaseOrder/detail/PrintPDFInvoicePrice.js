/**
 * Created by veirry on 31/01/2021.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { numberFormat } from 'utils'
import { BasicInvoice } from 'components'

const formatNumberIndonesia = numberFormat.formatNumberQty

const PrintPDFInvoicePrice = ({ user, listItem, itemPrint }) => {
  // Declare Function
  const createTableBody = (tabledata) => {
    let body = []
    const rows = tabledata
    let count = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = []
        row.push({ text: count, alignment: 'center', fontSize: 8 })
        row.push({ text: `${data.product.productCode}`, alignment: 'left', fontSize: 8 })
        row.push({ text: `${data.product.productName}`, alignment: 'left', fontSize: 8 })
        row.push({ text: `${data.qtyUom != null ? data.qtyUom : data.qty} (${data.qtyUom != null ? data.uom : 'PCS'})`, alignment: 'right', fontSize: 8 })
        row.push({ text: `${data.fraction}`, alignment: 'right', fontSize: 8 })
        row.push({ text: formatNumberIndonesia(data.purchasePrice), alignment: 'right', fontSize: 8 })
        row.push({ text: formatNumberIndonesia(data.discPercent), alignment: 'right', fontSize: 8 })
        row.push({ text: formatNumberIndonesia(data.discPercent02), alignment: 'right', fontSize: 8 })
        row.push({ text: formatNumberIndonesia(data.discPercent03), alignment: 'right', fontSize: 8 })
        row.push({ text: formatNumberIndonesia(data.discNominal), alignment: 'right', fontSize: 8 })
        row.push({ text: formatNumberIndonesia(data.DPP), alignment: 'right', fontSize: 8 })
        row.push({ text: formatNumberIndonesia(data.PPN), alignment: 'right', fontSize: 8 })
        row.push({ text: formatNumberIndonesia(data.DPP + data.PPN), alignment: 'right', fontSize: 8 })
        body.push(row)
      }
      count += 1
    }
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
      fontSize: 8,
      color: 'black'
    }
  }
  const header = {
    stack: [
      {
        columns: [
          {
            text: ' ',
            style: 'header',
            fontSize: 18,
            alignment: 'right'
          },
          {
            text: 'PURCHASE ORDER',
            style: 'header',
            fontSize: 18,
            alignment: 'center'
          },
          {
            text: ' ',
            style: 'header',
            fontSize: 18,
            alignment: 'right'
          }
        ]
      },
      {
        table: {
          widths: ['15%', '1%', '27%', '10%', '15%', '1%', '32%'],
          body: [
            [{ text: 'NO PO', fontSize: 8 }, { text: ':', fontSize: 8 }, { text: (`${itemPrint.transNo}\n${itemPrint.supplier.supplierCode}\n${itemPrint.supplier.supplierName}` || '').toString(), fontSize: 8 }, {}, { text: 'DELIVERY TO', fontSize: 8 }, { text: ':', fontSize: 8 }, { text: (itemPrint.delivery.address01 || '').toString(), fontSize: 8 }],
            [{ text: 'TANGGAL', fontSize: 8 }, { text: ':', fontSize: 8 }, { text: (itemPrint.transDate || '').toString(), fontSize: 8 }, {}, { text: 'EXPIRED PO', fontSize: 8 }, { text: ':', fontSize: 8 }, { text: (itemPrint.expectedArrival || '').toString(), fontSize: 8 }]
          ]
        },
        layout: 'noBorders'
      },
      {
        canvas: [{ type: 'line', x1: 0, y1: 5, x2: 820 - (2 * 40), y2: 5, lineWidth: 0.5 }]
      }
    ],
    margin: [30, 12, 12, 30]
  }
  const footer = (currentPage, pageCount) => {
    if (currentPage === pageCount) {
      return {
        margin: [40, 0, 40, 0],
        height: 160,
        stack: [
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 820 - (2 * 40), y2: 5, lineWidth: 0.5 }]
          },
          {
            // columns: [
            //   { fontSize: 8, text: `Terbilang : ${terbilang(Total).toUpperCase()} RUPIAH`, alignment: 'left' },
            //   { fontSize: 8, text: `TOTAL : Rp ${(Total).toLocaleString(['ban', 'id'])}`, alignment: 'right' },
            // ],
          },
          {
            table: {
              widths: ['15%', '1%', '27%', '10%', '15%', '1%', '32%'],
              body: [
                [{ text: 'NPWP', fontSize: 8 }, ':', { text: (`${itemPrint.delivery.taxID} a/n ${itemPrint.delivery.companyName}`).toString(), fontSize: 8 }, {}, { text: 'MEMO', fontSize: 8 }, ':', { text: (`${itemPrint.delivery.address02 || ''}\n${itemPrint.description || ''}`).toString(), fontSize: 8 }]
              ]
            },
            layout: 'noBorders'
          },
          {
            columns: [
              { text: `Dibuat oleh \n\n\n\n. . . . . . . . . . . . . . . .  \n${user.username}`, fontSize: 8, alignment: 'center', margin: [0, 5, 0, 0] },
              {},
              { text: 'Diterima oleh \n\n\n\n. . . . . . . . . . . . . . . .  \n', fontSize: 8, alignment: 'center', margin: [0, 5, 0, 0] }
            ]
          },
          {
            fontSize: 8,
            columns: [
              {
                text: `Tgl Cetak: ${moment().format('DD-MM-YYYY HH:mm:ss')}`,
                margin: [0, 10, 0, 10],
                fontSize: 8,
                alignment: 'left'
              },
              {
                text: `Tgl Invoice: ${moment(itemPrint.transDate).format('DD-MM-YYYY')}`,
                margin: [0, 10, 0, 10],
                fontSize: 8,
                alignment: 'left'
              },
              {
                text: 'Cetakan ke: 1',
                margin: [0, 10, 0, 10],
                fontSize: 8,
                alignment: 'center'
              },
              {
                text: `Dicetak Oleh: ${user.username}`,
                margin: [0, 10, 0, 10],
                fontSize: 8,
                alignment: 'center'
              },
              {
                text: `page: ${(currentPage || 0).toString()} of ${pageCount}\n`,
                fontSize: 8,
                margin: [0, 10, 0, 10],
                alignment: 'right'
              }
            ],
            alignment: 'center'
          }
        ]
      }
    }
    return {
      margin: [40, 100, 40, 10],
      height: 160,
      stack: [
        {
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 820 - (2 * 40), y2: 5, lineWidth: 0.5 }]
        },
        {
          columns: [
            {
              text: `Tgl Cetak: ${moment().format('DD-MM-YYYY HH:mm:ss')}`,
              margin: [0, 20, 0, 40],
              fontSize: 8,
              alignment: 'left'
            },
            {
              text: 'Cetakan ke: 1',
              margin: [0, 20, 0, 40],
              fontSize: 8,
              alignment: 'center'
            },
            {
              text: `Dicetak Oleh: ${user.username}`,
              margin: [0, 20, 0, 40],
              fontSize: 8,
              alignment: 'center'
            },
            {
              text: `page: ${(currentPage || 0).toString()} of ${pageCount}\n`,
              fontSize: 8,
              margin: [0, 20, 0, 40],
              alignment: 'right'
            }
          ]
        }
      ]
    }
  }
  const tableHeader = [
    [
      { fontSize: 7, text: 'NO', style: 'tableHeader', alignment: 'center' },
      { fontSize: 7, text: 'KODE BARANG', style: 'tableHeader', alignment: 'left' },
      { fontSize: 7, text: 'NAMA BARANG', style: 'tableHeader', alignment: 'left' },
      { fontSize: 7, text: 'QTY (UOM)', style: 'tableHeader', alignment: 'right' },
      { fontSize: 7, text: 'FRACTION', style: 'tableHeader', alignment: 'right' },
      { fontSize: 7, text: 'PRICE (PCS)', style: 'tableHeader', alignment: 'right' },
      { fontSize: 7, text: 'DISC 1 (%)', style: 'tableHeader', alignment: 'right' },
      { fontSize: 7, text: 'DISC 2 (%)', style: 'tableHeader', alignment: 'right' },
      { fontSize: 7, text: 'DISC 3 (%)', style: 'tableHeader', alignment: 'right' },
      { fontSize: 7, text: 'DISC (N)', style: 'tableHeader', alignment: 'right' },
      { fontSize: 7, text: 'DPP', style: 'tableHeader', alignment: 'right' },
      { fontSize: 7, text: 'PPN', style: 'tableHeader', alignment: 'right' },
      { fontSize: 7, text: 'SUBTOTAL', style: 'tableHeader', alignment: 'right' }
    ]
  ]
  let tableBody = []
  try {
    tableBody = createTableBody(listItem)
  } catch (e) {
    console.log('error', e)
  }

  const qtyUomTotal = listItem.reduce((prev, next) => prev + (next.qtyUom || 1), 0)
  const subtotal = listItem.reduce((prev, next) => prev + next.DPP + next.PPN, 0)
  const tableFooter = [
    [
      { text: 'Total', colSpan: 3, alignment: 'center', fontSize: 8 },
      {},
      {},
      {},
      { text: formatNumberIndonesia(parseFloat(qtyUomTotal)), alignment: 'right', fontSize: 8 },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      { text: formatNumberIndonesia(parseFloat(subtotal)), alignment: 'right', fontSize: 8 }
    ]
  ]
  const tableLayout = {
    hLineWidth: (i, node) => {
      return (i === 1 || i === 0 || i === node.table.body.length || i === (node.table.body.length - 1)) ? 0.01 : 0
    },
    vLineWidth: (i, node) => {
      return (i === 0 || i === node.table.widths.length) ? 0 : 0
    },
    hLineColor: (i, node) => {
      return (i === 1 || i === 0 || i === node.table.body.length || i === (node.table.body.length - 1)) ? 'black' : 'grey'
    },
    vLineColor: () => {
      return 'black'
    }
  }
  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-green',
    width: ['5%', '15%', '15%', '6%', '6%', '6%', '6%', '6%', '6%', '6%', '6%', '6%', '8%'],
    pageMargins: [40, 160, 40, 150],
    pageSize: { width: 612, height: 792 },
    pageOrientation: 'landscape',
    tableStyle: styles,
    layout: tableLayout,
    tableHeader,
    tableBody,
    tableFooter,
    data: listItem,
    header,
    footer,
    printNo: 1
  }

  return (
    <BasicInvoice {...pdfProps} />
  )
}

PrintPDFInvoicePrice.propTypes = {
  listItem: PropTypes.array,
  user: PropTypes.object.isRequired,
  storeInfo: PropTypes.object.isRequired
  // fromDate: PropTypes.string.isRequired,
  // toDate: PropTypes.string.isRequired,
}

export default PrintPDFInvoicePrice
