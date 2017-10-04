/**
 * Created by Veirry on 19/09/2017.
 */
import React from 'react'
import { saveAs } from 'file-saver'
import PropTypes from 'prop-types'
import { Table, Button, Row, Col, Modal } from 'antd'
import moment from 'moment'
import Filter from './Filter'
import * as Excel from 'exceljs/dist/exceljs.min.js'
// webpack.config.js, exceljs compiled warning

const warning = Modal.warning

const pdfMake = require('pdfmake/build/pdfmake.js')
const pdfFonts = require('pdfmake/build/vfs_fonts.js')
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const Browse = ({ listTrans, company, user, storeInfo, productCode, fromDate, toDate, ...browseProps }) => {
  let grandTotal = listTrans.reduce(function(cnt, o) { return cnt + o.total }, 0)
  let discountTotal = listTrans.reduce(function(cnt, o) { return cnt + o.dicount }, 0)
  let dppTotal = listTrans.reduce(function(cnt, o) { return cnt + o.dpp }, 0)
  let nettoTotal = listTrans.reduce(function(cnt, o) { return cnt + o.netto }, 0)
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
        col_2: { fontSize: 12, text: 'NO_FAKTUR', style: 'tableHeader', alignment: 'center' },
        col_3: { fontSize: 12, text: 'TANGGAL', style: 'tableHeader', alignment: 'center' },
        col_4: { fontSize: 12, text: 'TOTAL', style: 'tableHeader', alignment: 'center' },
        col_5: { fontSize: 12, text: 'DISKON', style: 'tableHeader', alignment: 'center' },
        col_6: { fontSize: 12, text: 'DPP', style: 'tableHeader', alignment: 'center' },
        col_7: { fontSize: 12, text: 'NETTO', style: 'tableHeader', alignment: 'center' },
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
        row.push( { text: count, alignment: 'center', fontSize: 11 } );
        row.push( { text: data.transNo.toString(), alignment: 'left', fontSize: 11 } );
        row.push( { text: moment(data.transDate).format('DD-MM-YYYY').toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2}), alignment: 'left', fontSize: 11 } )
        row.push( { text: data.total.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2}), alignment: 'right', fontSize: 11 })
        row.push( { text: data.dicount.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2}), alignment: 'right', fontSize: 11 })
        row.push( { text: data.dpp.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2}), alignment: 'right', fontSize: 11 })
        row.push( { text: data.netto.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2}), alignment: 'right', fontSize: 11 })
        body.push(row)
      }
      count = count + 1
    }
    let totalRow = []
    totalRow.push({ text: 'Grand Total', colSpan: 3, alignment: 'center', fontSize: 12 })
    totalRow.push({})
    totalRow.push({})
    totalRow.push({ text: `${grandTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${discountTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${dppTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, alignment: 'right', fontSize: 12 })
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
    } else if (listTrans.length === 0) {
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
      for (let n = 0; n <= listTrans.length; n++) {
        for (let m = 65; m < 74; m++) {
          let o = 9 + n
          sheet.getCell(`${String.fromCharCode(m)}${o}`).font = {
            name: 'Times New Roman',
            family: 4,
            size: 10,
          }
        }
      }
      let header = ['NO.', '', 'NO_FAKTUR', 'TANGGAL', 'TOTAL', 'DISKON', 'DPP', 'NETTO']
      let footer = [
        '',
        '',
        '',
        'GRAND TOTAL',
        `${grandTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
        `${discountTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
        `${dppTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
        `${nettoTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`]
      for (let m = 65; m < 73; m++) {
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

      for (let n = 0; n < listTrans.length; n++) {
        let m = 9 + n
        sheet.getCell(`A${m}`).value = `${parseInt(n+1)}`
        sheet.getCell(`A${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`B${m}`).value = '.'
        sheet.getCell(`B${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
        sheet.getCell(`C${m}`).value = `${listTrans[n].transNo}`
        sheet.getCell(`C${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
        sheet.getCell(`D${m}`).value = `${moment(listTrans[n].transDate).format('DD-MM-YYYY')}`
        sheet.getCell(`D${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`E${m}`).value = `${(parseFloat(listTrans[n].total)).toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
        sheet.getCell(`E${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`F${m}`).value = `${(parseFloat(listTrans[n].dicount)).toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
        sheet.getCell(`F${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`G${m}`).value = `${(parseFloat(listTrans[n].dpp)).toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
        sheet.getCell(`G${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`H${m}`).value = `${(parseFloat(listTrans[n].netto)).toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
        sheet.getCell(`H${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
      }

      for (let m = 65; m < 73; m++) {
        let n = listTrans.length + 10
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
      sheet.getCell('F2').value = 'LAPORAN PEMBELIAN PER FAKTUR'
      sheet.getCell('F3').alignment = { vertical: 'middle', horizontal: 'center' }
      sheet.getCell('F3').value = `${localStorage.getItem('company') ? JSON.parse(localStorage.getItem('company'))[0].miscName : ''}`
      sheet.getCell('F4').alignment = { vertical: 'middle', horizontal: 'center' }
      sheet.getCell('F4').value = `PERIODE : ${fromDate} TO ${toDate}`
      sheet.getCell('J5').alignment = { vertical: 'middle', horizontal: 'right' }
      workbook.xlsx.writeBuffer().then(function (data) {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        saveAs(blob, `PURCHASE-summary${moment().format('YYYYMMDD')}.xlsx`)
      })
    }
  }
  const handlePdf = () => {
    let body = createPdfLineItems(listTrans)
    let docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [50, 130, 50, 60],
      header : {
        stack: [
          {
            stack: [
              {
                stack: stackHeader01
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
                text: 'LAPORAN PEMBELIAN PER FAKTUR',
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
            widths: ['6%', '17%', '21%', '14%', '14%', '14%', '14%' ],
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
  const columns = [
    {
      title: 'invoice',
      dataIndex: 'transNo',
      key: 'transNo',
      width: '155px',
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '175px',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: '100px',
    },
    {
      title: 'Discount',
      dataIndex: 'dicount',
      key: 'dicount',
      width: '100px',
    },
    {
      title: 'DPP',
      dataIndex: 'dpp',
      key: 'dpp',
      width: '100px',
    },
    {
      title: 'Netto',
      dataIndex: 'netto',
      key: 'netto',
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
  listTrans: PropTypes.Array,
}

export default Browse
