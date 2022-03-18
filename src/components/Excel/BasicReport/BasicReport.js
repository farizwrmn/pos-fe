import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, Modal } from 'antd'
import * as Excel from 'exceljs/dist/exceljs.min.js'
import { numberFormat } from 'utils'
import { saveAs } from 'file-saver'
import moment from 'moment'

const { formatNumberInExcel, numberToLetters } = numberFormat

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
  data = [],
  mergeCells = []
}) => {
  const workbook = new Excel.Workbook()
  workbook.creator = 'smartPOS'
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

  let sheet = ''

  const createXLSLineItems = () => {
    sheet = workbook.addWorksheet('POS 1',
      { pageSetup: { paperSize, orientation } })
    let content = []
    if (title.length > 0) {
      for (let i = 0; i < title.length; i += 1) {
        let line = 2 + i
        let position = numberToLetters(Math.round((tableHeader[0].length) / 2))
        content.push({
          value: sheet.getCell(`${position}${line}`).value = title[i].value,
          alignment: sheet.getCell(`${position}${line}`).alignment = title[i].alignment,
          font: sheet.getCell(`${position}${line}`).font = title[i].font
        })
      }
    }
    if (tableHeader.length > 0) {
      let get = []
      for (let i = 0; i < tableHeader.length; i += 1) {
        let line = title.length + (4 + i)
        for (let j = 0; j < tableHeader[i].length; j += 1) {
          if (tableHeader[i][j].validation) {
            console.log(`${numberToLetters(j + 1)}${line + 1}:${numberToLetters(j + 1)}${line + 500}`)
            sheet.dataValidations.add(`${numberToLetters(j + 1)}${line + 1}:${numberToLetters(j + 1)}${line + 500}`, {
              type: 'list',
              allowBlank: false,
              formulae: tableHeader[i][j].validation,
              showErrorMessage: true,
              errorStyle: 'error',
              error: 'The value Valid'
            })
          }
          get.push({
            value: sheet.getCell(`${numberToLetters(j + 1)}${line}`).value = tableHeader[i][j].value,
            alignment: sheet.getCell(`${numberToLetters(j + 1)}${line}`).alignment = tableHeader[i][j].alignment,
            font: sheet.getCell(`${numberToLetters(j + 1)}${line}`).font = tableHeader[i][j].font
            // border: sheet.getCell(`${getPosition(j)}${line}`).border = tableHeader[i][j].border
          })
        }
        content.push(get[i])
      }
    }

    if (tableBody.length > 0) {
      let get = []
      for (let i = 0; i < tableBody.length; i += 1) {
        let line = (title.length + tableHeader.length) + (4 + i)
        for (let j = 0; j < tableBody[i].length; j += 1) {
          get.push({
            value: sheet.getCell(`${numberToLetters(j + 1)}${line}`).value = tableBody[i][j].value,
            alignment: sheet.getCell(`${numberToLetters(j + 1)}${line}`).alignment = tableBody[i][j].alignment,
            font: sheet.getCell(`${numberToLetters(j + 1)}${line}`).font = tableBody[i][j].font,
            numFmt: sheet.getCell(`${numberToLetters(j + 1)}${line}`).numFmt = formatNumberInExcel(tableBody[i][j].value, 2)
            // border: sheet.getCell(`${getPosition(j)}${line}`).border = tableBody[i][j].border
          })
        }
        content.push(get[i])
      }
    }
    if (tableFooter.length > 0) {
      let get = []
      for (let i = 0; i < tableFooter.length; i += 1) {
        let line = (title.length + tableHeader.length + data.length) + (4 + i)
        for (let j = 0; j < tableFooter[i].length; j += 1) {
          get.push({
            value: sheet.getCell(`${numberToLetters(j + 1)}${line}`).value = tableFooter[i][j].value,
            alignment: sheet.getCell(`${numberToLetters(j + 1)}${line}`).alignment = tableFooter[i][j].alignment,
            font: sheet.getCell(`${numberToLetters(j + 1)}${line}`).font = tableFooter[i][j].font,
            numFmt: sheet.getCell(`${numberToLetters(j + 1)}${line}`).numFmt = formatNumberInExcel(tableFooter[i][j].value, 2)
            // border: sheet.getCell(`${getPosition(j)}${line}`).border = tableFooter[i][j].border
          })
        }
        content.push(get[i])
      }
    }
    for (let i in mergeCells) sheet.mergeCells(mergeCells[i])
    return content
  }

  const printXLS = () => {
    if ((tableHeader.length === 0 && tableFooter.length === 0) || tableBody.length === 0) {
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
