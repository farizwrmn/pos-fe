import React from 'react'
import { Icon, Button, Modal } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'

const PrintPDF = ({ user, list, dataSource, storeInfo, fromDate, toDate, productCode }) => {

  const pdfMake = require('pdfmake/build/pdfmake.js')
  const pdfFonts = require('pdfmake/build/vfs_fonts.js')
  const warning = Modal.warning
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  let qtyTotal = list.reduce((cnt, o) => cnt + parseFloat(o.Qty), 0)
  let grandTotal = list.reduce((cnt, o) => cnt + parseFloat(o.Total), 0)
  let discountTotal = list.reduce((cnt, o) => cnt + parseFloat(o.discountTotal), 0)
  let dppTotal = list.reduce((cnt, o) => cnt + parseFloat(o.Total) - parseFloat(o.discountTotal), 0)
  let nettoTotal = list.reduce((cnt, o) => cnt + parseFloat(o.Total) - parseFloat(o.discountTotal), 0)

  const createPdfLineItems = (tabledata) => {
    const headers = {
      top: {
        col_1: { fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' },
        col_2: { fontSize: 12, text: 'PRODUK', style: 'tableHeader', alignment: 'center' },
        col_3: { fontSize: 12, text: 'QTY', style: 'tableHeader', alignment: 'center' },
        col_4: { fontSize: 12, text: 'TOTAL', style: 'tableHeader', alignment: 'center' },
        col_5: { fontSize: 12, text: 'DISKON', style: 'tableHeader', alignment: 'center' },
        col_6: { fontSize: 12, text: 'DPP', style: 'tableHeader', alignment: 'center' },
        col_7: { fontSize: 12, text: 'PPN', style: 'tableHeader', alignment: 'center' },
        col_8: { fontSize: 12, text: 'NETTO', style: 'tableHeader', alignment: 'center' },
      },
    }

    const rows = list
    let body = []
    for (let key in headers) {
      if (headers.hasOwnProperty(key)) {
        let header = headers[key]
        let row = new Array()
        row.push(header.col_1)
        row.push(header.col_2)
        row.push(header.col_3)
        row.push(header.col_4)
        row.push(header.col_5)
        row.push(header.col_6)
        row.push(header.col_7)
        row.push(header.col_8)
        body.push(row)
      }
    }

    let ppn = 0
    let count = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let totalDisc = (data.price * data.qty) - data.total
        let row = new Array()
        row.push({ text: count, alignment: 'center', fontSize: 11 })
        row.push({ text: data.productCode.toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: data.Qty.toString(), alignment: 'right', fontSize: 11 })
        row.push({ text: data.Total.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2}), alignment: 'right', fontSize: 11 })
        row.push({ text: data.discountTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2}), alignment: 'right', fontSize: 11 })
        row.push({ text: `${(parseFloat(data.Total) - parseFloat(data.discountTotal)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2})}`, alignment: 'right', fontSize: 11 })
        row.push({ text: `${ppn.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2})}`, alignment: 'right', fontSize: 11 })
        row.push({ text: `${(parseFloat(data.Total) - parseFloat(data.discountTotal)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2})}`, alignment: 'right', fontSize: 11 })
        body.push(row)
      }
      count = count + 1
    }

    let totalRow = []
    totalRow.push({ text: 'Grand Total', colSpan: 2, alignment: 'center', fontSize: 12 })
    totalRow.push({})
    totalRow.push({ text: `${qtyTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${grandTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${discountTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${dppTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${ppn.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 11 })
    totalRow.push({ text: `${nettoTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    body.push(totalRow)
    return body
  }
  const handlePDF = () => {
    if (fromDate === '' && toDate === '') {
      warning({
        title: 'Parameter cannot be null',
        content: 'your Trans Date paramater probably not set...',
      })
    } else if (list.length === 0) {
      warning({
        title: 'Parameter cannot be null',
        content: 'your Trans Date paramater probably not set...',
      })
    } else {
      let body = createPdfLineItems(list)
      let docDefinition = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [50, 130, 50, 60],
        header: {
          stack: [
            {
              stack: [
                {
                  stack: storeInfo.stackHeader01,
                },
                {
                  text: 'LAPORAN REKAP PENJUALAN',
                  style: 'header',
                  fontSize: 18,
                  alignment: 'center',
                },
                {
                  canvas: [{ type: 'line', x1: 0, y1: 5, x2: 820 - 2 * 40, y2: 5, lineWidth: 0.5 }]
                },
                {
                  columns: [
                    {
                      text: `\nPERIODE: ${moment(fromDate).format('DD-MMM-YYYY')}  TO  ${moment(toDate).format('DD-MMM-YYYY')}`,
                      fontSize: 12,
                      alignment: 'left',
                      render: text => `${moment(text).format('LL ')}`,
                    },
                    {
                      text: '',
                      fontSize: 12,
                      alignment: 'center',
                    },
                    {
                      text: `\nKODE PRODUK: ${productCode}`,
                      fontSize: 12,
                      alignment: 'right',
                    },
                  ],
                },
              ],
            },
          ],
          margin: [50, 12, 50, 30],
        },
        content: [
          {
            writable: true,
            table: {
              widths: ['6%', '21%', '6%', '15%', '13%', '13%', '13%', '13%'],
              headerRows: 1,
              body: body,
            },
            layout: 'noBorder',
          },
        ],
        footer: function (currentPage, pageCount) {
          return {
            margin: [50, 30, 50, 0],
            stack: [
              {
                canvas: [{ type: 'line', x1: 0, y1: -8, x2: 820 - 2 * 40, y2: -8, lineWidth: 0.5 }]
              },
              {
                columns: [
                  {
                    text: `Tanggal cetak: ${moment().format('DD-MMM-YYYY hh:mm:ss')}`,
                    margin: [0, 0, 0, 0],
                    fontSize: 9,
                    alignment: 'left',
                  },
                  {
                    text: `Dicetak oleh: ${user.username}`,
                    margin: [0, 0, 0, 0],
                    fontSize: 9,
                    alignment: 'center',
                  },
                  {
                    text: `Halaman: ${currentPage.toString()} dari ${pageCount}`,
                    fontSize: 9,
                    margin: [0, 0, 0, 0],
                    alignment: 'right',
                  },
                ],
              },
            ],
          }
        },
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10],
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5],
          },
          tableExample: {
            margin: [0, 5, 0, 15],
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black',
          },
        },
      }
      pdfMake.createPdf(docDefinition).open()
    }
  }

  return (
    <Button type="dashed" size="large"
            className="button-width02 button-extra-large bgcolor-blue"
            onClick={() => handlePDF(dataSource)}
    >
      <Icon type="file-pdf" className="icon-large" />
    </Button>
  )
}

PrintPDF.propTypes = {
  list: PropTypes.array,
  app: PropTypes.object,
}

export default PrintPDF
