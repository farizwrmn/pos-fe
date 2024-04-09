/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicExcelReport } from 'components'

const PrintXLS = ({ listRekap, period, year, storeInfo }) => {
  const styles = {
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
    },
    merchant: {
      name: 'Courier New',
      family: 4,
      size: 12
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
        row.push({ value: (data.employee.employeeId || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.employee.employeeName || '').toString(), alignment: styles.alignmentLeft, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.employee.bankName || ''), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.employee.accountNo || ''), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: (data.employee.accountName || ''), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: moment(data.createdAt).format('YYYY-MM-DD'), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({ value: moment(data.createdAt).format('HH:mm'), alignment: styles.alignmentRight, font: styles.tableBody, border: styles.tableBorder })
        row.push({
          value: (data.employee && data.employee.store && data.employee.store.storeName ? data.employee.store.storeName.toString() : ''),
          alignment: styles.alignmentLeft,
          font: styles.tableBody,
          border: styles.tableBorder
        })
        tableBody.push(row)
      }
      start += 1
    }
    tableHeader.push(
      [
        { value: 'NO', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: '', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'KODE KARYAWAN', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'NAMA KARYAWAN', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'BANK', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'NO AKUN', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'NAMA AKUN', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'LOGIN DATE', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'LOGIN TIME', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder },
        { value: 'NAMA STORE', alignment: styles.alignmentCenter, font: styles.tableHeader, border: styles.tableBorder }
      ]
    )

    return tableBody
  }

  const title = [
    { value: 'LAPORAN CHECK IN KARYAWAN', alignment: styles.alignmentCenter, font: styles.title },
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
    fileName: 'Report'
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
