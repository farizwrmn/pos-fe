/**
 * Created by Veirry on 22/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, Modal } from 'antd'
import { saveAs } from 'file-saver'
import * as Excel from 'exceljs/dist/exceljs.min.js'
import moment from 'moment'

const warning = Modal.warning

const PrintXLS = ({ listTrans, dataSource, fromDate, toDate, storeInfo }) => {

  let productTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.product), 0)
  let serviceTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.service), 0)
  let counterTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.counter), 0)
  let qtyUnit = listTrans.reduce((cnt, o) => cnt + parseFloat(o.qtyUnit), 0)

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
    { pageSetup: { paperSize: 9, orientation: 'portrait' } })
  const handleXLS = () => {
    if (fromDate === '' && toDate === '') {
      warning({
        title: 'Parameter cannot be null',
        content: 'your Trans Date paramater probably not set...',
      })
    } else if (listTrans.length === 0) {
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
      for (let n = 0; n <= listTrans.length; n++) {
        for (let m = 65; m < 74; m++) {
          let o = 9 + n
          sheet.getCell(`${String.fromCharCode(m)}${o}`).font = {
            name: 'Times New Roman',
            family: 4,
            size: 10,
          }
        }
      }
      const header = ['NO.', 'DATE', 'UNIT', 'COUNTER', 'PRODUCT', 'SERVICE', 'TOTAL']
      const footer = [
        'GRAND TOTAL',
        '',
        `${qtyUnit}`,
        `${counterTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
        `${productTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
        `${serviceTotal.toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
        `${(parseFloat(serviceTotal) + parseFloat(productTotal) + parseFloat(counterTotal)).toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
        ]
      for (let m = 65; m < (65 + header.length); m += 1) {
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

      for (let n = 0; n < listTrans.length; n++) {
        let m = 9 + n
        sheet.getCell(`A${m}`).value = `${parseInt(n + 1, 10)}`
        sheet.getCell(`A${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`B${m}`).value = `${moment(listTrans[n].transDate).format('YYYY/MM/DD')}`
        sheet.getCell(`B${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
        sheet.getCell(`C${m}`).value = (parseFloat(listTrans[n].qtyUnit) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 })
        sheet.getCell(`C${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`D${m}`).value = (parseFloat(listTrans[n].counter) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        sheet.getCell(`D${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`E${m}`).value = `${(parseFloat(listTrans[n].product)).toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`E${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`F${m}`).value = `${(parseFloat(listTrans[n].service)).toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`F${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`G${m}`).value = `${((parseFloat(listTrans[n].service) + parseFloat(listTrans[n].product) + parseFloat(listTrans[n].counter))).toLocaleString(['ban', 'id'], {minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`G${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
      }

      for (let m = 65; m < (65 + footer.length); m += 1) {
        let n = listTrans.length + 10
        let count = m - 65
        sheet.getCell(`C${n}`).font = {
          name: 'Times New Roman',
          family: 4,
          size: 10,
        }
        sheet.getCell(`${String.fromCharCode(m + 3)}${n}`).font = {
          name: 'Times New Roman',
          family: 4,
          size: 10,
        }
        sheet.getCell(`${String.fromCharCode(m)}${n}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`${String.fromCharCode(m)}${n}`).value = `${footer[count]}`
      }

      sheet.getCell('D2').alignment = { vertical: 'middle', horizontal: 'center' }
      sheet.getCell('D2').value = 'LAPORAN REKAP PENJUALAN PER HARI'
      sheet.getCell('D3').alignment = { vertical: 'middle', horizontal: 'center' }
      sheet.getCell('D3').value = `${storeInfo.name}`
      sheet.getCell('D4').alignment = { vertical: 'middle', horizontal: 'center' }
      sheet.getCell('D4').value = `PERIODE : ${moment(fromDate).format('DD-MMM-YYYY')}  TO  ${moment(toDate).format('DD-MMM-YYYY')}`
      workbook.xlsx.writeBuffer().then(function (data) {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        saveAs(blob, `POS-Summary${moment().format('YYYYMMDD')}.xlsx`)
      })
    }
  }
  return (
    <Button type="dashed"
      size="large"
      className="button-width02 button-extra-large bgcolor-green"
      onClick={() => handleXLS(dataSource)}
    >
      <Icon type="file-excel" className="icon-large" />
    </Button>
  )
}

PrintXLS.propTypes = {
  location: PropTypes.object,
  listTrans: PropTypes.array,
  app: PropTypes.object,
  dataSource: PropTypes.object,
  storeInfo: PropTypes.object,
  fromDate: PropTypes.string,
  toDate: PropTypes.string,
}

export default PrintXLS
