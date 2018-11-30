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
const { formatNumberInExcel } = numberFormat

const PrintXLS = ({ listDaily, dataSource, fromDate, toDate, storeInfo, category, brand }) => {
  let qtyTotal = listDaily.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
  let grandTotal = listDaily.reduce((cnt, o) => cnt + parseFloat((o.sellPrice || o.sellingPrice) * o.qty), 0)
  let discountTotal = listDaily.reduce((cnt, o) => cnt + (o.totalDiscount), 0)
  let dppTotal = listDaily.reduce((cnt, o) => cnt + parseFloat(o.DPP), 0)
  let ppnTotal = listDaily.reduce((cnt, o) => cnt + parseFloat(o.PPN), 0)
  let nettoTotal = listDaily.reduce((cnt, o) => cnt + parseFloat(o.netto), 0)

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
    } else if (listDaily.length === 0) {
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
      for (let n = 0; n <= listDaily.length; n += 1) {
        for (let m = 65; m < 74; m += 1) {
          let o = 9 + n
          sheet.getCell(`${String.fromCharCode(m)}${o}`).font = {
            name: 'Times New Roman',
            family: 4,
            size: 10
          }
        }
      }
      const header = ['NO.', 'KODE', 'PRODUK', 'QTY', 'TOTAL', 'DISKON', 'DPP', 'PPN', 'NETTO']
      const footer = [
        '',
        '',
        'GRAND TOTAL',
        qtyTotal,
        grandTotal,
        discountTotal,
        dppTotal,
        ppnTotal,
        nettoTotal
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

      for (let n = 0; n < listDaily.length; n += 1) {
        const discount = listDaily[n].totalDiscount
        let m = 9 + n
        sheet.getCell(`A${m}`).value = `${parseInt(n + 1, 10)}`
        sheet.getCell(`A${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`B${m}`).value = listDaily[n].productCode
        sheet.getCell(`B${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
        sheet.getCell(`C${m}`).value = listDaily[n].productName
        sheet.getCell(`C${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
        sheet.getCell(`D${m}`).value = parseInt(listDaily[n].qty, 10)
        sheet.getCell(`D${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`D${m}`).numFmt = formatNumberInExcel(parseInt(listDaily[n].qty, 10), 2)
        sheet.getCell(`E${m}`).value = (parseFloat(listDaily[n].total))
        sheet.getCell(`E${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`E${m}`).numFmt = formatNumberInExcel(parseFloat(listDaily[n].total), 2)
        sheet.getCell(`F${m}`).value = discount
        sheet.getCell(`F${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`F${m}`).numFmt = formatNumberInExcel(discount, 2)
        sheet.getCell(`G${m}`).value = (parseFloat(listDaily[n].DPP))
        sheet.getCell(`G${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`G${m}`).numFmt = formatNumberInExcel(parseFloat(listDaily[n].DPP), 2)
        sheet.getCell(`H${m}`).value = (parseFloat(listDaily[n].PPN))
        sheet.getCell(`H${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`H${m}`).numFmt = formatNumberInExcel(parseFloat(listDaily[n].PPN), 2)
        sheet.getCell(`I${m}`).value = (parseFloat(listDaily[n].netto))
        sheet.getCell(`I${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`I${m}`).numFmt = formatNumberInExcel(parseFloat(listDaily[n].netto), 2)
      }

      for (let m = 65; m < (65 + footer.length); m += 1) {
        let n = listDaily.length + 10
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

      sheet.getCell('F2').alignment = { vertical: 'middle', horizontal: 'center' }
      sheet.getCell('F2').value = 'LAPORAN REKAP PENJUALAN'
      sheet.getCell('F3').alignment = { vertical: 'middle', horizontal: 'center' }
      sheet.getCell('F3').value = `${storeInfo.name}`
      sheet.getCell('F4').alignment = { vertical: 'middle', horizontal: 'center' }
      sheet.getCell('F4').value = `PERIODE : ${moment(fromDate).format('DD-MMM-YYYY')}  TO  ${moment(toDate).format('DD-MMM-YYYY')}`
      sheet.getCell('J5').alignment = { vertical: 'middle', horizontal: 'right' }
      sheet.getCell('J5').value = `KATEGORI PRODUK : ${category || 'ALL CATEGORY'}`
      sheet.getCell('J6').alignment = { vertical: 'middle', horizontal: 'right' }
      sheet.getCell('J6').value = `MERK : ${brand || 'ALL BRAND'}`
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        saveAs(blob, `POS-Monthly${moment().format('YYYYMMDD')}.xlsx`)
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
  listDaily: PropTypes.array
}

export default PrintXLS
