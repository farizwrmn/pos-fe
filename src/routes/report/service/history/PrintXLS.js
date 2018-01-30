import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { RepeatExcelReport } from 'components'

const PrintXLS = ({ user, listMechanic, storeInfo, fromDate, toDate }) => {
  let groupBy = (xs, key) => {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x)
      return rv
    }, {})
  }
  let groupByTeam = groupBy(listMechanic, 'employeeName')
  let arr = Object.keys(groupByTeam).map(index => groupByTeam[index])

  const styles = {
    title: {
      name: 'Calibri',
      family: 4,
      size: 12,
      underline: true,
    },
    merchant: {
      name: 'Calibri',
      family: 4,
      size: 12,
    },
    period: {
      name: 'Calibri',
      family: 4,
      size: 12,
    },
    tableTitle: {
      name: 'Calibri',
      family: 4,
      size: 12,
      bold: true,
    },
    tableHeader: {
      name: 'Calibri',
      family: 4,
      size: 12,
      bold: true,
    },
    tableBody: {
      name: 'Calibri',
      family: 4,
      size: 11,
    },
    tableFooter: {
      name: 'Calibri',
      family: 4,
      size: 11,
    },
    tableBorder: {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } },
    },
  }

  const title = [
    { value: 'LAPORAN HISTORY JASA PER MEKANIK', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.header },
    { value: `${storeInfo.name}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant },
    { value: `PERIODE : ${moment(fromDate).format('DD-MMM-YYYY')}  TO  ${moment(toDate).format('DD-MMM-YYYY')}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.period },
  ]

  const tableHeader = [
    { value: 'NO', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
    { value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
    { value: 'TRANSACTION NO', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
    { value: 'TRANSACTION DATE', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
    { value: 'SERVICE NAME', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
    { value: 'QTY', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
    { value: 'SELLING PRICE', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
    { value: 'AMOUNT', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableHeader, border: styles.tableBorder },
  ]

  let tableTitles = []
  let tableBodies = []
  let tableFooters = []
  for (let i = 0; i < arr.length; i += 1) {
    let tableTitle = []
    tableTitle.push({ value: 'Employee Name:', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle })
    tableTitle.push({ value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableTitle })
    tableTitle.push({ value: `${arr[i][0].employeeName}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle })
    tableTitles.push(tableTitle)

    let group = []
    for (let n = 0; n < arr[i].length; n += 1) {
      let tableBody = []
      tableBody.push({ value: `${parseInt((n + 1), 10)} .`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: '', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: `${arr[i][n].transNo}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: `${moment(arr[i][n].transDate).format('DD-MMM-YYYY')}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: `${arr[i][n].serviceName}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: `${(parseFloat(arr[i][n].qty) || '').toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: `${(parseFloat(arr[i][n].sellingPrice) || '').toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: `${(parseFloat(arr[i][n].amount) || '').toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      group.push(tableBody)
    }
    tableBodies.push(group)

    let totalQty = arr[i].reduce((cnt, o) => cnt + (parseFloat(o.qty) || 0), 0)
    let totalSellingPrice = arr[i].reduce((cnt, o) => cnt + (parseFloat(o.sellingPrice) || 0), 0)
    let totalAmount = arr[i].reduce((cnt, o) => cnt + (parseFloat(o.amount) || 0), 0)

    let tableFooter = []
    tableFooter.push({ value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter })
    tableFooter.push({ value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter })
    tableFooter.push({ value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter })
    tableFooter.push({ value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter })
    tableFooter.push({ value: 'GRAND TOTAL', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder })
    tableFooter.push({ value: `${totalQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder })
    tableFooter.push({ value: `${totalSellingPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder })
    tableFooter.push({ value: `${totalAmount.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder })
    tableFooters.push(tableFooter)
  }

  // Declare additional Props
  const XLSProps = {
    className: 'button-width02 button-extra-large bgcolor-green',
    width: ['4%', '2%', '16%', '16%', '25%', '7%', '13%', '13%'],
    paperSize: 9,
    orientation: 'portrait',
    title,
    tableTitle: tableTitles,
    tableHeader,
    tableBody: tableBodies,
    tableFooter: tableFooters,
    data: arr,
    fileName: 'Mechanic-Services-Summary',
  }

  return (
    <RepeatExcelReport {...XLSProps} />
  )
}

PrintXLS.propTypes = {
  location: PropTypes.object,
  listRekap: PropTypes.array,
//  dataSource: PropTypes.array,
  storeInfo: PropTypes.string,
  period: PropTypes.string,
  year: PropTypes.string,
  //app: PropTypes.object,
}

export default PrintXLS
