/**
 * Created by Veirry on 22/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, Modal } from 'antd'
import { saveAs } from 'file-saver'
import { numberFormat } from 'utils'
import * as Excel from 'exceljs/dist/exceljs.min.js'
import moment from 'moment'

const warning = Modal.warning
const { formatNumberInExcel } = numberFormat

const PrintXLS = ({ listTrans, dataSource, fromDate, toDate, storeInfo }) => {
  let productTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.product || 0), 0)
  let serviceTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.service || 0), 0)

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
    { pageSetup: { paperSize: 9, orientation: 'portrait' } })
  const handleXLS = () => {
    if (fromDate === '' && toDate === '') {
      warning({
        title: 'Parameter cannot be null',
        content: 'your Trans Date paramater probably not set...'
      })
    } else if (listTrans.length === 0) {
      warning({
        title: 'Parameter cannot be null',
        content: 'your Trans Date paramater probably not set...'
      })
    } else {
      sheet.getCell('F2').font = {
        name: 'Courier New',
        family: 4,
        size: 12,
        underline: true
      }
      sheet.getCell('F3').font = {
        name: 'Courier New',
        family: 4,
        size: 12
      }
      sheet.getCell('F4').font = {
        name: 'Courier New',
        family: 4,
        size: 12
      }
      sheet.getCell('J5').font = {
        name: 'Courier New',
        family: 4,
        size: 10
      }
      for (let n = 0; n <= listTrans.length; n += 1) {
        for (let m = 65; m < 74; m += 1) {
          let o = 9 + n
          sheet.getCell(`${String.fromCharCode(m)}${o}`).font = {
            name: 'Times New Roman',
            family: 4,
            size: 10
          }
        }
      }
      const header = ['NO.', 'DATE', 'TRANS NO', 'MEMBER', 'POLICE NO', 'PRODUCT', 'SERVICE', 'TOTAL']
      const footer = [
        '',
        '',
        '',
        '',
        'GRAND TOTAL',
        productTotal,
        serviceTotal,
        (parseFloat(serviceTotal) + parseFloat(productTotal))
      ]
      for (let m = 65; m < (65 + header.length); m += 1) {
        let o = 7
        let count = m - 65
        sheet.getCell(`${String.fromCharCode(m)}${o}`).font = {
          name: 'Courier New',
          family: 4,
          size: 11
        }
        sheet.getCell(`${String.fromCharCode(m)}${o}`).alignment = { vertical: 'middle', horizontal: 'center' }
        sheet.getCell(`${String.fromCharCode(m)}${o}`).value = `${header[count]}`
      }

      for (let n = 0; n < listTrans.length; n += 1) {
        let m = 9 + n
        sheet.getCell(`A${m}`).value = `${parseInt(n + 1, 10)}`
        sheet.getCell(`A${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`B${m}`).value = `${moment(listTrans[n].transDate).format('DD-MMM-YYYY')}`
        sheet.getCell(`B${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
        sheet.getCell(`C${m}`).value = listTrans[n].transNo
        sheet.getCell(`C${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
        sheet.getCell(`D${m}`).value = `${listTrans[n].memberName}`
        sheet.getCell(`D${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
        sheet.getCell(`E${m}`).value = `${listTrans[n].policeNo}`
        sheet.getCell(`E${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
        sheet.getCell(`F${m}`).value = (parseFloat(listTrans[n].product || 0))
        sheet.getCell(`F${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`F${m}`).numFmt = formatNumberInExcel(parseFloat(listTrans[n].product || 0), 2)
        sheet.getCell(`G${m}`).value = (parseFloat(listTrans[n].service || 0))
        sheet.getCell(`G${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`G${m}`).numFmt = formatNumberInExcel(parseFloat(listTrans[n].service || 0), 2)
        sheet.getCell(`H${m}`).value = ((parseFloat(listTrans[n].service || 0) + parseFloat(listTrans[n].product || 0)))
        sheet.getCell(`H${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`H${m}`).numFmt = formatNumberInExcel((parseFloat(listTrans[n].service || 0) + parseFloat(listTrans[n].product || 0)), 2)
      }

      for (let m = 65; m < (65 + footer.length); m += 1) {
        let n = listTrans.length + 10
        let count = m - 65
        sheet.getCell(`C${n}`).font = {
          name: 'Courier New',
          family: 4,
          size: 11
        }
        sheet.getCell(`${String.fromCharCode(m + 3)}${n}`).font = {
          name: 'Times New Roman',
          family: 4,
          size: 10
        }
        sheet.getCell(`${String.fromCharCode(m)}${n}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`${String.fromCharCode(m)}${n}`).value = footer[count]
        sheet.getCell(`${String.fromCharCode(m)}${n}`).numFmt = formatNumberInExcel(footer[count], 2)
      }

      sheet.getCell('D2').alignment = { vertical: 'middle', horizontal: 'center' }
      sheet.getCell('D2').value = 'LAPORAN JASA + PRODUCT PER FAKTUR'
      sheet.getCell('D3').alignment = { vertical: 'middle', horizontal: 'center' }
      sheet.getCell('D3').value = `${storeInfo.name}`
      sheet.getCell('D4').alignment = { vertical: 'middle', horizontal: 'center' }
      sheet.getCell('D4').value = `PERIODE : ${moment(fromDate).format('DD-MMM-YYYY')}  TO  ${moment(toDate).format('DD-MMM-YYYY')}`
      workbook.xlsx.writeBuffer().then((data) => {
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
  listTrans: PropTypes.array,
  dataSource: PropTypes.object,
  storeInfo: PropTypes.object,
  fromDate: PropTypes.string,
  toDate: PropTypes.string
}

export default PrintXLS
