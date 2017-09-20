/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from 'antd'
import { saveAs } from 'file-saver'
import * as Excel from 'exceljs/dist/exceljs.min.js'
// webpack.config.js, exceljs compiled warning
import moment from 'moment'

const PrintXLS = () => {
  const workbook = new Excel.Workbook()
  workbook.creator = 'dmiPOS';
  workbook.created = new Date(1985, 8, 30);
  workbook.lastPrinted = new Date(2016, 9, 27);
  workbook.views = [
    {
      x: 0, y: 0, width: 10000, height: 20000,
      firstSheet: 0, activeTab: 1, visibility: 'visible'
    }
  ]
  var sheet = workbook.addWorksheet('My Sheet',
    { pageSetup: { paperSize: 9, orientation: 'landscape' } })
  const handleExcel = () => {
    console.log('handleExcel', workbook)
    workbook.xlsx.writeBuffer().then(function (data) {
      var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `pointReport${moment().format('YYYYMMDD')}.xlsx`)
      console.log('Excel')
    })
  }
  return(
    <div onClick={() => handleExcel()}><Icon type="file-excel" /> Excel</div>
  )
}

PrintXLS.propTypes = {
  location: PropTypes.object,
}

export default PrintXLS
