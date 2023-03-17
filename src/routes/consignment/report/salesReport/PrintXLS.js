import React from 'react'
import PropTypes from 'prop-types'
import { RepeatExcelReport } from 'components'
import moment from 'moment'

const PrintXLS = ({ dataSource, selectedVendor, dateRange }) => {
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

  const title = [
    { value: 'LAPORAN PENJUALAN', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
    { value: dateRange && dateRange.length > 0 ? `Tanggal: ${moment(dateRange[0]).format('DD MMMM YYYY')} - ${moment(dateRange[1]).format('DD MMMM YYYY')}` : '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody },
    { value: selectedVendor && selectedVendor.id ? `Vendor: ${selectedVendor.vendor_code} - ${selectedVendor.name}` : '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableBody }
  ]

  const tableHeaderStyle = {
    alignment: { vertical: 'middle', horizontal: 'center' },
    font: styles.tableHeader,
    border: styles.tableBorder
  }

  const tableHeaderContent = [
    'NO',
    'TANGGAL',
    'FAKTUR PENJUALAN',
    'NAMA PRODUK',
    'QTY',
    'PAYMENT',
    'TOTAL',
    'KOMISI',
    'CHARGE',
    'GRAB',
    'MODAL',
    'PROFIT'
  ]

  const tableHeader = [tableHeaderContent.map(content => ({ value: content, ...tableHeaderStyle }))
  ]

  let tableTitle = dataSource
    .filter(filtered => filtered.list.length > 0)
    .map(record => ([
      [
        { value: 'Vendor', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
        { value: `${record.vendor.vendor_code}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '-', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableTitle },
        { value: `${record.vendor.name}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle }
      ]
    ]))

  let tableBody = dataSource
    .filter(filtered => filtered.list.length > 0)
    .map((dataBody) => {
      let data = dataBody.list
        .map((listData, index) => {
          const datalist = [
            (index + 1 || '').toString(),
            listData.createdAt || '-',
            listData['salesOrder.number'] || listData['returnOrder.number'],
            listData['stock.product.product_name'] || listData['salesOrderProduct.stock.product.product_name'],
            listData.quantity || '-',
            listData['salesOrder.paymentMethods.method'] || listData['returnOrder.salesOrder.paymentMethods.method'],
            listData.total || 0,
            listData.commission || 0,
            listData.charge || 0,
            listData.commissionGrab || 0,
            (listData['stock.product.capital'] || 0) || (listData['salesOrderProduct.stock.product.capital'] || 0),
            listData.profit || 0
          ]
          if (index === dataBody.list.length - 1) {
            const summary = [
              '',
              '',
              '',
              '',
              '',
              'Total',
              dataBody.summary.subTotal,
              dataBody.summary.commission,
              dataBody.summary.charge,
              dataBody.summary.grab,
              dataBody.summary.capital,
              dataBody.summary.profit
            ]
            return [
              datalist.map(dataDetail => ({
                value: dataDetail,
                alignment: { vertical: 'middle', horizontal: 'middle' },
                font: {
                  ...styles.tableBody,
                  color: listData.type === 'rtn' ? { argb: 'FFFF0000' } : { argb: '00000000' }
                },
                border: styles.tableBorder
              })),
              summary.map(dataDetail => ({
                value: dataDetail,
                alignment: { vertical: 'middle', horizontal: 'middle' },
                font: styles.tableBody,
                border: styles.tableBorder
              }))
            ]
          }
          return datalist.map(dataDetail => ({
            value: dataDetail,
            alignment: { vertical: 'middle', horizontal: 'middle' },
            font: {
              ...styles.tableBody,
              color: listData.type === 'rtn' ? { argb: 'FFFF0000' } : { argb: '00000000' }
            },
            border: styles.tableBorder
          }))
        })
      let result = []
      data.map((record, index) => {
        if (data.length - 1 === index) {
          result.push(record[0])
          result.push(record[1])
          return true
        }
        result.push(record)
        return true
      })
      return result
    })

  const getTableFilters = (data, dataHeader) => {
    const resultData = [dataHeader.map(dataHeaderDetail => ({ value: dataHeaderDetail, ...tableHeaderStyle }))]
    let index = 1
    data.map(record => record.list.map((listData) => {
      const datalist = [
        index.toString(),
        listData.createdAt || '-',
        listData['salesOrder.number'] || listData['returnOrder.number'],
        listData['stock.product.product_name'] || listData['salesOrderProduct.stock.product.product_name'],
        listData.quantity || '-',
        listData['salesOrder.paymentMethods.method'] || listData['returnOrder.salesOrder.paymentMethods.method'],
        listData.total || 0,
        listData.commission || 0,
        listData.charge || 0,
        listData.grab || 0,
        (listData['stock.product.capital'] || 0) || (listData['salesOrderProduct.stock.product.capital'] || 0),
        listData.profit || 0
      ]
      index += 1
      resultData.push(datalist.map(dataDetail => ({
        value: dataDetail,
        alignment: { vertical: 'middle', horizontal: 'middle' },
        font: {
          ...styles.tableBody,
          color: listData.type === 'rtn' ? { argb: 'FFFF0000' } : { argb: '00000000' }
        },
        border: styles.tableBorder
      })))
      return listData
    })
    )
    return resultData
  }

  // Declare additional Props
  const XLSProps = {
    buttonType: 'default',
    iconSize: '',
    buttonSize: 'large',
    name: 'Excel',
    className: '',
    buttonStyle: { background: 'transparent', border: 'none', padding: 0 },
    paperSize: 9,
    orientation: 'portrait',
    data: dataSource.filter(filtered => filtered.list.length > 0),
    title,
    tableHeader,
    tableFilter: getTableFilters(dataSource, [
      'NO',
      'TANGGAL',
      'FAKTUR PENJUALAN',
      'NAMA PRODUK',
      'QTY',
      'PAYMENT',
      'TOTAL',
      'KOMISI',
      'CHARGE',
      'GRAB',
      'MODAL',
      'PROFIT'
    ]),
    fileName: 'SalesReport-',
    tableTitle,
    tableBody
  }

  return (
    <RepeatExcelReport {...XLSProps} />
  )
}

PrintXLS.propTypes = {
  dataSource: PropTypes.object,
  storeInfo: PropTypes.object
}

export default PrintXLS
