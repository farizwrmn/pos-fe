import React from 'react'
import { Icon, Modal, Button } from 'antd'
import pdfMake from 'pdfmake/build/pdfmake.min.js'
import pdfFonts from 'pdfmake/build/vfs_fonts.js'
import defaultFont from 'utils/defaultFont'

pdfMake.vfs = pdfFonts.pdfMake.vfs
pdfMake.fonts = defaultFont
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
  layout = '',
  images
  // companyLogo
}) => {
  const createPdfLineItems = (tabledata) => {
    let body = []
    if (tabledata.length > 0) {
      for (let x = 0; x < tabledata.length; x += 1) {
        let stack = []
        if (tabledata[x]) {
          for (let y = 0; y < tabledata[x].length; y += 1) {
            if (tabledata[x][y] && tabledata[x][y].length > 0) {
              stack.push({
                layout: 'noBorders',
                table: {
                  dontBreakRows: true,
                  writable: true,
                  heights: 'auto',
                  widths: [width[0]],
                  body: (tabledata[x][y]).map(item => (item ? [item] : [{}]))
                  // bodyWorks: [
                  //   [
                  //     tabledata[x][y][0] || []
                  //   ],
                  //   [
                  //     tabledata[x][y][1] || []
                  //   ],
                  //   [
                  //     tabledata[x][y][2] || []
                  //   ],
                  //   [
                  //     tabledata[x][y][3] || []
                  //   ],
                  //   [
                  //     tabledata[x][y][4] || []
                  //   ],
                  //   [
                  //     tabledata[x][y][5] || []
                  //   ]
                  // ]
                }
              })
            } else {
              stack.push({
                layout: 'noBorders',
                table: {
                  dontBreakRows: true,
                  writable: true,
                  heights: 'auto',
                  widths: [width[0]],
                  body: [
                    [
                      tabledata[x][y][0] || []
                    ],
                    [
                      tabledata[x][y][1] || []
                    ],
                    [
                      tabledata[x][y][2] || []
                    ],
                    [
                      tabledata[x][y][3] || []
                    ],
                    [
                      tabledata[x][y][4] || []
                    ],
                    [
                      tabledata[x][y][5] || []
                    ]
                  ]
                }
              })
            }
          }
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
      const contentItem = [
        {
          style: 'tableExample',
          writable: true,
          table: {
            dontBreakRows: true,
            widths: width,
            heights: height,
            body: content
          },
          layout
        }
      ]
      let docDefinition = {
        defaultStyle: {
          font: 'BouyguesRead'
        },
        pageSize,
        pageOrientation,
        pageMargins,
        header,
        content: contentItem,
        images: images || {},
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
