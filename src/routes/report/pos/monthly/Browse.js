/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Row, Col, Modal } from 'antd'
import moment from 'moment'
import Filter from './Filter'
import * as Excel from 'exceljs/dist/exceljs.min.js'
// webpack.config.js, exceljs compiled warning
import { saveAs } from 'file-saver'

const warning = Modal.warning

const pdfMake = require('pdfmake/build/pdfmake.js')
const pdfFonts = require('pdfmake/build/vfs_fonts.js')
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const Browse = ({ list, company, productCode, fromDate, toDate, ...browseProps }) => {
  var qtyTotal = list.reduce(function(cnt, o) { return cnt + o.Qty }, 0)
  var grandTotal = list.reduce(function(cnt, o) { return cnt + o.Total }, 0)
  var discountTotal = list.reduce(function(cnt, o) { return cnt + o.discountTotal }, 0)
  var dppTotal = list.reduce(function(cnt, o) { return cnt + o.Total - o.discountTotal }, 0)
  var nettoTotal = list.reduce(function(cnt, o) { return cnt + o.Total - o.discountTotal }, 0)
  const workbook = new Excel.Workbook()
  workbook.creator = 'dmiPOS';
  workbook.created = new Date(1985, 8, 30);
  workbook.lastPrinted = new Date(2016, 9, 27);
  workbook.views = [
    {
      x: 0, y: 0, width: 10000, height: 20000, firstSheet: 0, activeTab: 1, visibility: 'visible',
    },
  ]
  var sheet = workbook.addWorksheet('POS 1',
    { pageSetup: { paperSize: 9, orientation: 'portrait' } })

  const createPdfLineItems = (e) => {
    const headers = {
      top: {
        col_1: { fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' },
        col_2: { fontSize: 12, text: 'PRODUCT', style: 'tableHeader', alignment: 'center' },
        col_3: { fontSize: 12, text: 'QTY', style: 'tableHeader', alignment: 'center' },
        col_4: { fontSize: 12, text: 'TOTAL', style: 'tableHeader', alignment: 'center' },
        col_5: { fontSize: 12, text: 'DISKON', style: 'tableHeader', alignment: 'center' },
        col_6: { fontSize: 12, text: 'DPP', style: 'tableHeader', alignment: 'center' },
        col_7: { fontSize: 12, text: 'PPN', style: 'tableHeader', alignment: 'center' },
        col_8: { fontSize: 12, text: 'NETTO', style: 'tableHeader', alignment: 'center' },
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
        row.push(header.col_7)
        row.push(header.col_8)
        body.push(row)
      }
    }
    let ppn = 0
    let count = 1
    for (var key in rows) {
      if (rows.hasOwnProperty(key)) {
        var data = rows[key]
        var totalDisc = (data.price * data.qty) - data.total
        var row = new Array()
        row.push( { text: count, alignment: 'center', fontSize: 11 } );
        row.push( { text: data.productCode.toString(), alignment: 'left', fontSize: 11 } );
        row.push( { text: data.Qty.toString(), alignment: 'right', fontSize: 11 } );
        row.push( { text: data.Total.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2}), alignment: 'right', fontSize: 11 } )
        row.push( { text: data.discountTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2}), alignment: 'right', fontSize: 11 })
        row.push( { text: `${(data.Total - data.discountTotal).toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, alignment: 'right', fontSize: 11 })
        row.push( { text: `${ppn.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, alignment: 'right', fontSize: 11 })
        row.push( { text: `${(data.Total - data.discountTotal).toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, alignment: 'right', fontSize: 11 })
        body.push(row)
      }
      count = count + 1
    }
    let totalRow = []
    totalRow.push({ text: 'Grand Total', colSpan: 2, alignment: 'center', fontSize: 12 })
    totalRow.push({})
    totalRow.push({ text: `${qtyTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${grandTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${discountTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${dppTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${ppn.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, alignment: 'right', fontSize: 11 })
    totalRow.push({ text: `${nettoTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, alignment: 'right', fontSize: 12 })
    body.push(totalRow)
    return body
  }

  const handleExcel = () => {
    if (fromDate === '' && toDate === '') {
      warning({
        title: 'Parameter cannot be null',
        content: 'your CreateAt paramater probably not set...',
      })
    } else if (list.length === 0) {
      warning({
        title: 'Parameter cannot be null',
        content: 'your CreateAt paramater probably not set...',
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
      for (var n = 0; n <= list.length; n++) {
        for (var m = 65; m < 74; m++) {
          var o = 9 + n
          sheet.getCell(`${String.fromCharCode(m)}${o}`).font = {
            name: 'Times New Roman',
            family: 4,
            size: 10,
          }
        }
      }
      var header = ['NO.', '', 'PRODUCT', 'QTY', 'TOTAL', 'DISKON', 'DPP', 'PPN', 'NETTO']
      var footer = [
        '',
        '',
        'GRAND TOTAL',
        `${qtyTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
        `${grandTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
        `${discountTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
        `${dppTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
        0,
        `${nettoTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`]
      for (var m = 65; m < 74; m++) {
        var o = 7
        var count = m - 65
        sheet.getCell(`${String.fromCharCode(m)}${o}`).font = {
          name: 'Courier New',
          family: 4,
          size: 11,
        }
        sheet.getCell(`${String.fromCharCode(m)}${o}`).alignment = { vertical: 'middle', horizontal: 'center' }
        sheet.getCell(`${String.fromCharCode(m)}${o}`).value = `${header[count]}`
      }

      for (var n = 0; n < list.length; n++) {
        var m = 9 + n
        sheet.getCell(`A${m}`).value = `${parseInt(n+1)}`
        sheet.getCell(`A${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`B${m}`).value = '.'
        sheet.getCell(`B${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
        sheet.getCell(`C${m}`).value = `${list[n].productCode}`
        sheet.getCell(`C${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
        sheet.getCell(`D${m}`).value = `${parseInt(list[n].Qty).toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
        sheet.getCell(`D${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`E${m}`).value = `${(parseFloat(list[n].Total)).toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
        sheet.getCell(`E${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`F${m}`).value = `${(parseFloat(list[n].discountTotal)).toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
        sheet.getCell(`F${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`G${m}`).value = `${(parseFloat(list[n].Total) - parseFloat(list[n].discountTotal)).toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
        sheet.getCell(`G${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`H${m}`).value = `0`
        sheet.getCell(`H${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`I${m}`).value = `${(parseFloat(list[n].Total) - parseFloat(list[n].discountTotal)).toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
        sheet.getCell(`I${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
      }

      for (var m = 65; m < 74; m++) {
        var n = list.length + 10
        var count = m - 65
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
      sheet.getCell('F2').value = 'LAPORAN  PENJUALAN PER PART'
      sheet.getCell('F3').alignment = { vertical: 'middle', horizontal: 'center' }
      sheet.getCell('F3').value = `${localStorage.getItem('company') ? JSON.parse(localStorage.getItem('company'))[0].miscName : ''}`
      sheet.getCell('F4').alignment = { vertical: 'middle', horizontal: 'center' }
      sheet.getCell('F4').value = `PERIODE : ${fromDate} TO ${toDate}`
      sheet.getCell('J5').alignment = { vertical: 'middle', horizontal: 'right' }
      sheet.getCell('J5').value = `PRODUCT CODE : ${productCode}`
      workbook.xlsx.writeBuffer().then(function (data) {
        var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        saveAs(blob, `POS-summary${moment().format('YYYYMMDD')}.xlsx`)
      })
    }
  }
  const handlePdf = () => {
    var body = createPdfLineItems(list)
    var docDefinition = {
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
                text: 'LAPORAN REKAP PENJUALAN',
                style: 'header',
                fontSize: 18,
                alignment: 'center',
              },
              {
                canvas: [{ type: 'line', x1: 0, y1: 5, x2: 813-2*40, y2: 5, lineWidth: 0.5 }]
              },
              {
                columns: [
                  {
                    text: `\nPERIODE: ${fromDate} TO ${toDate}`,
                    fontSize: 12,
                    alignment: 'left',
                  },
                  {
                    text: '',
                    fontSize: 12,
                    alignment: 'center',
                  },
                  {
                    text: `\nPRODUCT CODE: ${productCode}`,
                    fontSize: 12,
                    alignment: 'center',
                  },
                ],
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
            widths: ['6%', '21%', '6%', '15%', '13%', '13%', '13%', '13%' ],
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
  const columns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '175px',
    },
    {
      title: 'Product',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '155px',
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Qty',
      dataIndex: 'Qty',
      key: 'Qty',
      width: '60px',
    },
    {
      title: 'Total',
      dataIndex: 'Total',
      key: 'Total',
      width: '100px',
    },
    {
      title: 'Discount',
      dataIndex: 'discountTotal',
      key: 'discountTotal',
      width: '100px',
    },
    {
      title: 'Netto',
      dataIndex: 'Netto',
      key: 'Netto',
      width: '100px',
    },
  ]
  return (
    <div>
      <Row>
        <Col xs={24} sm={24} md={15} lg={15} xl={15} style={{ marginBottom: '10px' }}>
          <Filter {...browseProps} />
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
        scroll={{ x: 1000, y: 300 }}
        columns={columns}
        simple
        size="small"
        rowKey={record => record.transNo}
      />
    </div>
  )
}

Browse.propTyps = {
  location: PropTypes.object,
  onExportExcel: PropTypes.func,
  list: PropTypes.Array,
}

export default Browse
