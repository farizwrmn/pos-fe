import React from 'react'
import PropTypes from 'prop-types'
import { BasicExcelReport } from 'components'

const PrintXLS = ({ data, storeInfo, name }) => {
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
    }
  }

  const createTableBody = (list) => {
    let body = []
    let start = 1
    for (let key in list) {
      if (list.hasOwnProperty(key)) {
        let row = []
        row.push({ value: start.toString(), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: '.', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (list[key].brandName || '').toString(), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
        body.push(row)
      }
      start += 1
    }
    return body
  }

  const title = [
    { value: 'LAPORAN DAFTAR BRAND', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
    { value: `${storeInfo.name}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant }
  ]

  const tableHeader = [
    [
      { value: 'NO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'NAMA', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
    ]
  ]

  let tableBody
  try {
    tableBody = createTableBody(data)
  } catch (e) {
    console.log(e)
  }

  // Declare additional Props
  const XLSProps = {
    buttonType: 'default',
    iconSize: '',
    buttonSize: 'large',
    name,
    className: '',
    buttonStyle: { background: 'transparent', padding: 0 },
    paperSize: 9,
    orientation: 'portrait',
    data,
    title,
    tableHeader,
    tableBody,
    fileName: 'Brand-Summary'
  }

  return (
    <BasicExcelReport {...XLSProps} />
  )
}

PrintXLS.propTypes = {
  data: PropTypes.object,
  storeInfo: PropTypes.object
}

export default PrintXLS
