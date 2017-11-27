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
  let outJSON = listRekap

  let groupBy = (xs, key) => {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x)
      return rv
    }, {})
  }
  let groubedByTeam = groupBy(outJSON, 'productCode')
  let arr = Object.keys(groubedByTeam).map((index) => groubedByTeam[index])

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

  let sheet = workbook.addWorksheet('POS 1',
    { pageSetup: { paperSize: 9, orientation: 'portrait' } })

const handleXLS = () => {
  if (period === '' && year === '') {
    warning({
      title: 'Parameter cannot be null',
      content: 'your Trans Date paramater probably not set...',
    })
  } else if (listRekap.length === 0) {
    warning({
      title: 'Parameter cannot be null',
      content: 'your Trans Date paramater probably not set...',
    })
  } else {
    sheet.getCell('F2').alignment = { vertical: 'middle', horizontal: 'center' }
    sheet.getCell('F2').value = 'LAPORAN KARTU STOK FIFO'
    sheet.getCell('F3').alignment = { vertical: 'middle', horizontal: 'center' }
    sheet.getCell('F3').value = `${storeInfo.name}`
    sheet.getCell('F4').alignment = { vertical: 'middle', horizontal: 'center' }
    sheet.getCell('F4').value = `PERIODE : ${moment(period, 'MM').format('MMMM').concat('-', year)}`
    sheet.getCell('J5').alignment = { vertical: 'middle', horizontal: 'right' }
    sheet.getCell('F2').font = {
      name: 'Calibri',
      family: 4,
      size: 12,
      underline: true,
    }
    sheet.getCell('F3').font = {
      name: 'Calibri',
      family: 4,
      size: 12,
    }
    sheet.getCell('F4').font = {
      name: 'Calibri',
      family: 4,
      size: 12,
    }
    sheet.getCell('J5').font = {
      name: 'Calibri',
      family: 4,
      size: 10,
    }
    const header = ['NO', '', 'DATE', 'TRANS', 'TYPE', 'IN', 'PRICE', 'AMOUNT', 'OUT', 'PRICE', 'AMOUNT', 'COUNT', 'AMOUNT']
    let m = 9
    for (let i = 0; i < arr.length; i += 1) {
      sheet.getCell(`A${m - 2}`).value = 'PRODUCT :'
      sheet.getCell(`A${m - 2}`).alignment = { vertical: 'middle', horizontal: 'right' }
      sheet.getCell(`C${m - 2}`).value = `${arr[i][0].productCode}`
      sheet.getCell(`C${m - 2}`).alignment = { vertical: 'middle', horizontal: 'left' }
      sheet.getCell(`D${m - 2}`).value = '-'
      sheet.getCell(`D${m - 2}`).alignment = { vertical: 'middle', horizontal: 'center' }
      sheet.getCell(`E${m - 2}`).value = `${arr[i][0].productName}`
      sheet.getCell(`E${m - 2}`).alignment = { vertical: 'middle', horizontal: 'left' }
      for (let char = 65; char < (65 + header.length); char += 1) {
        let o = m - 1
        let counter = char - 65
        sheet.getCell(`${String.fromCharCode(char)}${o}`).font = {
          name: 'Calibri',
          family: 4,
          size: 12,
          bold: true
        }
        sheet.getCell(`${String.fromCharCode(char)}${o}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`${String.fromCharCode(char)}${o}`).value = `${header[counter]}`
      }
      let countQtyValue = 0
      for (let n = 0; n < arr[i].length; n += 1) {
        countQtyValue = (parseFloat(countQtyValue) || 0) + (parseFloat(arr[i][n].pQty) || 0) - (parseFloat(arr[i][n].sQty) || 0)
        sheet.getCell(`A${m}`).value = `${parseInt((n + 1), 10)} .`
        sheet.getCell(`A${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`B${m}`).value = ''
        sheet.getCell(`B${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
        sheet.getCell(`C${m}`).value = `${moment(arr[i][n].transDate).format('DD-MMM-YYYY')}`
        sheet.getCell(`C${m}`).alignment = { vertical: 'middle', horizontal: 'left' }
        sheet.getCell(`D${m}`).value = `${arr[i][n].transNo}`
        sheet.getCell(`D${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`E${m}`).value = `${arr[i][n].transType}`
        sheet.getCell(`E${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`F${m}`).value = `${(parseFloat(arr[i][n].pQty) || '').toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`F${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`G${m}`).value = `${(parseFloat(arr[i][n].pPrice) || '').toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`G${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`H${m}`).value = `${(parseFloat(arr[i][n].pAmount) || '').toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`H${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`I${m}`).value = `${(parseFloat(arr[i][n].sQty) || '').toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`I${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`J${m}`).value = `${(parseFloat(arr[i][n].sPrice) || '').toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`J${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`K${m}`).value = `${(parseFloat(arr[i][n].sAmount) || '').toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`K${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`L${m}`).value = `${countQtyValue.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`L${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`M${m}`).value = `${((parseFloat(arr[i][n].pAmount) || 0) - (parseFloat(arr[i][n].sAmount) || 0)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        sheet.getCell(`M${m}`).alignment = { vertical: 'middle', horizontal: 'right' }
        m = m + 1        
      }
      let pAmount = arr[i].reduce((cnt, o) => cnt + (parseFloat(o.pAmount) || 0), 0)
      let sAmount = arr[i].reduce((cnt, o) => cnt + (parseFloat(o.sAmount) || 0), 0)
      let footer = [
        '',
        '',
        '',
        '',
        'GRAND TOTAL',      
        `${(arr[i].reduce((cnt, o) => cnt + (parseFloat(o.pQty) || 0), 0)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        '',
        `${(arr[i].reduce((cnt, o) => cnt + (parseFloat(o.pAmount) || 0), 0)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `${(arr[i].reduce((cnt, o) => cnt + (parseFloat(o.sQty) || 0), 0)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        '',
        `${(arr[i].reduce((cnt, o) => cnt + (parseFloat(o.sAmount) || 0), 0)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        '',        
        `${(pAmount - sAmount).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      ]
      for (let char = 65; char < (65 + footer.length); char += 1) {
        let o = m
        let counter = char - 65
        sheet.getCell(`${String.fromCharCode(char)}${o}`).font = {
          name: 'Calibri',
          family: 4,
          size: 11,
        }
        sheet.getCell(`${String.fromCharCode(char)}${o}`).alignment = { vertical: 'middle', horizontal: 'right' }
        sheet.getCell(`${String.fromCharCode(char)}${o}`).value = `${footer[counter]}`
      }
      m = m + 5
    }

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
  location: PropTypes.object,
  listRekap: PropTypes.array,
  dataSource: PropTypes.array,
  storeInfo: PropTypes.string,
  period: PropTypes.string,
  year: PropTypes.string,
  app: PropTypes.object,
}

export default PrintXLS
