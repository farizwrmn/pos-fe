import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'

const PrintPDF = ({ user, storeInfo, invoiceInfo, invoiceItem }) => {
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
        row.push({ text: (data.qty || '').toString(), alignment: 'center', fontSize: 11 })
        row.push({ text: (data.purchasePrice || 0).toLocaleString(), alignment: 'right', fontSize: 11 })
        row.push({ text: (data.ppn || 0).toLocaleString(), alignment: 'right', fontSize: 11 })
        row.push({ text: (data.dpp || 0).toLocaleString(), alignment: 'right', fontSize: 11 })
        body.push(row)
      }
      count += 1
    }
    return body
  }

  // Declare Variable
  let productTotal = invoiceItem.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
  let deliveryFeeTotal = invoiceItem.reduce((cnt, o) => cnt + parseFloat(o.deliveryFee), 0)
  let subTotal = invoiceItem.reduce((cnt, o) => cnt + parseFloat(o.dpp), 0)
  let totalTax = invoiceItem.reduce((cnt, o) => cnt + parseFloat(o.ppn), 0)
  const styles = {
    reportTitle: {
      fontSize: 25,
      bold: true,
      color: '#498bf4'
    },
    tableInfo: {
      margin: [135, 0, 0, 0]
    },
    backgroundAndTextColorVendor: {
      bold: true,
      fontSize: 12,
      color: '#fff',
      fillColor: '#3d7de2',
      alignment: 'left',
      margin: [5, 0, 0, 0]
    },
    vendorInfo: {
      fontSize: 12,
      alignment: 'left',
      margin: [5, 0, 0, 0]
    },
    backgroundAndTextColorShipTo: {
      bold: true,
      fontSize: 12,
      color: '#fff',
      fillColor: '#3d7de2',
      alignment: 'left'
    },
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
    tableHeader: {
      bold: true,
      fontSize: 13,
      color: '#fff',
      fillColor: '#3d7de2'
    }
  }
  const header = {
    stack: [
      {
        columns: [
          {
            stack: storeInfo.stackHeader02
          },
          {
            stack: [
              { text: 'FAKTUR PEMBELIAN', style: 'reportTitle' },
              {
                style: 'tableInfo',
                table: {
                  widths: [70, 5, 150],
                  body: [
                    [{ text: 'TANGGAL', border: [false] }, { text: '', border: [false] }, { text: moment(invoiceInfo.transDate).format('DD-MMM-YYYY'), alignment: 'center' }],
                    [{ text: 'NO FAKTUR', border: [false] }, { text: '', border: [false] }, { text: (invoiceInfo.transNo || '').toString(), alignment: 'center' }],
                    [{ text: 'REFERENCE', border: [false] }, { text: '', border: [false] }, { text: (invoiceInfo.reference || '').toString(), alignment: 'center' }],
                    [{ text: 'TAX NO', border: [false] }, { text: '', border: [false] }, { text: (invoiceInfo.taxInvoiceNo || '').toString(), alignment: 'center' }]
                  ]
                }
              }
            ],
            alignment: 'right'
          }
        ]
      },
      {
        margin: [0, 20, 0, 0],
        table: {
          widths: [180, 40, 180],
          body: [
            [{ text: 'PEMASOK ', style: 'backgroundAndTextColorVendor' }, { text: '' }, { text: 'PENJUAL', style: 'backgroundAndTextColorShipTo' }],
            [{ text: (invoiceInfo.supplierName || '').toString(), style: 'vendorInfo' }, { text: '' }, { text: (storeInfo.name || '').toString() }],
            [{ text: '', style: 'vendorInfo' }, { text: '' }, { text: (storeInfo.address01 || '').toString() }],
            [{ text: '', style: 'vendorInfo' }, { text: '' }, { text: (storeInfo.address02 || '').toString() }]
          ]
        },
        layout: 'noBorders'
      }
    ],
    margin: [10, 12, 12, 10]
  }

  const footer = (currentPage, pageCount) => {
    if (currentPage === pageCount) {
      return {
        margin: [10, 0, 10, 0],
        height: 160,
        stack: [
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 793, y2: 5, lineWidth: 0.5 }]
          },
          {},
          {
            columns: [
              { text: `Dibuat oleh \n\n\n\n. . . . . . . . . . . . . . . .  \n${user.username}`, fontSize: 12, alignment: 'center', margin: [0, 5, 0, 0] },
              { text: `PIC \n\n\n\n. . . . . . . . . . . . . . . .  \n${(invoiceInfo.createdBy || '').toString()}`, fontSize: 12, alignment: 'center', margin: [0, 5, 0, 0] },
              { text: 'Diterima oleh \n\n\n\n. . . . . . . . . . . . . . . .  \n', fontSize: 12, alignment: 'center', margin: [0, 5, 0, 0] }
            ]
          },
          {
            fontSize: 9,
            columns: [
              {
                text: `Tgl Cetak: ${moment().format('DD-MM-YYYY HH:mm:ss')}`,
                margin: [0, 10, 0, 10],
                fontSize: 9,
                alignment: 'left'
              },
              {
                text: `Cetakan ke: ${invoiceInfo.printNo}`,
                margin: [0, 10, 0, 10],
                fontSize: 9,
                alignment: 'center'
              },
              {
                text: `Dicetak Oleh: ${user.username}`,
                margin: [0, 10, 0, 10],
                fontSize: 9,
                alignment: 'center'
              },
              {
                text: `page: ${(currentPage || 0).toString()} of ${pageCount}\n`,
                fontSize: 9,
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
      margin: [10, 100, 10, 10],
      height: 160,
      stack: [
        {
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 793, y2: 5, lineWidth: 0.5 }]
        },
        {
          columns: [
            {
              text: `Tgl Cetak: ${moment().format('DD-MM-YYYY HH:mm:ss')}`,
              margin: [0, 20, 0, 40],
              fontSize: 9,
              alignment: 'left'
            },
            {
              text: `Cetakan ke: ${invoiceInfo.printNo}`,
              margin: [0, 20, 0, 40],
              fontSize: 9,
              alignment: 'center'
            },
            {
              text: `Dicetak Oleh: ${user.username}`,
              margin: [0, 20, 0, 40],
              fontSize: 9,
              alignment: 'center'
            },
            {
              text: `page: ${(currentPage || 0).toString()} of ${pageCount}\n`,
              fontSize: 9,
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
      { fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'KODE PRODUK', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'NAMA PRODUK', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'QTY', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'HARGA SATUAN', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'PAJAK', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'TOTAL', style: 'tableHeader', alignment: 'center' }
    ]
  ]
  let tableBody = []
  try {
    tableBody = createTableBody(invoiceItem)
  } catch (e) {
    console.log(e)
  }
  const tableFooter = [
    [
      { text: '', border: [false] },
      { text: '', border: [false] },
      { text: '', border: [false] },
      { text: '', border: [false] },
      { text: 'Sub Total', colSpan: 2, alignment: 'right', fontSize: 12, bold: true },
      {},
      { text: (subTotal || '').toLocaleString(), alignment: 'right', fontSize: 12, bold: true }
    ],
    [
      { text: 'Catatan', colSpan: 3 },
      {},
      {},
      { text: '', border: [false] },
      { text: 'Pajak', colSpan: 2, alignment: 'right', fontSize: 12, bold: true },
      {},
      { text: (totalTax || '').toLocaleString(), alignment: 'right', fontSize: 12, bold: true }
    ],
    [
      { text: `1. Total Qty: ${productTotal}`, colSpan: 3, border: [true, false, true, false] },
      {},
      {},
      { text: '', border: [false] },
      { text: 'Rounding', colSpan: 2, alignment: 'right', fontSize: 12, bold: true },
      {},
      { text: (invoiceInfo.rounding || '').toLocaleString(), alignment: 'right', fontSize: 12, bold: true }
    ],
    [
      { text: `2. Total pembayaran jatuh tempo dalam ${invoiceInfo.tempo ? invoiceInfo.tempo : 0} hari`, colSpan: 3, border: [true, false, true, true] },
      {},
      {},
      { text: '', border: [false] },
      { text: 'Delivery', colSpan: 2, alignment: 'right', fontSize: 12, bold: true },
      {},
      { text: (deliveryFeeTotal || '').toLocaleString(), alignment: 'right', fontSize: 12, bold: true }
    ],
    [
      { text: '', border: [false] },
      { text: '', border: [false] },
      { text: '', border: [false] },
      { text: '', border: [false] },
      { text: 'Total', colSpan: 2, alignment: 'right', fontSize: 12, bold: true },
      {},
      { text: (subTotal + totalTax + invoiceInfo.rounding + deliveryFeeTotal).toLocaleString(), alignment: 'right', fontSize: 12, bold: true }
    ]

  ]
  const tableLayout = {
    hLineWidth: () => {
      return 0.01
    },
    vLineWidth: () => {
      return 0.01
    },
    hLineColor: () => {
      return '#444'
    },
    vLineColor: () => {
      return '#444'
    }
  }
  // Declare additional Props
  const pdfProps = {
    name: 'Print',
    className: 'bgcolor-blue',
    buttonType: '',
    iconSize: '',
    width: ['4%', '15%', '40%', '9%', '10%', '10%', '12%'],
    pageMargins: [10, 190, 10, 150],
    pageSize: { width: 813, height: 650 },
    pageOrientation: 'landscape',
    tableStyle: styles,
    layout: tableLayout,
    tableHeader,
    tableBody,
    tableFooter,
    data: invoiceItem,
    header,
    footer,
    printNo: 1
  }

  return (
    <BasicReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  listItem: PropTypes.array,
  user: PropTypes.object.isRequired,
  storeInfo: PropTypes.object.isRequired
}

export default PrintPDF
