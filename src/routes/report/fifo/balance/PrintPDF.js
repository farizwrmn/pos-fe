/**
 * Created by boo on 9/19/17.
 */
import React from 'react'
import { Icon, Button, Modal } from 'antd'
import moment from 'moment'
import 'moment/locale/id'
import PropTypes from 'prop-types'

moment.locale('id')

const PrintPDF = ({ user, listRekap, dataSource, storeInfo, period, year }) => {
  const pdfMake = require('pdfmake/build/pdfmake.js')
  const pdfFonts = require('pdfmake/build/vfs_fonts.js')
  const warning = Modal.warning
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  let count = listRekap.reduce((cnt, o) => cnt + o.count, 0)
  let amount = listRekap.reduce((cnt, o) => cnt + o.amount, 0)

  const createPdfLineItems = (tabledata) => {
    const headers = {
      top: {
        col_1: { fontSize: 12, text: 'NO', alignment: 'center' },
        col_2: { fontSize: 12, text: 'PRODUCT', alignment: 'center' },
        col_3: { fontSize: 12, text: 'HARGA POKOK', alignment: 'center' },
        col_4: { fontSize: 12, text: 'SALDO', alignment: 'center' },
        col_5: { fontSize: 12, text: 'JUMLAH', alignment: 'center' },
      },
    }
    const rows = tabledata
    let body = []
    for (let key in headers) {
      if (headers.hasOwnProperty(key)) {
        let header = headers[key]
        let row = []
        row.push(header.col_1)
        row.push(header.col_2)
        row.push(header.col_3)
        row.push(header.col_4)
        row.push(header.col_5)
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
        row.push({ text: (parseFloat(data.amount) / parseFloat(data.count)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: data.count.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: data.amount.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        body.push(row)
      }
      counter += 1
    }

    let totalRow = []
    totalRow.push({})
    totalRow.push({})
    totalRow.push({ text: 'Grand Total', colSpan: 1, alignment: 'center', fontSize: 12 })
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
        pageSize: 'A4',
        pageOrientation: 'portrait',
        pageMargins: [50, 130, 50, 60],
        header: {
          stack: [
            {
              stack: [
                {
                  stack: storeInfo.stackHeader01,
                },
                {
                  text: 'LAPORAN SISA SALDO STOCK',
                  style: 'header',
                  fontSize: 18,
                  alignment: 'center',
                },
                {
                  canvas: [{ type: 'line', x1: 0, y1: 5, x2: 813 - (2 * 40), y2: 5, lineWidth: 0.5 }],
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
              widths: ['5%', '40%', '*', '10%', '25%'],
              headerRows: 1,
              body,
            },
            layout: 'noBorders',
          },
        ],
        footer: (currentPage, pageCount) => {
          return {
            margin: [50, 30, 50, 0],
            stack: [
              {
                canvas: [{ type: 'line', x1: 0, y1: 5, x2: 813 - (2 * 40), y2: 5, lineWidth: 0.5 }],
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
  listRekap: PropTypes.array,
  dataSource: PropTypes.array,
  user: PropTypes.object.isRequired,
  period: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  storeInfo: PropTypes.object.isRequired,
}

export default PrintPDF
