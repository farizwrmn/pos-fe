
import React from 'react'
import { Icon } from 'antd'
import moment from 'moment'
import { connect } from 'dva'
import PropTypes from 'prop-types'

const PrintPDF = ({ dataSource, app }) => {
  const { user, storeInfo } = app
  const pdfMake = require('pdfmake/build/pdfmake.js')
  const pdfFonts = require('pdfmake/build/vfs_fonts.js')
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  const createPdfLineItems = (tabledata) => {
    let headers = {
      top:{
        col_1: { text: 'ID', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13 },
        col_2: { text: 'NAMA CUSTOMER', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13 },
        col_3: { text: 'ALAMAT', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13 },
        col_4: { text: 'KOTA', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13 },
        col_5: { text: 'NO.TELP', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13 },
        col_6: { text: 'NO.HP', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13 },
        col_7: { text: 'TIPE', style: 'tableHeader', alignment: 'center', bold: true, fontSize: 13 },
      },
    }
    let rows = tabledata
    let body = []
    for (var key in headers){
      if (headers.hasOwnProperty(key)){
        var header = headers[key]
        var row = new Array()
        row.push( header.col_1 )
        row.push( header.col_2 )
        row.push( header.col_3 )
        row.push( header.col_4 )
        row.push( header.col_5 )
        row.push(header.col_6)
        row.push(header.col_7)
        body.push(row)
      }
    }
    for (var key in rows)
    {
      if (rows.hasOwnProperty(key))
      {
        var data = rows[key]
        var row = new Array()
        row.push({ text: (data.memberCode || '').toString(), alignment: 'left' })
        row.push({ text: (data.memberName || '').toString(), alignment: 'left' })
        row.push({ text: (data.address01 || '').toString(), alignment: 'left' })
        row.push({ text: (data.cityName || '').toString(), alignment: 'center' })
        row.push({ text: (data.phoneNumber || '').toString(), alignment: 'left' })
        row.push({ text: (data.mobileNumber || '').toString(), alignment: 'left' })
        row.push({ text: (data.memberTypeName || '').toString(), alignment: 'center' })
        body.push(row)
      }
    }
    return body
  }



  const handlePDF = (dataSource) => {
    let body = createPdfLineItems(dataSource)
    let currentDate = new Date()
    let datetime = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`
    let docDefinition = {

      footer: function (currentPage, pageCount) {
        return {
          margin: [40, 30, 40, 0],

          stack: [
            {
              canvas: [{ type: 'line', x1: 2, y1: -5, x2: 732, y2: -5, lineWidth: 0.1, margin: [0, 0, 0, 120] }],
            },
            {
              columns: [
                {
                  text: `Tanggal Cetak: ${moment().format('DD-MM-YYYY hh:mm:ss')}`,
                  margin: [0, 0, 0, 0],
                  fontSize: 9,
                  alignment: 'left',
                },
                {
                  text: `Dicetak Oleh: ${user.userid}`,
                  fontSize: 9,
                  margin: [0, 0, 0, 0],
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

      header: [
        {text: `${storeInfo.name}`, fontSize: 18, margin: [45, 10, 0, 0]},
        {text: 'LAPORAN DAFTAR CUSTOMER', fontSize: 16, margin: [45, 2, 0, 0]},

      ],

      pageSize: { width: 813, height: 530 },
      pageOrientation: 'landscape',
      pageMargins: [ 40, 80, 40, 60 ],
      content: [
        {
          style: 'tableExample',
          writable: true,
          table: {
            widths: ['10%', '20%', '22%', '10%', '13%', '13%', '12%'],
            body,
          },
        },
        { text: ' ', margin: [0, 0, 0, 15] },
      ],
      styles: {
        header: {
          fontSize: 28,
          bold: true,
        },
      },
    }
    pdfMake.createPdf(docDefinition).open()
  }

  return (
    <div onClick={() => handlePDF(dataSource)}><Icon type="file-pdf" /> PDF</div>
  )
}

PrintPDF.propTypes = {
  app: PropTypes.object,
  customer: PropTypes.object,
}

export default connect(({ app, customer }) => ({ app, customer }))(PrintPDF)
