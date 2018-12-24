import React from 'react'
import PropTypes from 'prop-types'
import { RepeatExcelReport } from 'components'

const PrintXLS = ({ data, storeInfo, name }) => {
  const styles = {
    merchant: {
      name: 'Courier New',
      family: 4,
      size: 12
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
  const title = [
    { value: 'DAFTAR SPESIFIKASI BARANG', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant },
    { value: `${storeInfo.name}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant }
  ]
  const tableHeaderStyle = {
    alignment: { vertical: 'middle', horizontal: 'center' },
    font: styles.tableHeader,
    border: styles.tableBorder
  }
  const tableHeaderContent = [
    'NO',
    '',
    'CATEGORY CODE',
    'CATEGORY NAME',
    'SPECIFICATION',
    'VALUE'
  ]
  const tableHeader = [
    tableHeaderContent.map(content => ({ value: content, ...tableHeaderStyle }))
  ]

  let tableTitle = data
    .filter(filtered => filtered.specification.length > 0)
    .map(dataTitle => ([
      [
        { value: 'PRODUCT', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: `${dataTitle.productCode}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '-', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableTitle },
        { value: `${dataTitle.productName}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle }
      ]
    ]))

  let tableBody = data
    .filter(filtered => filtered.specification.length > 0)
    .map(dataBody => dataBody.specification
      .map((listData, index) => (
        [
          { value: index + 1, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: '.', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
          { value: listData.categoryCode || '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
          { value: listData.categoryName || '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
          { value: listData.name || '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
          { value: listData.value || '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder }
        ]
      )))

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
    data: data.filter(filtered => filtered.specification.length > 0),
    title,
    tableHeader,
    fileName: 'ProductSpecification-Summary',
    tableTitle,
    tableBody
  }

  return (
    <RepeatExcelReport {...XLSProps} />
  )
}

PrintXLS.propTypes = {
  data: PropTypes.object,
  storeInfo: PropTypes.object
}

export default PrintXLS
