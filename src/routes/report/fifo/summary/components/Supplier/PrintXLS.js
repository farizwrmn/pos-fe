/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { BasicExcelReport } from 'components'

const PrintXLS = ({ listRekap, listStoreLov, supplierName, storeInfo }) => {
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
    tablePrimary: {
      name: 'Times New Roman',
      family: 4,
      size: 10,
      bold: true
    },
    tableDanger: {
      name: 'Times New Roman',
      family: 4,
      size: 10,
      color: { argb: 'ff0000' }
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

  let tableHeader = []
  let tableFooter = []
  const createTableBody = (list) => {
    let tableBody = []
    let start = 1
    for (let key in list) {
      if (list.hasOwnProperty(key)) {
        let data = list[key]
        let row = []
        row.push({ value: start, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: '.', alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.supplierName || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.productCode || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.productName || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.categoryName || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.brandName || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.costPrice || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.sellPrice || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })

        const margin = `${Math.round(((parseFloat(data.sellPrice) - parseFloat(data.costPrice)) / parseFloat(data.sellPrice)) * 100)} %`
        row.push({ value: (margin || 0), alignment: styles.alignmentRight, font: margin < 10 ? styles.tableDanger : styles.tableBody, border: styles.tableBorder })
        const listStore = listStoreLov
          .filter(filtered => !filtered.storeName.includes('FK'))
        let totalCount = 0
        for (let key in listStore) {
          const record = listStore[key]
          // eslint-disable-next-line no-loop-func
          const count = data.listStore.filter(filtered => filtered.storeId === record.id).reduce((prev, next) => prev + (!next.countSales ? (next.countIn - next.countOut) : 0), 0)
          const countSales = data.listStore.filter(filtered => filtered.storeId === record.id).reduce((prev, next) => prev + (next.countSales || 0), 0)
          row.push({ value: (count || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: (countSales || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
          totalCount += count
        }
        row.push({ value: (totalCount || 0), alignment: styles.alignmentRight, font: styles.tablePrimary, border: styles.tableBorder })
        tableBody.push(row)
      }
      start += 1
    }
    const header = ([
      { value: 'NO', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
      { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'SUPPLIER', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'KODE PRODUK', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'NAMA PRODUK', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'CATEGORY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'BRAND', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'COST', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'PRICE', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'MARGIN', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder }
    ])
    tableHeader.push(header)
    const header1 = ([
      { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
      { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
      { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
      { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
      { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
      { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
      { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
      { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
      { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
      { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder }
    ])
    for (let key in listStoreLov) {
      const item = listStoreLov[key]
      if (!item.storeName.includes('FK')) {
        header.push({ value: item.storeName, alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder })
        header.push({ value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder })
        header1.push({ value: 'Qty', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder })
        header1.push({ value: 'Sales', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder })
      }
    }
    header.push({ value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder })
    header1.push({ value: 'Total Qty', alignment: styles.alignmentCenter, font: styles.tablePrimary, border: styles.tableBorder })
    tableHeader.push(header1)

    return tableBody
  }

  const title = [
    { value: 'LAPORAN REKAP STOK SUPPLIER', alignment: styles.alignmentCenter, font: styles.title },
    { value: `${storeInfo.name}`, alignment: styles.alignmentCenter, font: styles.merchant },
    { value: `SUPPLIER : ${supplierName}`, alignment: styles.alignmentCenter, font: styles.title }
  ]

  let tableBody
  try {
    tableBody = createTableBody(listRekap)
  } catch (e) {
    console.log(e)
  }

  // Declare additional Props
  const XLSProps = {
    paperSize: 9,
    orientation: 'portrait',
    data: listRekap,
    title,
    tableHeader,
    tableBody,
    tableFooter,
    fileName: 'LAPORAN REKAP FIFO'
  }

  return (
    <BasicExcelReport {...XLSProps} />
  )
}

PrintXLS.propTypes = {
  listRekap: PropTypes.array,
  storeInfo: PropTypes.string,
  period: PropTypes.string,
  year: PropTypes.string
}

export default PrintXLS
