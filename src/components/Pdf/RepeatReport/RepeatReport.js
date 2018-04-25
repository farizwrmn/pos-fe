import React from 'react'
import { Button, Icon, Modal } from 'antd'
import pdfMake from 'pdfmake/build/pdfmake.js'
import pdfFonts from 'pdfmake/build/vfs_fonts.js'

pdfMake.vfs = pdfFonts.pdfMake.vfs

const RepeatReport = ({
  name,
  className,
  width = [],
  tableMargin = [0, 0],
  pageMargins = [0, 0, 0, 0],
  pageOrientation = 'portrait',
  tableStyle,
  pageSize = 'A4',
  tableBody = [],
  header = [],
  footer = [],
  data = [],
  tableTitle = []
}) => {
  const createPdfLineItems = (listData) => {
    let body = []
    if (listData.length > 0) {
      for (let c = 0; c < listData.length; c += 1) {
        body.push(listData[c])
      }
    }
    return body
  }
  const printPdf = () => {
    if (data.length === 0) {
      Modal.warning({
        title: 'Empty Data',
        content: 'No Data in Storage'
      })
    } else {
      let contentPdf = []
      for (let i = 0; i < tableBody.length; i += 1) {
        if (tableTitle[i]) contentPdf.push(tableTitle[i])
        contentPdf.push(
          {
            writable: true,
            margin: tableMargin,
            table: {
              widths: width[i],
              body: createPdfLineItems(tableBody[i])
            }
          }
        )
      }

      let docDefinition = {
        pageSize,
        pageOrientation,
        pageMargins,
        header,
        content: contentPdf,
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
      onClick={() => printPdf()}
    >
      <Icon type="file-pdf" className="icon-large" />
      {name}
    </Button>
  )
}

export default RepeatReport
