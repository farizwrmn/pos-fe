import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, Modal } from 'antd'
import * as Excel from 'exceljs/dist/exceljs.min.js'
import { saveAs } from 'file-saver'
import moment from 'moment'

const BasicReport = ({
  className,
  paperSize = 9,
  orientation = 'portrait',
  title = [],
  header = [],
  body = [],
  footer = [],
  data = [],
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
      visibility: 'visible',
    },
  ]

  const sheet = workbook.addWorksheet('POS 1',
    { pageSetup: { paperSize, orientation } })

  const createXLSLineItems = () => {
    let content = []
    if (title.length > 0) {
      for (let i = 0; i < title.length; i += 1) {
        let code = Math.round((65 - 1) + (header[0].length / 2))
        let position = 2 + i
        content.push({
          value: sheet.getCell(`${String.fromCharCode(code)}${position}`).value = title[i].value,
          alignment: sheet.getCell(`${String.fromCharCode(code)}${position}`).alignment = title[i].alignment,
          font: sheet.getCell(`${String.fromCharCode(code)}${position}`).font = title[i].font,
        })
      }
    }
    if (header.length > 0) {
      let get = []
      for (let i = 0; i < header.length; i += 1) {
        for (let n = 65; n < 65 + header[i].length; n += 1) {
          let m = title.length + (4 + i)
          let a = n - 65
          get.push({
            value: sheet.getCell(`${String.fromCharCode(n)}${m}`).value = header[i][a].value,
            alignment: sheet.getCell(`${String.fromCharCode(n)}${m}`).alignment = header[i][a].alignment,
            font: sheet.getCell(`${String.fromCharCode(n)}${m}`).font = header[i][a].font,
            border: sheet.getCell(`${String.fromCharCode(n)}${m}`).border = header[i][a].border,
          })
        }
        content.push(get[i])
      }
    }

    if (body.length > 0) {
      let get = []
      for (let i = 0; i < body.length; i += 1) {
        for (let n = 65; n < 65 + body[i].length; n += 1) {
          let m = (title.length + header.length) + (4 + i)
          let a = n - 65
          get.push({
            value: sheet.getCell(`${String.fromCharCode(n)}${m}`).value = body[i][a].value,
            alignment: sheet.getCell(`${String.fromCharCode(n)}${m}`).alignment = body[i][a].alignment,
            font: sheet.getCell(`${String.fromCharCode(n)}${m}`).font = body[i][a].font,
            border: sheet.getCell(`${String.fromCharCode(n)}${m}`).border = body[i][a].border,
          })
        }
        content.push(get[i])
      }
    }
    if (footer.length > 0) {
      let get = []
      for (let i = 0; i < footer.length; i += 1) {
        for (let n = 65; n < 65 + footer[i].length; n += 1) {
          let m = (title.length + header.length + data.length) + (4 + i)
          let a = n - 65
          get.push({
            value: sheet.getCell(`${String.fromCharCode(n)}${m}`).value = footer[i][a].value,
            alignment: sheet.getCell(`${String.fromCharCode(n)}${m}`).alignment = footer[i][a].alignment,
            font: sheet.getCell(`${String.fromCharCode(n)}${m}`).font = footer[i][a].font,
            border: sheet.getCell(`${String.fromCharCode(n)}${m}`).border = footer[i][a].border,
          })
        }
        content.push(get[i])
      }
    }
    return content
  }
  const printXLS = () => {
    if (header.length === 0 && footer.length === 0) {
      Modal.warning({
        title: 'Empty Data',
        content: 'No Data in Storage',
      })
    } else if (body.length === 0) {
      Modal.warning({
        title: 'Empty Data',
        content: 'No Data in Storage',
      })
    } else {
      createXLSLineItems()
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        saveAs(blob, `Purchase-Summary${moment().format('YYYYMMDD')}.xlsx`)
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

BasicReport.propTypes = {
  title: PropTypes.array,
  header: PropTypes.array,
  body: PropTypes.array,
  footer: PropTypes.array,
  data: PropTypes.array,
  className: PropTypes.string,
  paperSize: PropTypes.string,
  orientation: PropTypes.string,
}

export default BasicReport
