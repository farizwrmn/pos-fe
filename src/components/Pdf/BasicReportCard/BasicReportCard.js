import React from 'react'
import { Icon, Modal, Button } from 'antd'
import pdfMake from 'pdfmake/build/pdfmake.min.js'
import pdfFonts from 'pdfmake/build/vfs_fonts.js'

pdfMake.vfs = pdfFonts.pdfMake.vfs
const BasicReportCard = ({
  name,
  width = 'auto',
  pageMargins = [0, 0, 0, 0],
  pageSize = 'A4',
  pageOrientation = 'portrait',
  tableStyle,
  tableBody = [],
  height,
  header = {},
  footer = {},
  layout = ''
  // companyLogo
}) => {
  const createPdfLineItems = (tabledata) => {
    let body = []
    if (tabledata.length > 0) {
      for (let x = 0; x < tabledata.length; x += 1) {
        let stack = []
        for (let y = 0; y < tabledata[x].length; y += 1) {
          stack.push({ stack: tabledata[x][y] })
        }
        body.push(stack)
      }
    }
    return body
  }

  const printPdf = (data) => {
    if (data.length === 0) {
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
              dontBreakRows: true,
              widths: width,
              heights: height,
              body: content
            },
            layout
          }
        ],
        // images: { companyLogo } || {},
        footer,
        styles: tableStyle
      }
      try {
        pdfMake.createPdf(docDefinition).print()
      } catch (e) {
        pdfMake.createPdf(docDefinition).download()
      }
    }
  }
  return (
    <Button onClick={() => printPdf(tableBody)}>
      <Icon type="file-pdf" />
      {name}
    </Button>
  )
}

export default BasicReportCard
