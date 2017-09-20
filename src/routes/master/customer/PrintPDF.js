/**
 * Created by boo on 9/19/17.
 */
import React from 'react'
import { Icon } from 'antd'

const PrintPDF = ({dataSource}) => {
  const pdfMake = require('pdfmake/build/pdfmake.js')
  const pdfFonts = require('pdfmake/build/vfs_fonts.js')
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  const createPdfLineItems = (tabledata) => {
    var headers = {
      top:{
        col_1:{ text: 'Code', style: 'tableHeader', alignment: 'center' },
        col_2:{ text: 'Name', style: 'tableHeader', alignment: 'center' },
        col_3:{ text: 'Point', style: 'tableHeader', alignment: 'center' },
        col_4:{ text: 'Mobile', style: 'tableHeader', alignment: 'center' },
        col_5:{ text: 'Phone', style: 'tableHeader', alignment: 'center'}
      }
    }
    var rows = tabledata
    var body = []
    for (var key in headers){
      if (headers.hasOwnProperty(key)){
        var header = headers[key]
        var row = new Array()
        row.push( header.col_1 )
        row.push( header.col_2 )
        row.push( header.col_3 )
        row.push( header.col_4 )
        row.push( header.col_5 )
        body.push(row)
      }
    }
    for (var key in rows)
    {
      if (rows.hasOwnProperty(key))
      {
        console.log('data', data)
        var data = rows[key]
        var row = new Array()
        row.push( { text: (data.memberCode||'').toString(), alignment: 'center' } )
        row.push( { text: (data.memberName||'').toString(), alignment: 'center' } )
        row.push( { text: (data.point||'').toString(), alignment: 'center' })
        row.push( { text: (data.mobileNumber||'').toString(), alignment: 'center' })
        row.push( { text: (data.phoneNumber||'').toString(), alignment: 'center' })
        body.push(row)
      }
    }
    return body
  }

  const handlePDF = (dataSource) => {
    var body = createPdfLineItems(dataSource)
    var docDefinition = {
      pageSize: { width: 813, height: 530 },
      pageOrientation: 'landscape',
      pageMargins: [ 40, 60, 40, 60 ],
      content: [
        {
          style: 'tableExample',
          writable: true,
          table: {
            widths: ['25%', '25%', '10%', '20%','20%'],
            body: body
          },
        },
      ]
    }
    pdfMake.createPdf(docDefinition).open()
  }

  return(
    <div onClick={() => handlePDF(dataSource)}><Icon type="file-pdf" /> PDF</div>
  )
}

export default PrintPDF