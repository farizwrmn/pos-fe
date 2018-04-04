/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicExcelReport } from 'components'

const PrintXLS = ({ listRekap, period, year, storeInfo, activeKey }) => {
  let beginQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.beginQty), 0)
  let beginPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.beginPrice), 0)
  let purchaseQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.purchaseQty), 0)
  let purchasePrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.purchasePrice), 0)
  let adjInQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjInQty), 0)
  let adjInPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjInPrice), 0)
  let posQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.posQty), 0)
  let posPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.posPrice), 0)
  let adjOutQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjOutQty), 0)
  let adjOutPrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjOutPrice), 0)
  let count = listRekap.reduce((cnt, o) => cnt + parseFloat(o.count), 0)
  let amount = listRekap.reduce((cnt, o) => cnt + parseFloat(o.amount), 0)

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
        switch (activeKey) {
          case '0':
            // row.push({ value: start, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            // row.push({ value: '.', alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
            // row.push({ value: (data.productCode || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
            // row.push({ value: (data.productName || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
            // row.push({ value: (data.beginQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            // row.push({ value: (data.beginPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            // row.push({ value: (data.purchaseQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            // row.push({ value: (data.purchasePrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            // row.push({ value: (data.adjInQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            // row.push({ value: (data.adjInPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            // row.push({ value: (data.posQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            // row.push({ value: (data.posPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            // row.push({ value: (data.adjOutQty || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            // row.push({ value: (data.adjOutPrice || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            // row.push({ value: (data.count || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            // row.push({ value: (data.amount || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            // tableBody.push(row)
            row.push({ value: start, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            row.push({ value: '.', alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
            row.push({ value: (data.productCode || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
            row.push({ value: (data.productName || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
            row.push({ value: (data.beginQty || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            row.push({ value: (data.beginPrice || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            row.push({ value: (data.purchaseQty || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            row.push({ value: (data.purchasePrice || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            row.push({ value: (data.adjInQty || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            row.push({ value: (data.adjInPrice || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            row.push({ value: (data.posQty || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            row.push({ value: (data.posPrice || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            row.push({ value: (data.adjOutQty || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            row.push({ value: (data.adjOutPrice || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            row.push({ value: (data.count || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            row.push({ value: (data.amount || 0), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            tableBody.push(row)

            break
          case '1':
            row.push({ value: start, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            row.push({ value: '.', alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
            row.push({ value: (data.productCode || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
            row.push({ value: (data.productName || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
            row.push({ value: (parseFloat(data.amount) / parseFloat(data.count)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            row.push({ value: (data.count || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            row.push({ value: (data.amount || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
            tableBody.push(row)
            break
          default:
        }
      }
      start += 1
    }
    switch (activeKey) {
      case '0':
        tableFooter.push(
          [
            { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
            { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
            { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
            { value: 'GRAND TOTAL', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
            { value: `${beginQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
            { value: `${beginPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
            { value: `${purchaseQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
            { value: `${purchasePrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
            { value: `${adjInQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
            { value: `${adjInPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
            { value: `${posQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
            { value: `${posPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
            { value: `${adjOutQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
            { value: `${adjOutPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
            { value: `${count.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
            { value: `${amount.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder }
          ]
        )
        tableHeader.push(
          [
            { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
            { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
            { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
            { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
            { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
            { value: 'OPENING BALANCE', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
            { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
            { value: 'PURCHASE', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
            { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
            { value: 'ADJUST IN + SALES RETURN', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
            { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
            { value: 'SALES', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
            { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
            { value: 'ADJUST OUT + PURCHASE RETURN', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
            { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader },
            { value: 'CLOSING BALANCE', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder }
          ],
          [
            { value: 'NO', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
            { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'PRODUCT CODE', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'PRODUCT NAME', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'QTY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'COGS', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'QTY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'COGS', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'QTY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'COGS', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'QTY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'COGS', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'QTY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'COGS', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'QTY', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'COGS', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder }
          ]
        )
        break
      case '1':
        tableFooter.push(
          [
            { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
            { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
            { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
            { value: '', alignment: styles.alignmentCenter, font: styles.tableBody },
            { value: 'GRAND TOTAL', alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
            { value: `${count.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder },
            { value: `${amount.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder }
          ]
        )
        tableHeader.push(
          [
            { value: 'NO', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
            { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'PRODUCT CODE', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'PRODUCT NAME', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'COGS', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'BALANCE', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
            { value: 'TOTAL', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder }
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
      default:
    }
    return title
  }

  const title = [
    { value: getTitle(activeKey), alignment: styles.alignmentCenter, font: styles.title },
    { value: `${storeInfo.name}`, alignment: styles.alignmentCenter, font: styles.merchant },
    { value: `PERIODE : ${moment(period, 'MM').format('MMMM').concat('-', year)}`, alignment: styles.alignmentCenter, font: styles.title }
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
    fileName: getTitle(activeKey)
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
