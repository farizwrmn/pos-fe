import React from 'react'
import { Button, Icon, Modal } from 'antd'
import pdfMake from 'pdfmake/build/pdfmake.js'
import pdfFonts from 'pdfmake/build/vfs_fonts.js'

pdfMake.vfs = pdfFonts.pdfMake.vfs

const RepeatReport = ({
  name,
  className = 'button-width02 button-extra-large bgcolor-blue',
  buttonSize = 'large',
  width = [],
  iconSize = 'icon-large',
  buttonStyle = {},
  buttonType = 'dashed',
  tableMargin = [0, 0],
  pageMargins = [0, 0, 0, 0],
  pageOrientation = 'portrait',
  tableStyle = {
    header: {
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 10],
      alignment: 'center'
    },
    subheader: {
      fontSize: 16,
      bold: true,
      margin: [0, 10, 0, 5]
    },
    tableExample: {
      margin: [0, 5, 0, 15]
    },
    tableHeader: {
      bold: true,
      fontSize: 13,
      color: 'black',
      alignment: 'center'
    },
    tableTitle: {
      fontSize: 14,
      margin: [0, 20, 0, 8]
    },
    tableFooter: {
      margin: [0, 0, 0, 0],
      fontSize: 9,
      alignment: 'left'
    }
  },
  pageSize = 'A4',
  tableBody = [],
  header = [],
  footer = [],
  data = [],
  tableTitle = []
}) => {
  const createPdfLineItems = (listData) => {
    let contentPdf = []
    for (let i = 0; i < listData.length; i += 1) {
      if (tableTitle[i]) contentPdf.push(tableTitle[i])
      let body = []
      for (let j = 0; j < listData[i].length; j += 1) {
        body.push(listData[i][j])
      }
      contentPdf.push(
        {
          writable: true,
          margin: tableMargin,
          dontBreakRows: true,
          table: {
            widths: width[i],
            body
          }
        }
      )
    }
    return contentPdf
  }
  const printPdf = () => {
    if (data.length === 0) {
      Modal.warning({
        title: 'Empty Data',
        content: 'No Data in Storage'
      })
    } else {
      let contentPdf = createPdfLineItems(tableBody)

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

export default RepeatReport
