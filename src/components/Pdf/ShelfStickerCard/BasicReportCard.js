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
          if (x === 0 && y === 0 && tabledata[x][y] && tabledata[x][y][0]) {
            stack.push({
              stack: tabledata[x][y]
            })
          } else {
            stack.push(tabledata[x][y])
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
      // const content = createPdfLineItems(data)
      const content = [
        [
          {
            stack: [
              {
                stack: [
                  { "text": "K3MART", "size": 40, "fontSize": 40, "width": 113.38582677165354, "height": 34.01574803149606, "color": "#FFFFFF", "alignment": "center", "background": "#212121", "fillColor": "#212121" }
                ],
                "background": "#212121", "fillColor": "#212121", width: 113 * 2
              },
              { "text": "K3 HEALTHY DRINK CHRYSANTHEM", "style": "productName1", "alignment": "center", "width": 226.77165354330708, "fillColor": "#ffffff" }, { "text": "UM", "style": "productName2", "alignment": "center", "fillColor": "#ffffff" },
              { "text": "2022-01-25", "style": "productCode", "alignment": "right", "fillColor": "#ffffff" },
              { "text": "12.000", "width": "100%", "fillColor": "#ffffff", "background": "#ffffff", "color": "#000000", "style": "sellPrice" },
              { "text": "880742", "style": "productCode", "alignment": "right", "fillColor": "#ffffff" }
            ]
          },
          [
            { "text": "K3MART", "size": 40, "fontSize": 40, "width": 113.38582677165354, "height": 34.01574803149606, "color": "#FFFFFF", "alignment": "center", "background": "#212121", "fillColor": "#212121" },
            { "text": "K3 HEALTHY DRINK LEMONGRASS", "style": "productName1", "alignment": "center", "width": 226.77165354330708, "fillColor": "#ffffff" },
            { "text": " ", "style": "productName2", "alignment": "center", "fillColor": "#ffffff" },
            { "text": "2022-01-25", "style": "productCode", "alignment": "right", "fillColor": "#ffffff" },
            { "text": "12.000", "width": "100%", "fillColor": "#ffffff", "background": "#ffffff", "color": "#000000", "style": "sellPrice" },
            { "text": "880597", "style": "productCode", "alignment": "right", "fillColor": "#ffffff" }
          ],
          [

          ]]]
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
        pdfMake.createPdf(docDefinition).open()
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
