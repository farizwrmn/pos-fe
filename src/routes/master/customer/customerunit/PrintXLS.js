import React from 'react'
import PropTypes from 'prop-types'
import { RepeatExcelReport } from 'components'

const PrintXLS = ({ dataSource, dataList, storeInfo, name }) => {
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
    'NO PLAT',
    'MEREK',
    'MODEL',
    'TYPE',
    'TAHUN',
    'NO RANGKA',
    'NO MESIN'
  ]
  const tableHeader = [
    tableHeaderContent.map(content => ({ value: content, ...tableHeaderStyle }))
  ]

  let tableTitle = dataSource
    .filter(filtered => filtered.memberUnit.length > 0)
    .map(dataTitle => ([
      [
        { value: 'MEMBER', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: `${dataTitle.memberCode}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '-', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableTitle },
        { value: `${dataTitle.memberName}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle }
      ]
    ]))

  let tableBody = dataSource
    .filter(filtered => filtered.memberUnit.length > 0)
    .map(dataBody => dataBody.memberUnit
      .map((listData, index) => {
        const datalist = [
          (index + 1 || '').toString(),
          listData.policeNo,
          listData.merk,
          listData.model,
          listData.type,
          (listData.year || '').toString(),
          listData.chassisNo,
          listData.machineNo
        ]
        return datalist.map(dataDetail => ({
          value: dataDetail,
          alignment: { vertical: 'middle', horizontal: 'middle' },
          font: styles.tableBody,
          border: styles.tableBorder
        }))
      }))

  const getTableFilters = (data, dataHeader) => {
    const resultData = [dataHeader.map(dataHeaderDetail => ({ value: dataHeaderDetail, ...tableHeaderStyle }))]
    return resultData.concat(data
      .map((listData, index) => {
        const datalist = [
          (index + 1 || '').toString(),
          listData.memberCode,
          listData.memberName,
          listData.policeNo,
          listData.merk,
          listData.model,
          listData.type,
          (listData.year || '').toString(),
          listData.chassisNo,
          listData.machineNo
        ]
        return datalist.map(dataDetail => ({
          value: dataDetail,
          alignment: { vertical: 'middle', horizontal: 'middle' },
          font: styles.tableBody,
          border: styles.tableBorder
        }))
      })
    )
  }
  // Declare additional Props
  const XLSProps = {
    buttonType: 'default',
    iconSize: '',
    buttonSize: 'large',
    name,
    className: '',
    buttonStyle: { background: 'transparent', border: 'none', padding: 0 },
    paperSize: 9,
    orientation: 'portrait',
    data: dataSource.filter(filtered => filtered.memberUnit.length > 0),
    title,
    tableHeader,
    tableFilter: getTableFilters(dataList, [
      'NO',
      'CODE',
      'MEMBER',
      'NO PLAT',
      'MEREK',
      'MODEL',
      'TYPE',
      'TAHUN',
      'NO RANGKA',
      'NO MESIN'
    ]),
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
