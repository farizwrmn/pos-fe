/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, Modal } from 'antd'
import { saveAs } from 'file-saver'
import * as Excel from 'exceljs/dist/exceljs.min.js'
import moment from 'moment'

const warning = Modal.warning

const PrintXLS = ({ list, dataSource, fromDate, toDate, storeInfo, productCode }) => {

  let grandTotal = list.reduce((cnt, o) => cnt + parseFloat(o.total), 0)
  let discountTotal = list.reduce((cnt, o) => cnt + parseFloat(o.discount), 0)
  let dppTotal = list.reduce((cnt, o) => cnt + parseFloat(o.dpp), 0)
  let nettoTotal = list.reduce((cnt, o) => cnt + parseFloat(o.netto), 0)

  const workbook = new Excel.Workbook()
  workbook.creator = 'dmiPOS'
  workbook.created = new Date()
  //workbook.lastPrinted = new Date(2016, 9, 27)
  workbook.views = [
    {
      x: 0, y: 0, width: 10000, height: 20000,
      firstSheet: 0, activeTab: 1, visibility: 'visible'
    }
  ]
  const sheet = workbook.addWorksheet('POS 1',
    { pageSetup: { paperSize: 9, orientation: 'portrait' } })
  const handleXLS = () => {
    if (fromDate === '' && toDate === '') {
      warning({
        title: 'Parameter cannot be null',
        content: 'your Trans Date paramater probably not set...',
      })
    } else if (list.length === 0) {
      warning({
        title: 'Parameter cannot be null',
        content: 'your Trans Date paramater probably not set...',
      })
    } else {
      sheet.getCell('F2').font = {
        name: 'Courier New',
        family: 4,
        size: 12,
        underline: true,
      }
      sheet.getCell('F3').font = {
        name: 'Courier New',
        family: 4,
        size: 12,
      }
      sheet.getCell('F4').font = {
        name: 'Courier New',
        family: 4,
        size: 12,
      }
      sheet.getCell('J5').font = {
        name: 'Courier New',
        family: 4,
        size: 10,
      }
      for (let n = 0; n <= list.length; n++) {
        for (let m = 65; m < 74; m++) {
          let o = 9 + n
          sheet.getCell(`${String.fromCharCode(m)}${o}`).font = {
            name: 'Times New Roman',
            family: 4,
            size: 10,
          }
        }
      }
      const header = ['NO.', '', 'NO_FAKTUR', 'TANGGAL', 'TOTAL', 'DISKON', 'DPP', 'NETTO']
      const footer = [
        '',
        '',
        '',
        'GRAND TOTAL',
        `${grandTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
        `${discountTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
        `${dppTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
        `${nettoTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`]
      for (let m = 65; m < 74; m++) {
        let o = 7
        let count = m - 65
        sheet.getCell(`${String.fromCharCode(m)}${o}`).font = {
          name: 'Courier New',
          family: 4,
          size: 11,
        }
        sheet.getCell(`${String.fromCharCode(m)}${o}`).alignment = { vertical: 'middle', horizontal: 'center' }
        sheet.getCell(`${String.fromCharCode(m)}${o}`).value = `${header[count]}`
      }

      for (let n = 0; n < list.length; n++) {
        let m = 9 + n
        sheet.getCell(`A${m}`).value = `${parseInt(n+1)}`
        sheet.getCell(`A${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`B${m}`).value = '.'
        sheet.getCell(`B${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
        sheet.getCell(`C${m}`).value = `${list[n].transNo}`
        sheet.getCell(`C${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
        sheet.getCell(`D${m}`).value = `${moment(list[n].transDate).format('DD-MM-YYYY')}`
        sheet.getCell(`D${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`E${m}`).value = `${(parseFloat(list[n].total)).toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
        sheet.getCell(`E${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`F${m}`).value = `${(parseFloat(list[n].discount)).toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
        sheet.getCell(`F${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`G${m}`).value = `${(parseFloat(list[n].dpp)).toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
        sheet.getCell(`G${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`H${m}`).value = `${(parseFloat(list[n].netto)).toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
        sheet.getCell(`H${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
      }

      for (let m = 65; m < 74; m ++) {
        let n = list.length + 10
        let count = m - 65
        sheet.getCell(`C${n}`).font = {
          name: 'Courier New',
          family: 4,
          size: 11,
        }
        sheet.getCell(`${String.fromCharCode(m + 3)}${n}`).font = {
          name: 'Times New Roman',
          family: 4,
          size: 10,
        }
        sheet.getCell(`${String.fromCharCode(m)}${n}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`${String.fromCharCode(m)}${n}`).value = `${footer[count]}`
      }

      sheet.getCell('F2').alignment = { vertical: 'middle', horizontal: 'center' }
      sheet.getCell('F2').value = 'LAPORAN SERVICE PER FAKTUR'
      sheet.getCell('F3').alignment = { vertical: 'middle', horizontal: 'center' }
      sheet.getCell('F3').value = `${storeInfo.name}`
      sheet.getCell('F4').alignment = { vertical: 'middle', horizontal: 'center' }
      sheet.getCell('F4').value = `PERIODE : ${moment(fromDate).format('DD-MMM-YYYY')}  TO  ${moment(toDate).format('DD-MMM-YYYY')}`
      sheet.getCell('J5').alignment = { vertical: 'middle', horizontal: 'right' }
      workbook.xlsx.writeBuffer().then(function (data) {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        saveAs(blob, `Service-Summary${moment().format('YYYYMMDD')}.xlsx`)
      })
    }
  }
  return (
    <Button type="dashed" size="large"
            className="button-width02 button-extra-large bgcolor-green"
            onClick={() => handleXLS(dataSource)}
    >
      <Icon type="file-excel" className="icon-large" />
    </Button>
  )
}

PrintXLS.propTypes = {
  location: PropTypes.object,
  list: PropTypes.array,
  app: PropTypes.object,
}

export default PrintXLS
