import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, Modal } from 'antd'
import * as Excel from 'exceljs/dist/exceljs.min.js'
import { saveAs } from 'file-saver'
import moment from 'moment'

const BasicReport = ({
  name,
  buttonType = 'dashed',
  iconSize = 'icon-large',
  className = 'button-width02 button-extra-large bgcolor-green',
  buttonSize = 'large',
  buttonStyle = {},
  fileName,
  paperSize = 9,
  orientation = 'portrait',
  title = [],
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
        let code = Math.round((65 - 1) + (tableHeader[0].length / 2))
        let position = 2 + i
        content.push({
          value: sheet.getCell(`${String.fromCharCode(code)}${position}`).value = title[i].value,
          alignment: sheet.getCell(`${String.fromCharCode(code)}${position}`).alignment = title[i].alignment,
          font: sheet.getCell(`${String.fromCharCode(code)}${position}`).font = title[i].font
        })
      }
    }
    if (tableHeader.length > 0) {
      let get = []
      for (let i = 0; i < tableHeader.length; i += 1) {
        for (let n = 65; n < 65 + tableHeader[i].length; n += 1) {
          let m = title.length + (4 + i)
          let a = n - 65
          get.push({
            value: sheet.getCell(`${String.fromCharCode(n)}${m}`).value = tableHeader[i][a].value,
            alignment: sheet.getCell(`${String.fromCharCode(n)}${m}`).alignment = tableHeader[i][a].alignment,
            font: sheet.getCell(`${String.fromCharCode(n)}${m}`).font = tableHeader[i][a].font,
            border: sheet.getCell(`${String.fromCharCode(n)}${m}`).border = tableHeader[i][a].border
          })
        }
        content.push(get[i])
      }
    }

    if (tableBody.length > 0) {
      let get = []
      for (let i = 0; i < tableBody.length; i += 1) {
        for (let n = 65; n < 65 + tableBody[i].length; n += 1) {
          let m = (title.length + tableHeader.length) + (4 + i)
          let a = n - 65
          get.push({
            value: sheet.getCell(`${String.fromCharCode(n)}${m}`).value = tableBody[i][a].value,
            alignment: sheet.getCell(`${String.fromCharCode(n)}${m}`).alignment = tableBody[i][a].alignment,
            font: sheet.getCell(`${String.fromCharCode(n)}${m}`).font = tableBody[i][a].font,
            border: sheet.getCell(`${String.fromCharCode(n)}${m}`).border = tableBody[i][a].border
          })
        }
        content.push(get[i])
      }
    }
    if (tableFooter.length > 0) {
      let get = []
      for (let i = 0; i < tableFooter.length; i += 1) {
        for (let n = 65; n < 65 + tableFooter[i].length; n += 1) {
          let m = (title.length + tableHeader.length + data.length) + (4 + i)
          let a = n - 65
          get.push({
            value: sheet.getCell(`${String.fromCharCode(n)}${m}`).value = tableFooter[i][a].value,
            alignment: sheet.getCell(`${String.fromCharCode(n)}${m}`).alignment = tableFooter[i][a].alignment,
            font: sheet.getCell(`${String.fromCharCode(n)}${m}`).font = tableFooter[i][a].font,
            border: sheet.getCell(`${String.fromCharCode(n)}${m}`).border = tableFooter[i][a].border
          })
        }
        content.push(get[i])
      }
    }
    return content
  }
  const printXLS = () => {
    if (tableHeader.length === 0 && tableFooter.length === 0) {
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
      createXLSLineItems()
      workbook.xlsx.writeBuffer().then((e) => {
        let blob = new Blob([e], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        saveAs(blob, `${fileName}${moment().format('YYYYMMDD')}.xlsx`)
      })
    }
  }
  return (
    <Button type={buttonType}
      size={buttonSize}
      className={className}
      onClick={() => printXLS()}
      style={buttonStyle}
    >
      <Icon type="file-excel" className={iconSize} />
      {name}
    </Button>
  )
}

BasicReport.propTypes = {
  name: PropTypes.string,
  buttonType: PropTypes.string,
  buttonSize: PropTypes.string,
  iconSize: PropTypes.string,
  buttonStyle: PropTypes.object,
  title: PropTypes.array,
  tableHeader: PropTypes.array,
  tableBody: PropTypes.array,
  tableFooter: PropTypes.array,
  data: PropTypes.array,
  className: PropTypes.string,
  fileName: PropTypes.string,
  paperSize: PropTypes.string,
  orientation: PropTypes.string
}

export default BasicReport
