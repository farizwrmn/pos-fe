import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { RepeatReport } from 'components'

const PrintPDF = ({ user, listData, storeInfo, fromDate, toDate }) => {
  listData = listData.filter(x => x.items.length)

  const styles = {
    header: {
      alignment: 'center',
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 10]
    },
    tableHeader: {
      bold: true,
      fontSize: 12,
      color: 'black',
      alignment: 'center'
    },
    rowTextFooter: {
      alignment: 'center',
      fontSize: 12,
      bold: true
    },
    rowNumberFooter: {
      alignment: 'right',
      fontSize: 12,
      bold: true
    },
    footer: {
      fontSize: 9
    }
  }

  const createTableBody = (tabledata) => {
    let totalQty = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.qty) || 0), 0)
    let totalSubTotal = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.qty * o.purchasePrice) || 0), 0)
    let totalDiscount = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.totalDiscount) || 0), 0)
    let totalAfterDiscount = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.netto) || 0), 0)

    let headers = [
      [
        { text: 'NO', style: 'tableHeader' },
        { text: 'KODE PRODUK', style: 'tableHeader' },
        { text: 'NAMA PRODUK', style: 'tableHeader' },
        { text: 'QTY', style: 'tableHeader' },
        { text: 'HARGA SATUAN', style: 'tableHeader' },
        { text: 'SUB TOTAL', style: 'tableHeader' },
        { text: 'DISK(%)', style: 'tableHeader' },
        { text: 'DISK(N)', style: 'tableHeader' },
        { text: 'TOTAL DISKON', style: 'tableHeader' },
        { text: 'TOTAL', style: 'tableHeader' }
      ]
    ]

    let body = []
    for (let i = 0; i < headers.length; i += 1) {
      body.push(headers[i])
    }

    let counter = 1
    for (let key in tabledata) {
      if (tabledata.hasOwnProperty(key)) {
        let data = tabledata[key]
        let row = []
        row.push({ text: counter, alignment: 'center', fontSize: 11 })
        row.push({ text: (data.productCode || '').toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: (data.productName || '').toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: (data.qty || 0).toString(), alignment: 'center', fontSize: 11 })
        row.push({ text: (parseFloat(data.purchasePrice) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: (parseFloat(data.qty * data.purchasePrice) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: `${(parseFloat(data.discPercent) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`, alignment: 'right', fontSize: 11 })
        row.push({ text: (parseFloat(data.discNominal) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: (parseFloat(data.totalDiscount) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: (parseFloat(data.netto) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        body.push(row)
      }
      counter += 1
    }

    let totalRow = []
    totalRow.push({ text: 'Total', colSpan: 3, style: 'rowTextFooter' })
    totalRow.push({})
    totalRow.push({})
    totalRow.push({ text: `${totalQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'rowNumberFooter' })
    totalRow.push({})
    totalRow.push({ text: `${totalSubTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'rowNumberFooter' })
    totalRow.push({})
    totalRow.push({})
    totalRow.push({ text: `${totalDiscount.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'rowNumberFooter' })
    totalRow.push({ text: `${totalAfterDiscount.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'rowNumberFooter' })
    body.push(totalRow)
    return body
  }

  let tableTitle = []
  let tableBody = []
  for (let i = 0; i < listData.length; i += 1) {
    try {
      tableTitle.push(
        {
          table: {
            widths: ['15%', '1%', '32%', '10%', '15%', '1%', '27%'],
            body: [
              [{}, {}, {}, {}, {}, {}, {}],
              [{}, {}, {}, {}, {}, {}, {}],
              [{}, {}, {}, {}, {}, {}, {}],
              [{}, {}, {}, {}, {}, {}, {}],
              [{}, {}, {}, {}, {}, {}, {}],
              [{ text: 'NO TRANSAKSI', fontSize: 11 }, ':', { text: (listData[i].transNo || '').toString(), fontSize: 11 }, {}, { text: 'ID PEMASOK', fontSize: 11 }, ':', { text: (listData[i].supplierCode || '').toString(), fontSize: 11 }],
              [{ text: 'TANGGAL', fontSize: 11 }, ':', { text: moment(listData[i].transDate).format('DD-MMM-YYYY'), fontSize: 11 }, {}, { text: 'NAMA PEMASOK', fontSize: 11 }, ':', { text: (listData[i].supplierName || '').toString(), fontSize: 11 }],
              [{ text: 'TIPE PAJAK', fontSize: 11 }, ':', { text: (listData[i].taxType || '').toString(), fontSize: 11 }, {}, { text: 'ALAMAT', fontSize: 11 }, ':', { text: '', fontSize: 11 }],
              [{ text: 'DISKON(%)', fontSize: 11 }, ':', { text: `${(listData[i].discInvoicePercent || 0).toString()}%`, fontSize: 11 }, {}, { text: 'MEMO', fontSize: 11 }, ':', { text: (listData[i].memo || '').toString(), fontSize: 11 }],
              [{ text: 'DISKON(N)', fontSize: 11 }, ':', { text: (listData[i].discInvoiceNominal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), fontSize: 11 }, {}, {}, {}, {}]
            ]
          },
          layout: 'noBorders'
        }
      )
      tableBody.push(createTableBody(listData[i].items))
    } catch (e) {
      console.log(e)
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
            text: 'LAPORAN RIWAYAT RINCIAN PEMBELIAN',
            style: 'header'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1150, y2: 5, lineWidth: 0.5 }]
          },
          {
            columns: [
              {
                text: `\nPeriode: ${moment(fromDate).format('DD-MMM-YYYY')}  hingga  ${moment(toDate).format('DD-MMM-YYYY')}`,
                fontSize: 12,
                alignment: 'left'
              },
              {
                text: '',
                alignment: 'center'
              },
              {
                text: '',
                alignment: 'right'
              }
            ]
          }
        ]
      }
    ],
    margin: [20, 12, 20, 30]
  }

  const footer = (currentPage, pageCount) => {
    return {
      margin: [20, 30, 20, 0],
      stack: [
        {
          canvas: [{ type: 'line', x1: 0, y1: -8, x2: 1150, y2: -8, lineWidth: 0.5 }]
        },
        {
          columns: [
            {
              text: `Tanggal cetak: ${moment().format('LLLL')}`,
              style: 'footer',
              alignment: 'left'
            },
            {
              text: `Dicetak oleh: ${user.username}`,
              style: 'footer',
              alignment: 'center'
            },
            {
              text: `Halaman: ${(currentPage || 0).toString()} dari ${pageCount}`,
              style: 'footer',
              alignment: 'right'
            }
          ]
        }
      ]
    }
  }

  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    pageSize: 'A3',
    pageOrientation: 'landscape',
    width: ['4%', '16%', '24%', '6%', '8%', '8%', '7%', '7%', '10%', '10%'],
    pageMargins: [20, 130, 20, 60],
    header,
    tableTitle,
    tableBody,
    footer,
    tableStyle: styles,
    data: listData
  }

  return (
    <RepeatReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  listData: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired,
  storeInfo: PropTypes.object
}

export default PrintPDF
