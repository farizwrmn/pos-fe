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

const PrintXLS = ({ listRekap, dataSource, period, year, storeInfo }) => {
  let beginQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.beginQty), 0)
  let beginPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.beginPrice), 0)
  let purchaseQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.purchaseQty), 0)
  let purchasePrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.purchasePrice), 0)
  let adjInQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjInQty), 0)
  let adjInPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjInPrice), 0)
  let posQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.posQty), 0)
  let posPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.posPrice), 0)
  let valuePrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.valuePrice), 0)
  let adjOutQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjOutQty), 0)
  let adjOutPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjOutPrice), 0)
  let count = listRekap.reduce((cnt, o) => cnt + parseFloat(o.count), 0)
  let amount = listRekap.reduce((cnt, o) => cnt + parseFloat(o.amount), 0)
  let transferInQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transferInQty || 0), 0)
  let transferInPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transferInPrice || 0), 0)
  let transferOutQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transferOutQty || 0), 0)
  let transferOutPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transferOutPrice || 0), 0)
  let inTransitQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.inTransitQty || 0), 0)
  let inTransitPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.inTransitPrice || 0), 0)
  let inTransferQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.inTransferQty || 0), 0)
  let inTransferPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.inTransferPrice || 0), 0)

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
    if (period === '' && year === '') {
      warning({
        title: 'Parameter cannot be null',
        content: 'your Trans Date paramater probably not set...'
      })
    } else if (listRekap.length === 0) {
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
      const header = [
        '', '',
        '', '',
        '', 'SALDO AWAL',
        '', 'PEMBELIAN',
        '', 'ADJ IN + RTR JUAL',
        '', 'TR IN',
        '', 'PENJUALAN', '',
        '', 'ADJ OUT + RTR BELI',
        '', 'TR OUT',
        '', 'SALDO AKHIR',
        'LABA-RUGI KOTOR',
        '', 'IN TRANSIT + TRANSIT',
        '', 'IN TRANSFER'
      ]
      const header2 = [
        'NO.', '',
        'PRODUCT CODE', 'PRODUCT NAME',
        'QTY', 'AMOUNT',
        'QTY', 'AMOUNT',
        'QTY', 'AMOUNT',
        'QTY', 'AMOUNT',
        'QTY', 'NET SALES', 'AMOUNT',
        'QTY', 'AMOUNT',
        'QTY', 'AMOUNT',
        'QTY', 'AMOUNT', '',
        'QTY', 'AMOUNT',
        'QTY', 'AMOUNT'
      ]
      for (let n = 0; n <= listRekap.length; n += 1) {
        for (let m = 65; m < (65 + header2.length); m += 1) {
          let o = 9 + n
          sheet.getCell(`${String.fromCharCode(m)}${o}`).font = {
            name: 'Times New Roman',
            family: 4,
            size: 10
          }
        }
      }
      const footer = [
        'GRAND TOTAL',
        '',
        '',
        '',
        beginQty,
        beginPrice,
        purchaseQty,
        purchasePrice,
        adjInQty,
        adjInPrice,
        transferInQty,
        transferInPrice,
        posQty,
        valuePrice,
        posPrice,
        adjOutQty,
        adjOutPrice,
        transferOutQty,
        transferOutPrice,
        count,
        amount,
        (parseFloat(valuePrice) - parseFloat(posPrice)),
        inTransitQty,
        inTransitPrice,
        inTransferQty,
        inTransferPrice
      ]
      for (let m = 65; m < (65 + header2.length); m += 1) {
        let o = 7
        let counter = m - 65
        sheet.getCell(`${String.fromCharCode(m)}${o}`).font = {
          name: 'Courier New',
          family: 4,
          size: 11
        }
        sheet.getCell(`${String.fromCharCode(m)}${o}`).alignment = { vertical: 'middle', horizontal: 'center' }
        sheet.getCell(`${String.fromCharCode(m)}${o}`).value = `${header2[counter]}`
      }
      for (let m = 65; m < (65 + header.length); m += 1) {
        let o = 6
        let counter = m - 65
        sheet.getCell(`${String.fromCharCode(m)}${o}`).font = {
          name: 'Courier New',
          family: 4,
          size: 11
        }
        sheet.getCell(`${String.fromCharCode(m)}${o}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`${String.fromCharCode(m)}${o}`).value = `${header[counter]}`
      }

      for (let n = 0; n < listRekap.length; n += 1) {
        let m = 9 + n
        sheet.getCell(`A${m}`).value = `${parseInt((n + 1), 10)} .`
        sheet.getCell(`A${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`B${m}`).value = ''
        sheet.getCell(`B${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
        sheet.getCell(`C${m}`).value = `${listRekap[n].productCode}`
        sheet.getCell(`C${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
        sheet.getCell(`D${m}`).value = `${listRekap[n].productName}`
        sheet.getCell(`D${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
        sheet.getCell(`E${m}`).value = parseFloat(listRekap[n].beginQty)
        sheet.getCell(`E${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`E${m}`).numFmt = formatNumberInExcel(parseFloat(listRekap[n].beginQty), 2)
        sheet.getCell(`F${m}`).value = parseFloat(listRekap[n].beginPrice)
        sheet.getCell(`F${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`F${m}`).numFmt = formatNumberInExcel(parseFloat(listRekap[n].beginPrice), 2)
        sheet.getCell(`G${m}`).value = parseFloat(listRekap[n].purchaseQty)
        sheet.getCell(`G${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`G${m}`).numFmt = formatNumberInExcel(parseFloat(listRekap[n].purchaseQty), 2)
        sheet.getCell(`H${m}`).value = parseFloat(listRekap[n].purchasePrice)
        sheet.getCell(`H${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`H${m}`).numFmt = formatNumberInExcel(parseFloat(listRekap[n].purchasePrice), 2)
        sheet.getCell(`I${m}`).value = parseFloat(listRekap[n].adjInQty)
        sheet.getCell(`I${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`I${m}`).numFmt = formatNumberInExcel(parseFloat(listRekap[n].adjInQty), 2)
        sheet.getCell(`J${m}`).value = parseFloat(listRekap[n].adjInPrice)
        sheet.getCell(`J${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`J${m}`).numFmt = formatNumberInExcel(parseFloat(listRekap[n].adjInPrice), 2)
        sheet.getCell(`K${m}`).value = parseFloat(listRekap[n].transferInQty)
        sheet.getCell(`K${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`K${m}`).numFmt = formatNumberInExcel(parseFloat(listRekap[n].transferInQty), 2)
        sheet.getCell(`L${m}`).value = parseFloat(listRekap[n].transferInPrice)
        sheet.getCell(`L${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`L${m}`).numFmt = formatNumberInExcel(parseFloat(listRekap[n].transferInPrice), 2)
        sheet.getCell(`M${m}`).value = parseFloat(listRekap[n].posQty)
        sheet.getCell(`M${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`M${m}`).numFmt = formatNumberInExcel(parseFloat(listRekap[n].posQty), 2)
        sheet.getCell(`N${m}`).value = parseFloat(listRekap[n].valuePrice)
        sheet.getCell(`N${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`N${m}`).numFmt = formatNumberInExcel(parseFloat(listRekap[n].valuePrice), 2)
        sheet.getCell(`O${m}`).value = parseFloat(listRekap[n].posPrice)
        sheet.getCell(`O${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`O${m}`).numFmt = formatNumberInExcel(parseFloat(listRekap[n].posPrice), 2)
        sheet.getCell(`P${m}`).value = parseFloat(listRekap[n].adjOutQty)
        sheet.getCell(`P${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`P${m}`).numFmt = formatNumberInExcel(parseFloat(listRekap[n].adjOutQty), 2)
        sheet.getCell(`Q${m}`).value = parseFloat(listRekap[n].adjOutPrice)
        sheet.getCell(`Q${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`Q${m}`).numFmt = formatNumberInExcel(parseFloat(listRekap[n].adjOutPrice), 2)
        sheet.getCell(`R${m}`).value = parseFloat(listRekap[n].transferOutQty)
        sheet.getCell(`R${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`R${m}`).numFmt = formatNumberInExcel(parseFloat(listRekap[n].transferOutQty), 2)
        sheet.getCell(`S${m}`).value = parseFloat(listRekap[n].transferOutPrice)
        sheet.getCell(`S${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`S${m}`).numFmt = formatNumberInExcel(parseFloat(listRekap[n].transferOutPrice), 2)
        sheet.getCell(`T${m}`).value = parseFloat(listRekap[n].count)
        sheet.getCell(`T${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`T${m}`).numFmt = formatNumberInExcel(parseFloat(listRekap[n].count), 2)
        sheet.getCell(`U${m}`).value = parseFloat(listRekap[n].amount)
        sheet.getCell(`U${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`U${m}`).numFmt = formatNumberInExcel(parseFloat(listRekap[n].amount), 2)
        sheet.getCell(`V${m}`).value = parseFloat(listRekap[n].valuePrice) - parseFloat(listRekap[n].posPrice)
        sheet.getCell(`V${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`V${m}`).numFmt = formatNumberInExcel(parseFloat(listRekap[n].valuePrice) - parseFloat(listRekap[n].posPrice), 2)
        sheet.getCell(`W${m}`).value = parseFloat(listRekap[n].inTransitQty)
        sheet.getCell(`W${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`W${m}`).numFmt = formatNumberInExcel(parseFloat(listRekap[n].inTransitQty), 2)
        sheet.getCell(`X${m}`).value = parseFloat(listRekap[n].inTransitPrice)
        sheet.getCell(`X${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`X${m}`).numFmt = formatNumberInExcel(parseFloat(listRekap[n].inTransitPrice), 2)
        sheet.getCell(`Y${m}`).value = parseFloat(listRekap[n].inTransferQty)
        sheet.getCell(`Y${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`Y${m}`).numFmt = formatNumberInExcel(parseFloat(listRekap[n].inTransferQty), 2)
        sheet.getCell(`Z${m}`).value = parseFloat(listRekap[n].inTransferPrice)
        sheet.getCell(`Z${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`Z${m}`).numFmt = formatNumberInExcel(parseFloat(listRekap[n].inTransferPrice), 2)
      }
      for (let m = 65; m < (65 + footer.length); m += 1) {
        let n = listRekap.length + 10
        let counter = m - 65
        sheet.getCell(`C${n}`).font = {
          name: 'Courier New',
          family: 4,
          size: 11
        }
        sheet.getCell(`${String.fromCharCode(m)}${n}`).font = {
          name: 'Times New Roman',
          family: 4,
          size: 10
        }
        sheet.getCell(`${String.fromCharCode(m)}${n}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`${String.fromCharCode(m)}${n}`).value = footer[counter]
        sheet.getCell(`${String.fromCharCode(m)}${n}`).numFmt = formatNumberInExcel(footer[counter], 2)
      }

      sheet.getCell('L2').alignment = { vertical: 'middle', horizontal: 'center' }
      sheet.getCell('L2').value = 'LAPORAN NILAI PERSEDIAAN'
      sheet.getCell('L3').alignment = { vertical: 'middle', horizontal: 'center' }
      sheet.getCell('L3').value = `${storeInfo.name}`
      sheet.getCell('L4').alignment = { vertical: 'middle', horizontal: 'center' }
      sheet.getCell('L4').value = `PERIODE : ${moment(period, 'M').format('MMMM').concat('-', year)}`
      sheet.getCell('L5').alignment = { vertical: 'middle', horizontal: 'right' }
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        saveAs(blob, `REPORT - FIFO - VALUE${moment().format('YYYYMMDD')}.xlsx`)
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
  listRekap: PropTypes.array,
  dataSource: PropTypes.array,
  storeInfo: PropTypes.string,
  period: PropTypes.string,
  year: PropTypes.string
}

export default PrintXLS
