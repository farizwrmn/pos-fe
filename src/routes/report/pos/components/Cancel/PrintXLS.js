/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, Modal } from 'antd'
import { saveAs } from 'file-saver'
import { numberFormat } from 'utils'
import * as Excel from 'exceljs/dist/exceljs.min.js'
import moment from 'moment'

const warning = Modal.warning
const { formatNumberInExcel} = numberFormat

const PrintXLS = ({ listTrans, dataSource, fromDate, toDate, storeInfo }) => {
  let grandTotal = listTrans.reduce((cnt, o) => cnt + o.total, 0)
  let discountTotal = listTrans.reduce((cnt, o) => cnt + o.discount, 0)
  let dppTotal = listTrans.reduce((cnt, o) => cnt + o.DPP, 0)
  let ppnTotal = listTrans.reduce((cnt, o) => cnt + o.PPN, 0)
  let nettoTotal = listTrans.reduce((cnt, o) => cnt + o.netto, 0)

  const workbook = new Excel.Workbook()
  workbook.creator = 'dmiPOS'
  workbook.created = new Date()
  // workbook.lastPrinted = new Date(2016, 9, 27)
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
      const header = ['NO.', '', 'NO_FAKTUR', 'TANGGAL', 'TOTAL', 'DISKON', 'DPP', 'NETTO', 'MEMO', 'CASHIER']
      const footer = [
        '',
        '',
        '',
        'GRAND TOTAL',
        grandTotal,
        discountTotal,
        dppTotal,
        ppnTotal,
        nettoTotal]
      for (let m = 65; m < (header.length + 65); m += 1) {
        let o = 7
        let count = m - 65
        sheet.getCell(`${String.fromCharCode(m)}${o}`).font = {
          name: 'Courier New',
          family: 4,
          size: 11
        }
        sheet.getCell(`${String.fromCharCode(m)}${o}`).alignment = { vertical: 'middle', horizontal: 'center' }
        sheet.getCell(`${String.fromCharCode(m)}${o}`).value = header[count]
        sheet.getCell(`${String.fromCharCode(m)}${o}`).numFmt = formatNumberInExcel(header[count], 2)
      }

      for (let n = 0; n < listTrans.length; n += 1) {
        let m = 9 + n
        sheet.getCell(`A${m}`).value = `${parseInt(n + 1, 10)}`
        sheet.getCell(`A${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`B${m}`).value = '.'
        sheet.getCell(`B${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
        sheet.getCell(`C${m}`).value = `${listTrans[n].transNo}`
        sheet.getCell(`C${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
        sheet.getCell(`D${m}`).value = `${moment(listTrans[n].transDate).format('DD-MM-YYYY')}`
        sheet.getCell(`D${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`E${m}`).value = (parseFloat(listTrans[n].total))
        sheet.getCell(`E${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`E${m}`).numFmt = formatNumberInExcel(listTrans[n].total)
        sheet.getCell(`F${m}`).value = (parseFloat(listTrans[n].discount))
        sheet.getCell(`F${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`F${m}`).numFmt = formatNumberInExcel(listTrans[n].discount)
        sheet.getCell(`G${m}`).value = (parseFloat(listTrans[n].DPP))
        sheet.getCell(`G${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`G${m}`).numFmt = formatNumberInExcel(listTrans[n].DPP, 2)
        sheet.getCell(`H${m}`).value = (parseFloat(listTrans[n].PPN))
        sheet.getCell(`H${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`H${m}`).numFmt = formatNumberInExcel(listTrans[n].PPN, 2)
        sheet.getCell(`I${m}`).value = (parseFloat(listTrans[n].netto))
        sheet.getCell(`I${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`I${m}`).numFmt = formatNumberInExcel(listTrans[n].netto, 2)
        sheet.getCell(`J${m}`).value = listTrans[n].memo
        sheet.getCell(`J${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
        sheet.getCell(`K${m}`).value = listTrans[n].cashier
        sheet.getCell(`K${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
      }

      for (let m = 65; m < (footer.length + 65); m += 1) {
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
        sheet.getCell(`${String.fromCharCode(m)}${n}`).value = `${footer[count]}`
      }

      sheet.getCell('F2').alignment = { vertical: 'middle', horizontal: 'center' }
      sheet.getCell('F2').value = 'LAPORAN PENJUALAN BATAL PER FAKTUR'
      sheet.getCell('F3').alignment = { vertical: 'middle', horizontal: 'center' }
      sheet.getCell('F3').value = `${storeInfo.name}`
      sheet.getCell('F4').alignment = { vertical: 'middle', horizontal: 'center' }
      sheet.getCell('F4').value = `PERIODE : ${moment(fromDate).format('DD-MMM-YYYY')}  TO  ${moment(toDate).format('DD-MMM-YYYY')}`
      sheet.getCell('J5').alignment = { vertical: 'middle', horizontal: 'right' }
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
  listTrans: PropTypes.array
}

export default PrintXLS
