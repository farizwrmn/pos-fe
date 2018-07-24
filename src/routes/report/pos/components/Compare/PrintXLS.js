/**
 * Created by boo on 05/19/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { BasicExcelReport } from 'components'
import moment from 'moment'

const PrintXLS = ({ listPOSCompareSvsI, tableHeader, fromDate, toDate, diffDay, storeInfo, category, brand }) => {
  const styles = {
    merchant: {
      name: 'Courier New',
      family: 4,
      size: 12
    },
    period: {
      name: 'Courier New',
      family: 4,
      size: 12
    },
    productType: {
      name: 'Courier New',
      family: 4,
      size: 10
    },
    title: {
      name: 'Courier New',
      family: 4,
      size: 12,
      underline: true
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
    tableFooter: {
      name: 'Times New Roman',
      family: 4,
      size: 10
    },
    tableBorder: {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } }
    }
  }

  let qtySoldTotal = 0
  let qtyMonthlyTOTotal = 0
  // let qtyBSTotal = 0
  // let qtyDLTotal = 0
  // let qtyGTTotal = 0
  // let qtyMITotal = 0
  let qtyTotal = 0
  if (listPOSCompareSvsI.length > 0) {
    qtySoldTotal = listPOSCompareSvsI.reduce((cnt, o) => cnt + parseFloat(o.salesQty), 0)
    qtyMonthlyTOTotal = listPOSCompareSvsI.reduce((cnt, o) => cnt + parseFloat(o.monthlyTO), 0)
    // qtyBSTotal = listPOSCompareSvsI.reduce((cnt, o) => cnt + parseFloat(o.brand01), 0)
    // qtyDLTotal = listPOSCompareSvsI.reduce((cnt, o) => cnt + parseFloat(o.brand02), 0)
    // qtyGTTotal = listPOSCompareSvsI.reduce((cnt, o) => cnt + parseFloat(o.brand03), 0)
    // qtyMITotal = listPOSCompareSvsI.reduce((cnt, o) => cnt + parseFloat(o.brand04), 0)
    qtyTotal = listPOSCompareSvsI.reduce((cnt, o) => cnt + parseFloat(o.total), 0)
  }

  let brandHeaders = []
  let brandFooters = []

  if (tableHeader && tableHeader.length > 0) {
    let brandHeader = []
    let brandFooter = []
    for (let i = 0; i < tableHeader.length; i += 1) {
      brandHeader.push(
        { value: tableHeader[i], alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder }
      )
      brandFooter.push(
        { value: listPOSCompareSvsI.reduce((cnt, o) => cnt + parseFloat(o[`brand0${i + 1}`]), 0), alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      )
    }
    brandHeaders = brandHeader
    brandFooters = brandFooter
  }

  const createTableBody = (list) => {
    let body = []
    let start = 1
    for (let key in list) {
      if (list.hasOwnProperty(key)) {
        let data = list[key]
        let row = []
        row.push({ value: start, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: data.sectionWidth, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: data.aspectRatio, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: data.rimDiameter, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: parseFloat(data.salesQty), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: parseFloat(data.monthlyTO), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        for (let i = 0; i < tableHeader.length; i += 1) {
          row.push({ value: data[`brand0${i + 1}`], alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        }
        row.push({ value: parseFloat(data.total), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        body.push(row)
      }
      start += 1
    }
    return body
  }

  const title = [
    { value: 'LAPORAN PENJUALAN - PERSEDIAAN', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
    { value: `${storeInfo.name}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant },
    { value: `PERIODE : ${moment(fromDate).format('DD-MMM-YYYY')}  TO  ${moment(toDate).format('DD-MMM-YYYY')}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.period },
    {},
    { value: `KATEGORI PRODUK : ${category || 'ALL CATEGORY'}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.productType },
    { value: `MERK : ${brand || 'ALL BRAND'}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.productType },
    {}
  ]

  const tableHeaders = [
    [
      { value: 'NO.', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'Section Width', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'Aspect Ratio', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'Rim Diameter', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: `Sold in ${diffDay > 0 ? `${diffDay} day${diffDay === 1 ? '' : 's'}` : ''}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'Monthly TO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'Total', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder }
    ]
  ]

  for (let i = 0; i < brandHeaders.length; i += 1) {
    tableHeaders[0].splice(6 + i, 0, brandHeaders[i])
  }

  const tableFooter = [
    [
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter },
      { value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: qtySoldTotal, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: qtyMonthlyTOTotal, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: qtyTotal, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder }
    ]
  ]

  for (let i = 0; i < brandFooters.length; i += 1) {
    tableFooter[0].splice(6 + i, 0, brandFooters[i])
  }

  let tableBody
  try {
    tableBody = createTableBody(listPOSCompareSvsI)
  } catch (e) {
    console.log(e)
  }

  // Declare additional Props
  const XLSProps = {
    className: 'button-width02 button-extra-large bgcolor-green',
    paperSize: 9,
    orientation: 'portrait',
    data: listPOSCompareSvsI,
    title,
    tableHeader: tableHeaders,
    tableBody,
    tableFooter,
    fileName: 'POS-Compare'
  }

  return (
    <BasicExcelReport {...XLSProps} />
  )
}

PrintXLS.propTypes = {
  listPOSCompareSvsI: PropTypes.array
}

export default PrintXLS
