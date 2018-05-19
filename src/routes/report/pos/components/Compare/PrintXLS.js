/**
 * Created by boo on 05/19/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, Modal } from 'antd'
import { saveAs } from 'file-saver'
import * as Excel from 'exceljs/dist/exceljs.min.js'
import moment from 'moment'

const warning = Modal.warning

const PrintXLS = ({ listPOSCompareSvsI, dataSource, fromDate, toDate, storeInfo, category, brand }) => {
  let qtySoldTotal = 0
  let qtyMonthlyTOTotal = 0
  let qtyBSTotal = 0
  let qtyDLTotal = 0
  let qtyGTTotal = 0
  let qtyMITotal = 0
  let qtyTotal = 0
  if (listPOSCompareSvsI.length > 0) {
    qtySoldTotal = listPOSCompareSvsI.reduce((cnt, o) => cnt + parseFloat(o.salesQty), 0)
    qtyMonthlyTOTotal = listPOSCompareSvsI.reduce((cnt, o) => cnt + parseFloat(o.monthlyTO), 0)
    qtyBSTotal = listPOSCompareSvsI.reduce((cnt, o) => cnt + parseFloat(o.BS), 0)
    qtyDLTotal = listPOSCompareSvsI.reduce((cnt, o) => cnt + parseFloat(o.DL), 0)
    qtyGTTotal = listPOSCompareSvsI.reduce((cnt, o) => cnt + parseFloat(o.GT), 0)
    qtyMITotal = listPOSCompareSvsI.reduce((cnt, o) => cnt + parseFloat(o.MI), 0)
    qtyTotal = listPOSCompareSvsI.reduce((cnt, o) => cnt + parseFloat(o.total), 0)
  }

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
    } else if (listPOSCompareSvsI.length === 0) {
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
      for (let n = 0; n <= listPOSCompareSvsI.length; n += 1) {
        for (let m = 65; m < 74; m += 1) {
          let o = 11 + n
          sheet.getCell(`${String.fromCharCode(m)}${o}`).font = {
            name: 'Times New Roman',
            family: 4,
            size: 10
          }
        }
      }
      const header = ['NO.', 'Section Width', 'Aspect Ratio', 'Rim Diameter', 'Sold', 'Monthly TO', 'BS', 'DL', 'GT', 'MI', 'Total']
      const footer = [
        '',
        '',
        '',
        'TOTAL',
        `${qtySoldTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
        `${qtyMonthlyTOTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${qtyBSTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${qtyDLTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${qtyGTTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${qtyMITotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${qtyTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
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

      for (let n = 0; n < listPOSCompareSvsI.length; n += 1) {
        let m = 9 + n
        sheet.getCell(`A${m}`).value = `${parseInt(n + 1, 10)}`
        sheet.getCell(`A${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`B${m}`).value = listPOSCompareSvsI[n].sectionWidth
        sheet.getCell(`B${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
        sheet.getCell(`C${m}`).value = listPOSCompareSvsI[n].aspectRatio
        sheet.getCell(`C${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
        sheet.getCell(`D${m}`).value = listPOSCompareSvsI[n].rimDiameter
        sheet.getCell(`D${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
        sheet.getCell(`E${m}`).value = `${(parseFloat(listPOSCompareSvsI[n].salesQty)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`E${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`F${m}`).value = `${(parseFloat(listPOSCompareSvsI[n].monthlyTO)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`F${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`G${m}`).value = `${(parseFloat(listPOSCompareSvsI[n].BS)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`G${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`H${m}`).value = `${(parseFloat(listPOSCompareSvsI[n].DL)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`H${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`I${m}`).value = `${(parseFloat(listPOSCompareSvsI[n].GT)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`I${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`J${m}`).value = `${(parseFloat(listPOSCompareSvsI[n].MI)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`J${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`K${m}`).value = `${(parseFloat(listPOSCompareSvsI[n].total)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`K${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
      }

      for (let m = 65; m < (65 + footer.length); m += 1) {
        let n = listPOSCompareSvsI.length + 10
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
      sheet.getCell('F2').value = 'LAPORAN PENJUALAN - PERSEDIAAN'
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
        saveAs(blob, `POS-Compare${moment().format('YYYYMMDD')}.xlsx`)
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
  listPOSCompareSvsI: PropTypes.array
}

export default PrintXLS
