import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, Modal } from 'antd'
import * as Excel from 'exceljs/dist/exceljs.min.js'
import { saveAs } from 'file-saver'
import moment from 'moment'
import { numberFormat } from 'utils'

const { formatNumberInExcel } = numberFormat

const RepeatReport = ({
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
  tableTitle = [],
  tableHeader = [],
  tableBody = [],
  tableFooter = [],
  tableTotal = [],
  data = [],
  tableFilter = []
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

  let sheet1
  if ((tableFilter || []).length) {
    sheet1 = workbook.addWorksheet('POS 2',
      { pageSetup: { paperSize, orientation } })
  }

  const getPositionTitle = (length) => {
    let alphabet = ''
    let totalAlphabet = 26
    let startAlphabet = 65
    let moreAlphabet = 0
    if (length > totalAlphabet) {
      length -= totalAlphabet
      alphabet = String.fromCharCode(startAlphabet + moreAlphabet)
      moreAlphabet += 1
      getPositionTitle(length)
    }
    alphabet += String.fromCharCode(startAlphabet + length)
    return alphabet
  }

  const getPosition = (position) => {
    let alphabet = ''
    let totalAlphabet = 26
    let startAlphabet = 65
    let moreAlphabet = 0
    if (position + 1 > totalAlphabet) {
      position -= totalAlphabet
      alphabet = String.fromCharCode(startAlphabet + moreAlphabet)
      moreAlphabet += 1
      getPositionTitle(position)
    }
    alphabet += String.fromCharCode(startAlphabet + position)
    return alphabet
  }

  const createXLSLineItems0 = () => {
    let content = []
    if ((title || []).length > 0) {
      for (let i = 0; i < (title || []).length; i += 1) {
        let line = 2 + i
        let position = getPositionTitle(Math.round((tableBody[0][0] || []).length / 2))
        if (tableHeader && (tableHeader || []).length) {
          position = getPositionTitle(Math.round((tableHeader[0] || []).length / 2))
        }
        content.push({
          value: sheet.getCell(`${position}${line}`).value = title[i].value,
          alignment: sheet.getCell(`${position}${line}`).alignment = title[i].alignment,
          font: sheet.getCell(`${position}${line}`).font = title[i].font
        })
      }
    }

    let position = (title || []).length + 4
    for (let i = 0; i < (data || []).length; i += 1) {
      for (let j = 0; j < (tableTitle[i] || []).length; j += 1) {
        for (let k = 0; k < (tableTitle[i][j] || []).length; k += 1) {
          content.push({
            value: sheet.getCell(`${getPosition(k)}${position}`).value = tableTitle[i][j][k].value,
            alignment: sheet.getCell(`${getPosition(k)}${position}`).alignment = tableTitle[i][j][k].alignment,
            font: sheet.getCell(`${getPosition(k)}${position}`).font = tableTitle[i][j][k].font
          })
        }
        position += 1
      }

      for (let header in tableHeader) {
        for (let i = 0; i < (tableHeader[header] || []).length; i += 1) {
          content.push({
            value: sheet.getCell(`${getPosition(i)}${position}`).value = tableHeader[header][i].value,
            alignment: sheet.getCell(`${getPosition(i)}${position}`).alignment = tableHeader[header][i].alignment,
            font: sheet.getCell(`${getPosition(i)}${position}`).font = tableHeader[header][i].font
            // border: sheet.getCell(`${getPosition(i)}${position}`).border = tableHeader[header][i].border
          })
        }
      }

      let tableBodyPosition = position + 1
      for (let n = 0; n < (tableBody[i] || []).length; n += 1) {
        for (let o = 0; o < (tableBody[i][n] || []).length; o += 1) {
          content.push({
            value: sheet.getCell(`${getPosition(o)}${tableBodyPosition}`).value = tableBody[i][n][o].value,
            alignment: sheet.getCell(`${getPosition(o)}${tableBodyPosition}`).alignment = tableBody[i][n][o].alignment,
            font: sheet.getCell(`${getPosition(o)}${tableBodyPosition}`).font = tableBody[i][n][o].font,
            numFmt: sheet.getCell(`${getPosition(o)}${tableBodyPosition}`).numFmt = formatNumberInExcel(tableBody[i][n][o].value, 2)
            // border: sheet.getCell(`${getPosition(o)}${tableBodyPosition}`).border = tableBody[i][n][o].border
          })
        }
        tableBodyPosition += 1
      }

      for (let j = 0; j < (tableFooter[i] || []).length; j += 1) {
        let tableFooterPosition = position + (tableBody[i] || []).length + 1
        content.push({
          value: sheet.getCell(`${getPosition(j)}${tableFooterPosition}`).value = tableFooter[i][j].value,
          alignment: sheet.getCell(`${getPosition(j)}${tableFooterPosition}`).alignment = tableFooter[i][j].alignment,
          font: sheet.getCell(`${getPosition(j)}${tableFooterPosition}`).font = tableFooter[i][j].font,
          numFmt: sheet.getCell(`${getPosition(j)}${tableFooterPosition}`).numFmt = formatNumberInExcel(tableFooter[i][j].value, 2)
          // border: sheet.getCell(`${getPosition(j)}${tableFooterPosition}`).border = tableFooter[i][j].border
        })
      }

      position += (3 + (tableBody[i] || []).length)
      if ((tableTotal || []).length > 0) {
        for (let i = 0; i < (tableTotal[0] || []).length; i += 1) {
          let line = position + 1
          content.push({
            value: sheet.getCell(`${getPosition(i)}${line}`).value = tableTotal[0][i].value,
            alignment: sheet.getCell(`${getPosition(i)}${line}`).alignment = tableTotal[0][i].alignment,
            font: sheet.getCell(`${getPosition(i)}${line}`).font = tableTotal[0][i].font,
            numFmt: sheet.getCell(`${getPosition(i)}${line}`).numFmt = formatNumberInExcel(tableTotal[0][i].value, 2)
            // border: sheet.getCell(`${getPosition(i)}${tableFooterPosition}`).border = tableFooter[i][tableFooterValue].border
          })
        }
      }
    }
    return content
  }

  const createXLSLineItems1 = () => {
    let content = []
    if ((title || []).length > 0) {
      for (let i = 0; i < (title || []).length; i += 1) {
        let line = 2 + i
        let position = getPositionTitle(Math.round((tableBody[0][0] || []).length / 2))
        content.push({
          value: sheet1.getCell(`${position}${line}`).value = title[i].value,
          alignment: sheet1.getCell(`${position}${line}`).alignment = title[i].alignment,
          font: sheet1.getCell(`${position}${line}`).font = title[i].font
        })
      }
    }
    let position = (title || []).length + 4
    for (let i = 0; i < (tableFilter || []).length; i += 1) {
      for (let j = 0; j < (tableFilter[i] || []).length; j += 1) {
        content.push({
          value: sheet1.getCell(`${getPosition(j)}${position}`).value = tableFilter[i][j].value,
          alignment: sheet1.getCell(`${getPosition(j)}${position}`).alignment = tableFilter[i][j].alignment,
          font: sheet1.getCell(`${getPosition(j)}${position}`).font = tableFilter[i][j].font,
          numFmt: sheet1.getCell(`${getPosition(j)}${position}`).numFmt = formatNumberInExcel(tableFilter[i][j].value, 2)
        })
      }
      position += 1
    }
    return content
  }

  const printXLS = () => {
    if ((tableBody || []).length === 0) {
      Modal.warning({
        title: 'Empty Data',
        content: 'No Data in Storage'
      })
    } else {
      createXLSLineItems0()
      if ((tableFilter || []).length) createXLSLineItems1()
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
