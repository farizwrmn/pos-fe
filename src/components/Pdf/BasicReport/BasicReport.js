import React from 'react'
import { Button, Icon, Modal } from 'antd'
import pdfMake from 'pdfmake/build/pdfmake.min.js'
import pdfFonts from 'pdfmake/build/vfs_fonts.js'
import defaultFont from 'utils/defaultFont'

pdfMake.vfs = pdfFonts.pdfMake.vfs
pdfMake.fonts = defaultFont
const BasicReport = ({
  name,
  buttonSize = 'large',
  buttonType = 'dashed',
  iconSize = 'icon-large',
  className = 'button-width02 button-extra-large bgcolor-blue',
  buttonStyle = {},
  width = 'auto',
  pageMargins = [0, 0, 0, 0],
  pageSize = 'A4',
  pageOrientation = 'portrait',
  tableStyle = {
    header: {
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 10],
      alignment: 'center'
    },
    title: {
      fontSize: 12,
      alignment: 'left',
      margin: [0, 5, 0, 0]
    },
    tableHeader: {
      bold: true,
      fontSize: 13,
      alignment: 'center'
    },
    tableBody: {
      fontSize: 11
    }
  },
  layout = '',
  tableHeader = [],
  tableBody = [],
  tableFooter = [],
  header = {},
  footer = {}
}) => {
  const printPdf = () => {
    if (tableBody.length === 0) {
      console.log('no body of content')
      Modal.warning({
        title: 'Empty Data',
        content: 'No Data in Storage'
      })
    } else {
      const content = tableHeader.concat(tableBody).concat(tableFooter)
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
    <Button type={buttonType}
      size={buttonSize}
      className={className}
      onClick={() => printPdf()}
      style={buttonStyle}
    >
      <Icon type="file-pdf" className={iconSize} />
      {name}
    </Button>
  )
}

export default BasicReport
