import React from 'react'
import { Button, Icon, Modal } from 'antd'
import pdfMake from 'pdfmake/build/pdfmake.min.js'
import pdfFonts from 'pdfmake/build/vfs_fonts.js'
import defaultFont from 'utils/defaultFont'

pdfMake.vfs = pdfFonts.pdfMake.vfs
pdfMake.fonts = defaultFont
const BasicInvoice = ({
  name,
  className,
  width = 'auto',
  pageMargins = [0, 0, 0, 0],
  pageSize = 'A4',
  pageOrientation = 'portrait',
  tableStyle,
  layout = '',
  tableHeader = [],
  tableBody = [],
  tableFooter = [],
  data,
  header = {},
  footer = {}
}) => {
  const createPdfLineItems = () => {
    let body = []
    if (tableHeader.length > 0) {
      for (let c = 0; c < tableHeader.length; c += 1) {
        body.push(tableHeader[c])
      }
    }
    if (tableBody.length > 0) {
      for (let c = 0; c < tableBody.length; c += 1) {
        body.push(tableBody[c])
      }
    }
    if (tableFooter.length > 0) {
      for (let c = 0; c < tableFooter.length; c += 1) {
        body.push(tableFooter[c])
      }
    }
    return body
  }
  const printPdf = (data) => {
    if (tableHeader.length === 0 && tableFooter.length === 0) {
      console.log('header', tableHeader.length)
      console.log('footer', tableFooter.length)
      Modal.warning({
        title: 'Empty Data',
        content: 'No Data in Storage'
      })
    } else if (tableBody.length === 0) {
      Modal.warning({
        title: 'Empty Data',
        content: 'No Data in Storage'
      })
    } else {
      const content = createPdfLineItems(data)
      let docDefinition = {
        pageSize,
        pageOrientation,
        pageMargins,
        header,
        content: [
          {
            writable: true,
            table: {
              widths: width,
              headerRows: tableHeader.length,
              body: content
            },
            layout
          }
        ],
        footer,
        styles: tableStyle
      }
      try {
        pdfMake.createPdf(docDefinition).open()
      } catch (e) {
        pdfMake.createPdf(docDefinition).download()
      }
    }
  }
  return (
    <Button type="dashed"
      size="large"
      className={className}
      onClick={() => printPdf(data)}
    >
      <Icon type="printer" className="icon-large" />
      {name}
    </Button>
  )
}

export default BasicInvoice
