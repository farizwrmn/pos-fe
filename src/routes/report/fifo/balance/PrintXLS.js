/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicExcelReport, RepeatExcelReport } from 'components'

const PrintXLS = ({ listRekap, period, year, storeInfo, activeKey }) => {
  let count = listRekap.reduce((cnt, o) => cnt + parseFloat(o.count), 0)
  let beginQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.beginQty), 0)
  let purchaseQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.purchaseQty), 0)
  let adjInQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjInQty), 0)
  let posQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.posQty), 0)
  let valuePrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.valuePrice), 0)
  let adjOutQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjOutQty), 0)

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
      name: 'Calibri',
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
    let countQtyValue = 0
    let totalQtyIn = list.reduce((cnt, o) => cnt + parseFloat(o.pQty || 0), 0)
    let totalQtyOut = list.reduce((cnt, o) => cnt + parseFloat(o.sQty || 0), 0)
    for (let key in list) {
      if (list.hasOwnProperty(key)) {
        let data = list[key]
        countQtyValue = ((parseFloat(countQtyValue) || 0) + (parseFloat(data.pQty) || 0)) - (parseFloat(data.sQty) || 0)
        let row = []
        switch (activeKey) {
        case '0':
          row.push({ value: start, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: '.', alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: (data.productCode || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: (data.productName || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: (data.beginQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: (data.purchaseQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: (data.adjInQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: (data.posQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: (data.adjOutQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: (data.count || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
          tableBody.push(row)
          break
        case '1':
          row.push({ value: start, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: '.', alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: (data.productCode || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: (data.productName || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: (data.count || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
          tableBody.push(row)
          break
        case '2':
          row.push({ value: start, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: '.', alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: (data.productCode || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: (data.productName || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: (data.beginQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: (data.purchaseQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: (data.adjInQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: (data.posQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: (data.valuePrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: (data.adjOutQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: (data.count || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
          tableBody.push(row)
          break
        case '3':
          row.push({ value: start, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: '.', alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: moment(data.transDate).format('DD-MMM-YYYY'), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: data.transNo.toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: data.transType.toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: (data.pQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: (data.sQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
          row.push({ value: countQtyValue.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
          tableBody.push(row)
          break
        default:
        }
      }
      start += 1
    }
    switch (activeKey) {
    case '0':
      tableHeader.push(
        [
          { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
          { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
          { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
          { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
          { value: 'OPENING BALANCE', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'PURCHASE', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'ADJUST IN + SALES RETURN', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'SALES', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'ADJUST OUT + PURCHASE RETURN', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'CLOSING BALANCE', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder }
        ],
        [
          { value: 'NO', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'PRODUCT CODE', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'PRODUCT NAME', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'QTY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'QTY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'QTY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'QTY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'QTY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'QTY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder }
        ]
      )
      tableFooter.push(
        [
          { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
          { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
          { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
          { value: 'GRAND TOTAL', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: `${beginQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: `${purchaseQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: `${adjInQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: `${posQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: `${adjOutQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: `${count.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder }
        ]
      )
      break
    case '1':
      tableHeader.push(
        [
          { value: 'NO', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'PRODUCT CODE', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'PRODUCT NAME', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'BALANCE', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder }
        ]
      )
      tableFooter.push(
        [
          { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
          { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
          { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
          { value: 'GRAND TOTAL', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: `${count.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder }
        ]
      )
      break
    case '2':
      tableHeader.push(
        [
          { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
          { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
          { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
          { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
          { value: 'OPENING BALANCE', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'PURCHASE', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'ADJUST IN + SALES RETURN', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
          { value: 'SALES', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'ADJUST OUT + PURCHASE RETURN', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'CLOSING BALANCE', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder }
        ],
        [
          { value: 'NO', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'PRODUCT CODE', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'PRODUCT NAME', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'QTY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'QTY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'QTY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'QTY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'NET SALES', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'QTY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
          { value: 'QTY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder }
        ]
      )
      tableFooter.push(
        [
          { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
          { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
          { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
          { value: 'GRAND TOTAL', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: `${beginQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: `${purchaseQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: `${adjInQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: `${posQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: `${valuePrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: `${adjOutQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: `${count.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder }
        ]
      )
      break
    case '3':
      tableTitle.push([
        [
          { value: 'PRODUCT', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
          { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle },
          { value: `${list[0].productCode}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
          { value: '-', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableTitle },
          { value: `${list[0].productName}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle }
        ]
      ])
      tableHeader = [
        { value: 'NO', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'DATE', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'TRANS', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'TYPE', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'IN', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'OUT', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'COUNT', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder }
      ]
      tableFooter.push(
        [
          { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
          { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
          { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
          { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
          { value: 'GRAND TOTAL', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: `${totalQtyIn.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: `${totalQtyOut.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
          { value: '', alignment: styles.alignmentCenter, font: styles.tableBody }
        ]
      )
      break
    default:
    }
    return tableBody
  }

  const getTitle = (activeKey) => {
    let title
    switch (activeKey) {
    case '0':
      title = 'LAPORAN REKAP FIFO'
      break
    case '1':
      title = 'LAPORAN SISA SALDO STOCK'
      break
    case '2':
      title = 'LAPORAN NILAI PERSEDIAAN'
      break
    case '3':
      title = 'LAPORAN KARTU STOCK FIFO'
      break
    default:
    }
    return title
  }

  const title = [
    { value: getTitle(activeKey), alignment: styles.alignmentCenter, font: styles.title },
    { value: `${storeInfo.name}`, alignment: styles.alignmentCenter, font: styles.merchant },
    { value: `PERIODE : ${moment(period, 'MM').format('MMMM').concat('-', year)}`, alignment: styles.alignmentCenter, font: styles.title }
  ]

  let groupBy = (xs, key) => {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x)
      return rv
    }, {})
  }
  let groubedByTeam = groupBy(listRekap, 'productCode')
  let arr = Object.keys(groubedByTeam).map(index => groubedByTeam[index])

  let tableBody = []
  try {
    if (activeKey === '3') {
      for (let i = 0; i < arr.length; i += 1) {
        tableBody.push(createTableBody(arr[i]))
      }
    } else {
      tableBody = createTableBody(listRekap)
    }
  } catch (e) {
    console.log(e)
  }

  const getData = (activeKey) => {
    let data = listRekap
    if (activeKey === '3') {
      data = arr
    }
    return data
  }

  // Declare additional Props
  const XLSProps = {
    paperSize: 9,
    orientation: 'portrait',
    data: getData(activeKey),
    title,
    tableTitle,
    tableHeader,
    tableBody,
    tableFooter,
    fileName: getTitle(activeKey)
  }

  let reportType
  if (activeKey === '3') {
    reportType = (<RepeatExcelReport {...XLSProps} />)
  } else {
    reportType = (<BasicExcelReport {...XLSProps} />)
  }

  return (
    { ...reportType }
  )
}

PrintXLS.propTypes = {
  listRekap: PropTypes.array.isRequired,
  storeInfo: PropTypes.string.isRequired,
  period: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired
}

export default PrintXLS
