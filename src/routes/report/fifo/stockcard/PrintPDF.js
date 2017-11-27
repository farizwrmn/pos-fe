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

  let outJSON = listRekap

  let groupBy = (xs, key) => {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x)
      return rv
    }, {})
  }
  let groubedByTeam = groupBy(outJSON, 'productCode')
  let arr = Object.keys(groubedByTeam).map((index) => groubedByTeam[index])

  const createPdfLineItems = (tabledata) => {
    let inQty = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.pQty) || 0), 0)
    let inPrice = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.pPrice) || 0), 0)
    let inAmount = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.pAmount) || 0), 0)
    let outQty = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.sQty) || 0), 0)
    let outPrice = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.sPrice) || 0), 0)
    let outAmount = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.sAmount) || 0), 0)
    const headers = {
      top: {
        col_1: { fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' },
        col_2: { fontSize: 12, text: 'DATE', style: 'tableHeader', alignment: 'center' },
        col_3: { fontSize: 12, text: 'TRANS', style: 'tableHeader', alignment: 'center' },
        col_4: { fontSize: 12, text: 'TYPE', style: 'tableHeader', alignment: 'center' },
        col_5: { fontSize: 12, text: 'IN', style: 'tableHeader', alignment: 'center' },
        col_6: { fontSize: 12, text: 'PRICE', style: 'tableHeader', alignment: 'center' },
        col_7: { fontSize: 12, text: 'AMOUNT', style: 'tableHeader', alignment: 'center' },
        col_8: { fontSize: 12, text: 'OUT', style: 'tableHeader', alignment: 'center' },
        col_9: { fontSize: 12, text: 'PRICE', style: 'tableHeader', alignment: 'center' },
        col_10: { fontSize: 12, text: 'AMOUNT', style: 'tableHeader', alignment: 'center' },
        col_11: { fontSize: 12, text: 'COUNT', style: 'tableHeader', alignment: 'center' },
        col_12: { fontSize: 12, text: 'AMOUNT', style: 'tableHeader', alignment: 'center' }
      },
    }

    const rows = tabledata
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
        row.push(header.col_9)
        row.push(header.col_10)
        row.push(header.col_11)
        row.push(header.col_12)
        body.push(row)
      }
    }
    let countQtyValue = 0
    let countAmountValue = 0
    let counter = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        countQtyValue = (parseFloat(countQtyValue) || 0) + (parseFloat(data.pQty) || 0) - (parseFloat(data.sQty) || 0)
        countAmountValue = (parseFloat(countAmountValue) || 0) + (parseFloat(data.sAmount) || 0) - (parseFloat(data.sAmount) || 0)
        let row = new Array()
        row.push({ text: counter, alignment: 'center', fontSize: 11 })
        row.push({ text: moment(data.transDate).format('DD-MMM-YYYY'), alignment: 'left', fontSize: 11 })
        row.push({ text: data.transNo.toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: data.transType.toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: (parseFloat(data.pQty) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: (parseFloat(data.pPrice) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: (parseFloat(data.pAmount) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: (parseFloat(data.sQty) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: (parseFloat(data.sPrice) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: (parseFloat(data.sAmount) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: countQtyValue.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: ((parseFloat(data.pAmount) || 0) - (parseFloat(data.sAmount) || 0)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        body.push(row)
      }
      counter = counter + 1
    }

    let totalRow = []
    totalRow.push({ text: 'Grand Total', colSpan: 4, alignment: 'center', fontSize: 12 })
    totalRow.push({})
    totalRow.push({})
    totalRow.push({})
    totalRow.push({ text: `${inQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    totalRow.push({})
    totalRow.push({ text: `${inAmount.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${outQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    totalRow.push({})
    totalRow.push({ text: `${outAmount.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    totalRow.push({})
    totalRow.push({ text: `${(inAmount - outAmount).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
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
      let contentPdf = []
      for (let i = 0; i < arr.length; i += 1) {
        contentPdf.push(
          { text: `Product : ${arr[i][0].productCode} - ${arr[i][0].productName}`, fontSize: 14, bold: true, margin: [0, 20, 0, 8] },
          {
            writable: true,
            table: {
              widths: ['4%', '8%', '12%', '5%', '6%', '10%', '10%', '6%', '10%', '10%', '7%', '12%'],
              headerRows: 1,
              body: createPdfLineItems(arr[i]),
            },
            layout: 'noBorder',
          })
      }
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
                  text: 'LAPORAN KARTU STOK FIFO',
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
        content: contentPdf,
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
      try {
        pdfMake.createPdf(docDefinition).open()      
      } catch (e) {
        alert(e)
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
  listRekap: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  period: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  storeInfo: PropTypes.object,
}

export default PrintPDF
