import React from 'react'
import PropTypes from 'prop-types'
import { BasicExcelReport } from 'components'
import moment from 'moment'

const PrintXLS = ({ dataSource, summary, dateRange }) => {
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
        row.push({ value: start, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: list[key].createdAt ? moment(list[key].createdAt).format('DD MMM YYYY') : '-', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: list[key].number || (list[key]['returnOrder.number']), alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: list[key].method, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: list[key].type !== 'RTN' ? list[key].total : Number(`-${list[key].total}`), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        body.push(row)
      }
      start += 1
    }

    let totalRow = []
    totalRow.push({ value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
    totalRow.push({ value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
    totalRow.push({ value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
    totalRow.push({ value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody, border: styles.tableBorder })
    totalRow.push({ value: summary.total || 0, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
    body.push(totalRow)
    return body
  }

  const title = [
    { value: 'LAPORAN JURNAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
    { value: `Tanggal: ${moment(dateRange).format('DD MMMM YYYY')} - ${moment(dateRange).format('DD MMMM YYYY')}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody }
  ]

  const tableHeader = [
    [
      { value: 'NO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'TANGGAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'FAKTUR', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'PAYMENT', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder }
    ]
  ]

  let tableBody
  try {
    tableBody = createTableBody(dataSource)
  } catch (e) {
    console.log(e)
  }

  // Declare additional Props
  const XLSProps = {
    buttonType: '',
    iconSize: '',
    buttonSize: '',
    className: '',
    name: 'Excel',
    buttonStyle: { background: 'transparent', border: 'none', padding: 0 },
    paperSize: 9,
    orientation: 'portrait',
    data: dataSource,
    title,
    tableHeader,
    tableBody,
    fileName: 'Journal-report'
  }

  return (
    <BasicExcelReport {...XLSProps} />
  )
}

PrintXLS.propTypes = {
  dataSource: PropTypes.object,
  storeInfo: PropTypes.object
}

export default PrintXLS
