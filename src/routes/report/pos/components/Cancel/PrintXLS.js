/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicExcelReport } from 'components'

const PrintXLS = ({ listTrans, fromDate, toDate, storeInfo }) => {
  let grandTotal = listTrans.reduce((cnt, o) => cnt + o.total, 0)
  let discountTotal = listTrans.reduce((cnt, o) => cnt + o.discount, 0)
  let dppTotal = listTrans.reduce((cnt, o) => cnt + o.DPP, 0)
  let ppnTotal = listTrans.reduce((cnt, o) => cnt + o.PPN, 0)
  let nettoTotal = listTrans.reduce((cnt, o) => cnt + o.netto, 0)
  let dineInTotal = listTrans.reduce((cnt, o) => cnt + o.dineInTax, 0)

  const styles = {
    title: {
      name: 'Courier New',
      family: 4,
      size: 12,
      underline: true
    },
    merchant: {
      name: 'Courier New',
      family: 4,
      size: 12
    },
    date: {
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
    },
    tableFooter: {
      name: 'Times New Roman',
      family: 4,
      size: 10
    }
  }

  const createTableBody = (list) => {
    let body = []
    const rows = list
    let start = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = [
          { value: start, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: '.', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
          { value: (data.transNo || '').toString(), alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder },
          { value: moment(data.transDate).format('DD-MMM-YYYY'), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: parseFloat(data.total), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: parseFloat(data.discount), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: parseFloat(data.DPP), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: parseFloat(data.PPN), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: parseFloat(data.netto), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: parseFloat(data.dineInTax), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: data.cashier, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder }
        ]
        body.push(row)
      }
      start += 1
    }
    return body
  }

  const title = [
    { value: 'LAPORAN PENJUALAN BATAL PER FAKTUR', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
    { value: `${storeInfo.name}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant },
    { value: `PERIODE : ${moment(fromDate).format('DD-MMM-YYYY')}  TO  ${moment(toDate).format('DD-MMM-YYYY')}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.date }
  ]

  const tableHeader = [
    [
      { value: 'NO.', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'NO_FAKTUR', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'TANGGAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'DISKON', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'DPP', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'PPN', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'NETTO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'DINE IN TAX', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'CASHIER', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder }
    ]
  ]

  let tableBody
  try {
    tableBody = createTableBody(listTrans)
  } catch (e) {
    console.log(e)
  }

  const tableFooter = [
    [
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter },
      { value: 'GRAND TOTAL', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: grandTotal, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: discountTotal, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: dppTotal, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: ppnTotal, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: nettoTotal, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: dineInTotal, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder }
    ]
  ]

  // Declare additional Props
  const XLSProps = {
    className: 'button-width02 button-extra-large bgcolor-green',
    // width:s ['6%', '17%', '16%', '16%', '15%', '15%', '15%'],
    paperSize: 9,
    orientation: 'portrait',
    formatStyle: styles,
    data: listTrans,
    title,
    tableHeader,
    tableBody,
    tableFooter,
    fileName: 'POS-Summary'
  }

  return (
    <BasicExcelReport {...XLSProps} />
  )
}

PrintXLS.propTypes = {
  location: PropTypes.object,
  listTrans: PropTypes.array,
  fromDate: PropTypes.string,
  toDate: PropTypes.string,
  storeInfo: PropTypes.object
}

export default PrintXLS
