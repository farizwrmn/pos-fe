/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { BasicExcelReport } from 'components'

const PrintXLS = ({ dataSource, storeInfo }) => {
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

  const tableBody = (list) => {
    let body = []
    let start = 1
    for (let key in list) {
      if (list.hasOwnProperty(key)) {
        let data = list[key]
        let row = []
        row.push({ value: start, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: '.', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: data.typeCode.toString(), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: data.typeName.toString(), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: parseFloat(data.discPct01 || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: parseFloat(data.discPct02 || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: parseFloat(data.discPct03 || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: parseFloat(data.discNominal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: data.sellPrice.toString(), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
        body.push(row)
      }
      start += 1
    }
    return body
  }

  const title = [
    { value: 'LAPORAN DAFTAR TIPE PELANGGAN', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
    { value: `${storeInfo.name}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant }
  ]

  const header = [
    [
      { value: 'NO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'TYPE CODE', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'TIPE NAME', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'DISC-1', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'DISC-2', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'DISC-3', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'DISC(NOMINAL)', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'CATEGORY', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder }
    ]
  ]
  const contentBody = dataSource.length > 0 ? tableBody(dataSource) : []

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
    header,
    body: contentBody,
    fileName: 'CustomerType-Summary'
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
