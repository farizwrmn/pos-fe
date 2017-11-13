/**
 * Created by boo on 9/19/17.
 */
import React from 'react'
import { Icon, Button, Modal } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'

const PrintPDF = ({ user, listRekap, dataSource, storeInfo, period, year }) => {
  const pdfMake = require('pdfmake/build/pdfmake.js')
  const pdfFonts = require('pdfmake/build/vfs_fonts.js')
  const warning = Modal.warning
  pdfMake.vfs = pdfFonts.pdfMake.vfs

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

  const createPdfLineItems = (tabledata) => {
    const headersGroup = {
      top: {
        col_1: { fontSize: 12, text: 'NO', rowSpan: 1, alignment: 'center' },
        col_2: { fontSize: 12, text: 'PRODUCT', rowSpan: 1, alignment: 'center' },
        col_3: { fontSize: 12, text: 'SALDO AWAL', colSpan: 2, alignment: 'center' },
        col_4: {},
        col_5: { fontSize: 12, text: 'PEMBELIAN', colSpan: 2, alignment: 'center' },
        col_6: {},
        col_7: { fontSize: 12, text: 'ADJ IN + RETUR JUAL', colSpan: 2, alignment: 'center' },
        col_8: {},
        col_9: { fontSize: 12, text: 'PENJUALAN', colSpan: 2, alignment: 'center' },
        col_10: {},
        col_11: { fontSize: 12, text: 'ADJ OUT + RETUR BELI', colSpan: 2, alignment: 'center' },
        col_12: {},
        col_13: { fontSize: 12, text: 'SALDO AKHIR', colSpan: 2, alignment: 'center' },
        col_14: {},
      },
    }
    const headers = {
      top: {
        col_1: '',
        col_2: '',
        col_3: { fontSize: 12, text: 'QTY', alignment: 'center' },
        col_4: { fontSize: 12, text: 'AMOUNT HPP', alignment: 'center' },
        col_5: { fontSize: 12, text: 'QTY', style: 'tableHeader', alignment: 'center' },
        col_6: { fontSize: 12, text: 'AMOUNT HPP', alignment: 'center' },
        col_7: { fontSize: 12, text: 'QTY', alignment: 'center' },
        col_8: { fontSize: 12, text: 'AMOUNT HPP', alignment: 'center' },
        col_9: { fontSize: 12, text: 'QTY', alignment: 'center' },
        col_10: { fontSize: 12, text: 'AMOUNT HPP', alignment: 'center' },
        col_11: { fontSize: 12, text: 'QTY', alignment: 'center' },
        col_12: { fontSize: 12, text: 'AMOUNT HPP', alignment: 'center' },
        col_13: { fontSize: 12, text: 'QTY', alignment: 'center' },
        col_14: { fontSize: 12, text: 'AMOUNT HPP', alignment: 'center' },
      },
    }

    const rows = tabledata
    let body = []
    for (let key in headersGroup) {
      if (headersGroup.hasOwnProperty(key)) {
        let header = headersGroup[key]
        let row = []
        row.push(header.col_1)
        row.push(header.col_2)
        row.push(header.col_3)
        row.push(header.col_4)
        row.push(header.col_5)
        row.push(header.col_6)
        row.push(header.col_7)
        row.push(header.col_8)
        row.push(header.col_9)
        row.push(header.col_10)
        row.push(header.col_11)
        row.push(header.col_12)
        row.push(header.col_13)
        row.push(header.col_14)
        body.push(row)
      }
    }
    for (let key in headers) {
      if (headers.hasOwnProperty(key)) {
        let header = headers[key]
        let row = []
        row.push(header.col_1)
        row.push(header.col_2)
        row.push(header.col_3)
        row.push(header.col_4)
        row.push(header.col_5)
        row.push(header.col_6)
        row.push(header.col_7)
        row.push(header.col_8)
        row.push(header.col_9)
        row.push(header.col_10)
        row.push(header.col_11)
        row.push(header.col_12)
        row.push(header.col_13)
        row.push(header.col_14)
        body.push(row)
      }
    }


    let counter = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = []
        row.push({ text: counter, alignment: 'center', fontSize: 11 })
        row.push({ text: data.productCode.toString(), alignment: 'left', fontSize: 11 })
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
      }
      counter += 1
    }

    let totalRow = []
    totalRow.push({})
    totalRow.push({ text: 'Grand Total', colSpan: 1, alignment: 'center', fontSize: 12 })
    totalRow.push({ text: `${beginQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${beginPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${purchaseQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${purchasePrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${adjInQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${adjInPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${posQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${posPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${adjOutQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${adjOutPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${count.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${amount.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    body.push(totalRow)
    return body
  }

  const handlePDF = () => {
    if (period === '' && year === '') {
      warning({
        title: 'Parameter cannot be null',
        content: 'your Trans Date paramater probably not set...',
      })
    } else if (listRekap.length === 0) {
      warning({
        title: 'Parameter cannot be null',
        content: 'your Trans Date paramater probably not set...',
      })
    } else {
      let body = createPdfLineItems(listRekap)
      let docDefinition = {
        pageSize: 'A3',
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
                  text: 'LAPORAN REKAP FIFO',
                  style: 'header',
                  fontSize: 18,
                  alignment: 'center',
                },
                {
                  canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1100, y2: 5, lineWidth: 0.5 }],
                },
                {
                  columns: [
                    {
                      text: `\nPERIODE: ${moment(period, 'MM').format('MMMM').concat('-', year)}`,
                      fontSize: 12,
                      alignment: 'left',
                    },
                    {
                      text: '',
                      fontSize: 12,
                      alignment: 'center',
                    },
                    {
                      text: '',
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
              widths: ['4%', '18%', '5%', '8%', '5%', '8%', '5%', '8%', '5%', '8%', '5%', '8%', '5%', '8%'],
              headerRows: 1,
              body,
            },
            layout: 'noBorder',
          },
        ],
        footer: (currentPage, pageCount) => {
          return {
            margin: [50, 30, 50, 0],
            stack: [
              {
                canvas: [{ type: 'line', x1: 0, y1: -8, x2: 820 - (2 * 40), y2: -8, lineWidth: 0.5 }],
              },
              {
                columns: [
                  {
                    text: `Tanggal cetak: ${moment().format('LLLL')}`,
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
    <Button type="dashed"
      size="large"
      className="button-width02 button-extra-large bgcolor-blue"
      onClick={() => handlePDF(dataSource)}
    >
      <Icon type="file-pdf" className="icon-large" />
    </Button>
  )
}

PrintPDF.propTypes = {
  listRekap: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  period: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  storeInfo: PropTypes.object,
}

export default PrintPDF
