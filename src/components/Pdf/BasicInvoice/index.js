import React from 'react'
import { Button, Icon, Modal } from 'antd'
import pdfMake from 'pdfmake/build/pdfmake.min.js'
import pdfFonts from 'pdfmake/build/vfs_fonts.js'
import defaultFont from 'utils/defaultFont'

// Dot Matrix Recommeded Setting 240x72dpi (Otherwise the font changed to draft by the driver)

pdfMake.vfs = pdfFonts.pdfMake.vfs
pdfMake.fonts = defaultFont
const BasicInvoice = ({
  name,
  className,
  width = 'auto',
  pageMargins = [0, 0, 0, 0],
  pageSize = 'A4',
  layout = '',
  pageOrientation = 'portrait',
  tableStyle,
  tableHeader = [],
  tableHeaderSecondary = [],
  tableBody = [],
  tableBodySecondary = [],
  tableFooter = [],
  tableFooterSecondary = [],
  header = {},
  footer = {}
}) => {
  const createPdfLineItems = ({
    tableHeader,
    tableBody,
    tableFooter
  }) => {
    let body = []
    if (tableHeader.length > 0) {
      for (let key in tableHeader) {
        body.push(tableHeader[key])
      }
    }
    if (tableBody.length > 0) {
      for (let key in tableBody) {
        body.push(tableBody[key])
      }
    }
    if (tableFooter.length > 0) {
      for (let key in tableFooter) {
        body.push(tableFooter[key])
      }
    }
    return body
  }
  const printPdf = () => {
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
      const content = createPdfLineItems({
        tableHeader,
        tableBody,
        tableFooter
      })
      const contentTest = createPdfLineItems({
        tableHeader: tableHeaderSecondary,
        tableBody: tableBodySecondary,
        tableFooter: tableFooterSecondary
      })

      let docDefinition = {
        defaultStyle: {
          font: 'OpenSans'
        },
        pageSize,
        pageOrientation,
        pageMargins,
        header,
        content: tableBodySecondary && tableBodySecondary.length > 0 ? ([
          {
            style: 'tableExample',
            table: {
              widths: width,
              body: content
            },
            layout
          }
        ]).concat([
          {
            style: 'tableExample',
            table: {
              widths: width,
              body: contentTest
            },
            layout
          }
        ]) : [
          {
            table: {
              widths: width,
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
      onClick={() => printPdf()}
    >
      <Icon type="printer" className="icon-large" />
      {name}
    </Button>
  )
}

export default BasicInvoice
