import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicExcelReport } from 'components'

const PrintXLS = ({
  listInventoryTransfer,
  period
}) => {
  const styles = {
    merchant: {
      name: 'Courier New',
      family: 4,
      size: 12
    },
    title: {
      name: 'Courier New',
      family: 4,
      size: 12,
      underline: true
    },
    tableTitle: {
      name: 'Courier New',
      family: 4,
      size: 12,
      bold: true
    },
    tableHeader: {
      name: 'Courier New',
      family: 4,
      size: 11
    },
    tableBody: {
      name: 'Times New Roman',
      family: 4,
      size: 10
    },
    tableBorder: {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } }
    },
    alignmentLeft: {
      vertical: 'middle', horizontal: 'left'
    },
    alignmentCenter: {
      vertical: 'middle', horizontal: 'center'
    },
    alignmentRight: {
      vertical: 'middle', horizontal: 'right'
    }
  }

  let tableTitle = []
  let tableHeader = []
  let tableFooter = []
  const createTableBody = (list) => {
    let tableBody = []
    let start = 1
    for (let key in list) {
      if (list.hasOwnProperty(key)) {
        let data = list[key]
        let row = [
          { value: start, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: '.', alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.transNo || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.transDate ? moment(data.transDate).format('DD-MMM-YYYY') : '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.employeeName || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.statusText || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.createdBy || 0).toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder }
        ]
        tableBody.push(row)
      }
      start += 1
    }
    tableHeader.push(
      [
        { value: 'NO', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'TRANS NO', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'TRANS DATE', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'PIC', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'STATUS', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'CREATED BY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder }
      ]
    )
    return tableBody
  }

  const title = [
    { value: 'LAPORAN PERUBAHAN HARGA', alignment: styles.alignmentCenter, font: styles.title },
    { value: `PERIODE: ${period}`, alignment: styles.alignmentCenter, font: styles.title }
  ]

  const XLSProps = {
    paperSize: 9,
    orientation: 'portrait',
    data: listInventoryTransfer,
    title,
    tableTitle,
    tableHeader,
    tableBody: createTableBody(listInventoryTransfer),
    tableFooter,
    fileName: 'LAPORAN-PERUBAHAN-HARGA'
  }

  return (
    <BasicExcelReport {...XLSProps} />
  )
}

PrintXLS.propTypes = {
  listInventoryTransfer: PropTypes.array
}

export default PrintXLS
