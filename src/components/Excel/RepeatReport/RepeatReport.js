import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, Modal } from 'antd'
import * as Excel from 'exceljs/dist/exceljs.min.js'
import { saveAs } from 'file-saver'
import moment from 'moment'

const RepeatReport = ({
  className,
  fileName,
  paperSize = 9,
  orientation = 'portrait',
  title = [],
  tableTitle = [],
  tableHeader = [],
  tableBody = [],
  tableFooter = [],
  data = []
}) => {
  const workbook = new Excel.Workbook()
  workbook.creator = 'dmiPOS'
  workbook.created = new Date()
  workbook.views = [
    {
      x: 0,
      y: 0,
      width: 10000,
      height: 20000,
      firstSheet: 0,
      activeTab: 1,
      visibility: 'visible'
    }
  ]

  const sheet = workbook.addWorksheet('POS 1',
    { pageSetup: { paperSize, orientation } })

  const createXLSLineItems = () => {
    let content = []
    if (title.length > 0) {
      for (let i = 0; i < title.length; i += 1) {
        let code = Math.round((65 - 1) + (tableBody[0][0].length / 2))
        let headerPosition = 2 + i
        content.push({
          value: sheet.getCell(`${String.fromCharCode(code)}${headerPosition}`).value = title[i].value,
          alignment: sheet.getCell(`${String.fromCharCode(code)}${headerPosition}`).alignment = title[i].alignment,
          font: sheet.getCell(`${String.fromCharCode(code)}${headerPosition}`).font = title[i].font
        })
      }
    }
    let position = title.length + 4
    for (let i = 0; i < data.length; i += 1) {
      for (let j = 0; j < tableTitle[i].length; j += 1) {
        for (let char = 65; char < 65 + tableTitle[i][j].length; char += 1) {
          let tableTitleValue = char - 65
          content.push({
            value: sheet.getCell(`${String.fromCharCode(char)}${position}`).value = tableTitle[i][j][tableTitleValue].value,
            alignment: sheet.getCell(`${String.fromCharCode(char)}${position}`).alignment = tableTitle[i][j][tableTitleValue].alignment,
            font: sheet.getCell(`${String.fromCharCode(char)}${position}`).font = tableTitle[i][j][tableTitleValue].font
          })
        }
        position += 1
      }


      for (let char = 65; char < 65 + tableHeader.length; char += 1) {
        let tableHeaderPosition = position
        let tableHeaderValue = char - 65
        content.push({
          value: sheet.getCell(`${String.fromCharCode(char)}${tableHeaderPosition}`).value = tableHeader[tableHeaderValue].value,
          alignment: sheet.getCell(`${String.fromCharCode(char)}${tableHeaderPosition}`).alignment = tableHeader[tableHeaderValue].alignment,
          font: sheet.getCell(`${String.fromCharCode(char)}${tableHeaderPosition}`).font = tableHeader[tableHeaderValue].font,
          border: sheet.getCell(`${String.fromCharCode(char)}${tableHeaderPosition}`).border = tableHeader[tableHeaderValue].border
        })
      }

      let tableBodyPosition = position + 1
      for (let n = 0; n < tableBody[i].length; n += 1) {
        for (let char = 65; char < 65 + tableBody[i][n].length; char += 1) {
          let tableBodyValue = char - 65
          content.push({
            value: sheet.getCell(`${String.fromCharCode(char)}${tableBodyPosition}`).value = tableBody[i][n][tableBodyValue].value,
            alignment: sheet.getCell(`${String.fromCharCode(char)}${tableBodyPosition}`).alignment = tableBody[i][n][tableBodyValue].alignment,
            font: sheet.getCell(`${String.fromCharCode(char)}${tableBodyPosition}`).font = tableBody[i][n][tableBodyValue].font,
            border: sheet.getCell(`${String.fromCharCode(char)}${tableBodyPosition}`).border = tableBody[i][n][tableBodyValue].border
          })
        }
        tableBodyPosition += 1
      }

      for (let char = 65; char < 65 + tableFooter[i].length; char += 1) {
        let tableFooterPosition = position + tableBody[i].length + 1
        let tableFooterValue = char - 65
        content.push({
          value: sheet.getCell(`${String.fromCharCode(char)}${tableFooterPosition}`).value = tableFooter[i][tableFooterValue].value,
          alignment: sheet.getCell(`${String.fromCharCode(char)}${tableFooterPosition}`).alignment = tableFooter[i][tableFooterValue].alignment,
          font: sheet.getCell(`${String.fromCharCode(char)}${tableFooterPosition}`).font = tableFooter[i][tableFooterValue].font,
          border: sheet.getCell(`${String.fromCharCode(char)}${tableFooterPosition}`).border = tableFooter[i][tableFooterValue].border
        })
      }
      position = position + 4 + tableBody[i].length
    }
    return content
  }
  const printXLS = () => {
    if (tableBody.length === 0) {
      Modal.warning({
        title: 'Empty Data',
        content: 'No Data in Storage'
      })
    } else {
      createXLSLineItems()
      workbook.xlsx.writeBuffer().then((e) => {
        let blob = new Blob([e], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        saveAs(blob, `${fileName}${moment().format('YYYYMMDD')}.xlsx`)
      })
    }
  }
  return (
    <Button type="dashed"
      size="large"
      className={className}
      onClick={() => printXLS()}
    >
      <Icon type="file-excel" className="icon-large" />
    </Button>
  )
}

RepeatReport.propTypes = {
  className: PropTypes.string,
  fileName: PropTypes.string,
  paperSize: PropTypes.string,
  orientation: PropTypes.string,
  title: PropTypes.array,
  tableTitle: PropTypes.array,
  tableHeader: PropTypes.array,
  tableBody: PropTypes.array,
  tableFooter: PropTypes.array,
  data: PropTypes.array
}

export default RepeatReport
