/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { BasicExcelReport } from 'components'

const PrintXLS = ({ listTrans, storeInfo }) => {
  // Declare Variable
  let total = (listTrans || []).reduce((cnt, o) => cnt + o.payable, 0)

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
        const totalValue = data.payable
        let row = [
          { value: start, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: '.', alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data['supplier.supplierName'] || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (data['supplier.supplierTaxId'] || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder },
          { value: (totalValue || 0), isNumber: true, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder }
        ]
        tableBody.push(row)
      }
      start += 1
    }
    tableHeader.push(
      [
        { value: 'NO', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'NAMA SUPPLIER', alignment: styles.alignmentCenter, font: styles.tableHeader },
        { value: 'NPWP', alignment: styles.alignmentCenter, font: styles.tableHeader },

        { value: 'SISA HUTANG', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder }
      ]
    )
    tableFooter.push(
      [
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: '', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
        { value: 'SUBTOTAL', alignment: styles.alignmentCenter, font: styles.tableBody },

        { value: total, isNumber: true, alignment: styles.alignmentCenter, font: styles.tableBody }
      ]
    )
    return tableBody
  }
  const title = [
    { value: 'LAPORAN SISA HUTANG', alignment: styles.alignmentCenter, font: styles.title },
    { value: `${storeInfo.name}`, alignment: styles.alignmentCenter, font: styles.merchant }
  ]
  // Declare additional Props
  const XLSProps = {
    paperSize: 9,
    orientation: 'portrait',
    data: listTrans,
    title,
    tableTitle,
    tableHeader,
    tableBody: createTableBody(listTrans),
    tableFooter,
    fileName: 'LAPORAN-SISA-HUTANG'
  }

  return (
    <BasicExcelReport {...XLSProps} />
  )
}

PrintXLS.propTypes = {
  listTrans: PropTypes.array.isRequired,
  storeInfo: PropTypes.string.isRequired,
  period: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired
}

export default PrintXLS
