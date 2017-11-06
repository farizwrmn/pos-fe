import React from 'react'
import { Icon, Button, Modal } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'

const PrintPDF = ({ user, listTrans, dataSource, storeInfo, fromDate, toDate }) => {

  const pdfMake = require('pdfmake/build/pdfmake.js')
  const pdfFonts = require('pdfmake/build/vfs_fonts.js')
  const warning = Modal.warning
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  let productTotal = listTrans.reduce((cnt, o) => cnt + o.product, 0)
  let serviceTotal = listTrans.reduce((cnt, o) => cnt + o.service, 0)

  const createPdfLineItems = (tabledata) => {
    const headers = {
      top: {
        col_1: { fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' },
        col_2: { fontSize: 12, text: 'DATE', style: 'tableHeader', alignment: 'center' },
        col_3: { fontSize: 12, text: 'TRANS NO', style: 'tableHeader', alignment: 'center' },
        col_4: { fontSize: 12, text: 'PRODUCT', style: 'tableHeader', alignment: 'right' },
        col_5: { fontSize: 12, text: 'SERVICE', style: 'tableHeader', alignment: 'right' },
        col_6: { fontSize: 12, text: 'TOTAL', style: 'tableHeader', alignment: 'right' },
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
        row.push(header.col_6)        
        body.push(row)
      }
    }

    let count = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = new Array()
        row.push({ text: count, alignment: 'center', fontSize: 11 })
        row.push({ text: data.transNo.toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: moment(data.transDate).format('DD-MMM-YYYY').toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2}), alignment: 'left', fontSize: 11 })
        row.push({ text: data.product.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2}), alignment: 'right', fontSize: 11 })
        row.push({ text: data.service.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2}), alignment: 'right', fontSize: 11 })
        row.push({ text: (data.product + data.service).toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2}), alignment: 'right', fontSize: 11 })
        body.push(row)
      }
      count += 1
    }

    let totalRow = []
    totalRow.push({ text: 'Grand Total', colSpan: 3, alignment: 'center', fontSize: 12 })
    totalRow.push({})
    totalRow.push({})
    totalRow.push({ text: `${productTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${serviceTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${(productTotal + serviceTotal).toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, alignment: 'right', fontSize: 12 })
    body.push(totalRow)
    return body
  }

  const handlePDF = () => {
    if (fromDate === '' && toDate === '') {
      warning({
        title: 'Parameter cannot be null',
        content: 'your Trans Date paramater probably not set...',
      })
    } else if (listTrans.length === 0) {
      warning({
        title: 'Parameter cannot be null',
        content: 'your Trans Date paramater probably not set...',
      })
    } else {
      let body = createPdfLineItems(listTrans)
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
                  text: 'LAPORAN JASA + PART PER FAKTUR',
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
              widths: ['6%', '22%', '21%', '17%', '17%', '17%'],
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
      let isChrome = !!window.chrome
      let isMozilla = !!window.mozilla
      if (isChrome) {
        pdfMake.createPdf(docDefinition).open()
      } else {
        pdfMake.createPdf(docDefinition).download()
      }
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
  listTrans: PropTypes.array,
  app: PropTypes.object,
  user: PropTypes.object.isRequired,
  dataSource: PropTypes.object.isRequired,
  storeInfo: PropTypes.object.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired,
}

export default PrintPDF
