/**
 * Created by Veirry on 29/09/2017.
 */
import React from 'react'
import { saveAs } from 'file-saver'
import * as Excel from 'exceljs/dist/exceljs.min.js'
import PropTypes from 'prop-types'
import { Table, Button, Row, Col, Modal } from 'antd'
import moment from 'moment'
import Filter from './Filter'
// webpack.config.js, exceljs compiled warning

const warning = Modal.warning
const dateFormat = 'DD-MM-YYYY'

const pdfMake = require('pdfmake/build/pdfmake.js')
const pdfFonts = require('pdfmake/build/vfs_fonts.js')
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const Browse = ({ listOut, company, user, productCode, fromDate, toDate, ...browseProps }) => {
  let qtyTotal = listOut.reduce((cnt, o) => cnt + o.qtyOut, 0)
  let grandTotal = listOut.reduce((cnt, o) => cnt + o.amount, 0)
  const workbook = new Excel.Workbook()
  workbook.creator = 'dmiPOS'
  workbook.created = new Date()
  workbook.views = [
    {
      x: 0, y: 0, width: 10000, height: 20000, firstSheet: 0, activeTab: 1, visibility: 'visible',
    },
  ]
  let sheet = workbook.addWorksheet('POS 1',
    { pageSetup: { paperSize: 9, orientation: 'portrait' } })

  const createPdfLineItems = (e) => {
    const headers = {
      top: {
        col_1: { fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' },
        col_2: { fontSize: 12, text: 'PART_NUMBER', style: 'tableHeader', alignment: 'center' },
        col_3: { fontSize: 12, text: 'DESKRIPSI', style: 'tableHeader', alignment: 'center' },
        col_4: { fontSize: 12, text: 'QTY', style: 'tableHeader', alignment: 'center' },
        col_5: { fontSize: 12, text: 'HARGA POKOK', style: 'tableHeader', alignment: 'center' },
        col_6: { fontSize: 12, text: 'AMOUNT HPP', style: 'tableHeader', alignment: 'center' },
      },
    }
    const rows = e
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
        body.push(row)
      }
    }
    let count = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let totalDisc = (data.price * data.qty) - data.total
        let row = new Array()
        row.push({ text: count, alignment: 'center', fontSize: 11 })
        row.push({ text: data.productCode.toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: data.productName.toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: data.qtyOut.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: data.costPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: data.amount.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        body.push(row)
      }
      count = count + 1
    }
    let totalRow = []
    totalRow.push({ text: 'Grand Total', colSpan: 3, alignment: 'center', fontSize: 12 })
    totalRow.push({})
    totalRow.push({})
    totalRow.push({ text: `${qtyTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    totalRow.push({})
    totalRow.push({ text: `${grandTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    body.push(totalRow)
    return body
  }
  const handleExcel = () => {
    if (fromDate === null && toDate === null) {
      warning({
        title: 'Parameter cannot be null',
        content: 'your Trans Date paramater probably not set...',
      })
    } else if (listOut.length === 0) {
      warning({
        title: 'Parameter cannot be null',
        content: 'your Trans Date paramater probably not set...',
      })
    } else {
      sheet.getCell('F2').font = {
        name: 'Courier New',
        family: 4,
        size: 12,
        underline: true,
      }
      sheet.getCell('F3').font = {
        name: 'Courier New',
        family: 4,
        size: 12,
      }
      sheet.getCell('F4').font = {
        name: 'Courier New',
        family: 4,
        size: 12,
      }
      sheet.getCell('J5').font = {
        name: 'Courier New',
        family: 4,
        size: 10,
      }
      for (let n = 0; n <= listOut.length; n++) {
        for (let m = 65; m < 74; m++) {
          let o = 9 + n
          sheet.getCell(`${String.fromCharCode(m)}${o}`).font = {
            name: 'Times New Roman',
            family: 4,
            size: 10,
          }
        }
      }
      let header = ['NO.', '', 'PART_NO', 'DESKRIPSI', 'QTY', 'HPP', 'AMOUNT']
      let footer = [
        '',
        '',
        '',
        '',
        'GRAND TOTAL',
        `${qtyTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
        `${grandTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`]
      for (let m = 65; m < 72; m++) {
        let o = 7
        let count = m - 65
        sheet.getCell(`${String.fromCharCode(m)}${o}`).font = {
          name: 'Courier New',
          family: 4,
          size: 11,
        }
        sheet.getCell(`${String.fromCharCode(m)}${o}`).alignment = { vertical: 'middle', horizontal: 'center' }
        sheet.getCell(`${String.fromCharCode(m)}${o}`).value = `${header[count]}`
      }

      for (let n = 0; n < listOut.length; n++) {
        let m = 9 + n
        sheet.getCell(`A${m}`).value = `${parseInt(n+1)}`
        sheet.getCell(`A${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`B${m}`).value = '.'
        sheet.getCell(`B${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
        sheet.getCell(`C${m}`).value = `${listOut[n].productCode}`
        sheet.getCell(`C${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
        sheet.getCell(`D${m}`).value = `${listOut[n].productName}`
        sheet.getCell(`D${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`E${m}`).value = `${(parseFloat(listOut[n].qtyOut)).toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
        sheet.getCell(`E${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`F${m}`).value = `${(parseFloat(listOut[n].costPrice)).toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
        sheet.getCell(`F${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`G${m}`).value = `${(parseFloat(listOut[n].amount)).toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
        sheet.getCell(`G${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
      }

      for (let m = 65; m < 72; m++) {
        let n = listOut.length + 10
        let count = m - 65
        sheet.getCell(`C${n}`).font = {
          name: 'Courier New',
          family: 4,
          size: 11,
        }
        sheet.getCell(`${String.fromCharCode(m + 3)}${n}`).font = {
          name: 'Times New Roman',
          family: 4,
          size: 10,
        }
        sheet.getCell(`${String.fromCharCode(m)}${n}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`${String.fromCharCode(m)}${n}`).value = `${footer[count]}`
      }

      sheet.getCell('F2').alignment = { vertical: 'middle', horizontal: 'center' }
      sheet.getCell('F2').value = 'LAPORAN ADJUST OUT PER PART'
      sheet.getCell('F3').alignment = { vertical: 'middle', horizontal: 'center' }
      sheet.getCell('F3').value = `${localStorage.getItem('company') ? JSON.parse(localStorage.getItem('company'))[0].miscName : ''}`
      sheet.getCell('F4').alignment = { vertical: 'middle', horizontal: 'center' }
      sheet.getCell('F4').value = `PERIODE : ${fromDate ? fromDate : 'BEGIN'} TO ${toDate ? toDate : moment().format(dateFormat)}`
      sheet.getCell('J5').alignment = { vertical: 'middle', horizontal: 'right' }
      workbook.xlsx.writeBuffer().then(function (data) {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        saveAs(blob, `ADJUST-summary${moment().format('YYYYMMDD')}.xlsx`)
      })
    }
  }
  const handlePdf = () => {
    let body = createPdfLineItems(listOut)
    let docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [50, 130, 50, 60],
      header : {
        stack: [
          {
            stack: [
              {
                stack: [
                  {
                    text: company[0].miscName,
                    fontSize: 11,
                    alignment: 'left',
                  },
                  {
                    text: company[0].miscDesc,
                    fontSize: 11,
                    alignment: 'left',
                  },
                  {
                    text: company[0].miscVariable,
                    fontSize: 11,
                    alignment: 'left',
                  },
                ],
              },
              {
                columns: [
                  {
                    text: `\nPERIODE: ${fromDate} TO ${toDate}`,
                    fontSize: 12,
                    alignment: 'left',
                  },
                ],
              },
              {
                text: 'LAPORAN ADJUST OUT PER PART',
                style: 'header',
                fontSize: 18,
                alignment: 'center',
              },
              {
                canvas: [{ type: 'line', x1: 0, y1: 5, x2: 813-2*40, y2: 5, lineWidth: 0.5 }]
              },
            ],
          },
        ],
        margin: [30, 12, 12, 30],
      },
      content: [
        {
          writable: true,
          table: {
            widths: ['6%', '18%', '28%', '15%', '15%', '15%' ],
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
              columns: [
                {
                  text: `Date: ${moment().format('DD-MM-YYYY hh:mm:ss')}`,
                  margin: [0, 0, 0, 0],
                  fontSize: 9,
                  alignment: 'center',
                },
                {
                  text: `Dicetak oleh: ${user.username}`,
                  margin: [0, 0, 0, 0],
                  fontSize: 9,
                  alignment: 'center',
                },
                {
                  text: `page: ${currentPage.toString()} of ${pageCount}`,
                  fontSize: 9,
                  margin: [0, 0, 0, 0],
                  alignment: 'center',
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
  const filterProps = {
    fromDate,
    toDate,
    ...browseProps
  }
  const columns = [
    {
      title: 'Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '155px',
    },
    {
      title: 'Description',
      dataIndex: 'productName',
      key: 'productName',
      width: '200px',
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '175px',
    },
    {
      title: 'QTY',
      dataIndex: 'qtyOut',
      key: 'qtyOut',
      width: '100px',
    },
    {
      title: 'Price',
      dataIndex: 'costPrice',
      key: 'costPrice',
      width: '100px',
    },
    {
      title: 'Total',
      dataIndex: 'amount',
      key: 'amount',
      width: '100px',
    },
  ]
  return (
    <div>
      <Row>
        <Col xs={24} sm={24} md={15} lg={15} xl={15} style={{ marginBottom: '10px' }}>
          <Filter {...filterProps} />
        </Col>
        <Col xs={24} sm={24} md={9} lg={9} xl={9}>
          <Button size="large" icon="file-excel" onClick={() => handleExcel()} style={{ backgroundColor: '#ffffff', borderColor: '#207347', borderWidth: '3px',color: '#000000', height: '42px', width: '42px', fontSize: 'x-large', float: 'right', marginBottom: '10px' }} />
          <Button size="large" icon="file-pdf" onClick={() => handlePdf()} style={{ backgroundColor: '#000000', borderColor: '#ff0000', borderWidth: '3px', color: 'white', height: '42px', width: '42px', fontSize: 'x-large', float: 'right', marginBottom: '10px' }} />
        </Col>
      </Row>
      <Table
        style={{ clear: 'both' }}
        {...browseProps}
        bordered
        scroll={{ x: 890, y: 300 }}
        columns={columns}
        simple
        size="small"
        rowKey={record => record.productCode}
      />
    </div>
  )
}

Browse.propTypes = {
  location: PropTypes.isRequired,
  onExportExcel: PropTypes.func.isRequired,
  listOut: PropTypes.isRequired,
}

export default Browse
