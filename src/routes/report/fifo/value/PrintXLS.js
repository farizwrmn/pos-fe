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
  let transferInQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transferInQty || 0), 0)
  let transferInPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transferInPrice || 0), 0)
  let transferOutQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transferOutQty || 0), 0)
  let transferOutPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.transferOutPrice || 0), 0)
  let count = listRekap.reduce((cnt, o) => cnt + parseFloat(o.count), 0)
  let amount = listRekap.reduce((cnt, o) => cnt + parseFloat(o.amount), 0)
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
      const header = ['', '', '', '', '', 'SALDO AWAL', '', 'PEMBELIAN', '', 'ADJ IN + RTR JUAL', '', 'PENJUALAN', '', '', 'ADJ OUT + RTR BELI', '', 'SALDO AKHIR', 'LABA-RUGI KOTOR', 'IN TRANSIT + TRANSIT', '', 'IN TRANSFER', '']
      const header2 = [
        'NO.',
        '',
        'PRODUCT CODE',
        'PRODUCT NAME',
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
        `${beginQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${beginPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${purchaseQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${purchasePrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${adjInQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${adjInPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${transferInQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${transferInPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${posQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${valuePrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${posPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${adjOutQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${adjOutPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${transferOutQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${transferOutPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${count.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${amount.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${(parseFloat(valuePrice) - parseFloat(posPrice)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${inTransitQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${inTransitPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${inTransferQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${inTransferPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
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
        sheet.getCell(`E${m}`).value = `${parseFloat(listRekap[n].beginQty).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`E${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`F${m}`).value = `${(parseFloat(listRekap[n].beginPrice)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`F${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`G${m}`).value = `${(parseFloat(listRekap[n].purchaseQty)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`G${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`H${m}`).value = `${(parseFloat(listRekap[n].purchasePrice)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`H${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`I${m}`).value = `${(parseFloat(listRekap[n].adjInQty)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`I${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`J${m}`).value = `${(parseFloat(listRekap[n].adjInPrice)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`J${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`K${m}`).value = `${(parseFloat(listRekap[n].transferInQty)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`K${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`L${m}`).value = `${(parseFloat(listRekap[n].transferInPrice)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`L${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`M${m}`).value = `${(parseFloat(listRekap[n].posQty)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`M${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`N${m}`).value = `${(parseFloat(listRekap[n].valuePrice)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`N${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`O${m}`).value = `${(parseFloat(listRekap[n].posPrice)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`O${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`P${m}`).value = `${(parseFloat(listRekap[n].adjOutQty)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`P${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`Q${m}`).value = `${(parseFloat(listRekap[n].adjOutPrice)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`Q${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`R${m}`).value = `${(parseFloat(listRekap[n].transferOutQty)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`R${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`S${m}`).value = `${(parseFloat(listRekap[n].transferOutPrice)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`S${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`T${m}`).value = `${(parseFloat(listRekap[n].count)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`T${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`U${m}`).value = `${(parseFloat(listRekap[n].amount)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`U${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`V${m}`).value = `${(parseFloat(listRekap[n].valuePrice) - parseFloat(listRekap[n].posPrice)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`V${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`W${m}`).value = `${(parseFloat(listRekap[n].transferOutQty)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`W${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`X${m}`).value = `${(parseFloat(listRekap[n].transferOutPrice)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`X${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`Y${m}`).value = `${(parseFloat(listRekap[n].count)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`Y${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`Z${m}`).value = `${(parseFloat(listRekap[n].amount)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`Z${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
      }

      for (let m = 65; m < (65 + footer.length); m += 1) {
        let n = listRekap.length + 10
        let counter = m - 65
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
        sheet.getCell(`${String.fromCharCode(m)}${n}`).value = `${footer[counter]}`
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
        saveAs(blob, `REPORT-FIFO-VALUE${moment().format('YYYYMMDD')}.xlsx`)
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
