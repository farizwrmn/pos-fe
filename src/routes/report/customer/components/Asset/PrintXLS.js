import React from 'react'
import PropTypes from 'prop-types'
import { RepeatExcelReport } from 'components'

const PrintXLS = ({ listAsset, storeInfo }) => {
  const listData = _.reduce(listAsset, (group, item) => {
    (group[item.memberCode] = group[item.memberCode] || []).push(item)
    return group
  }, [])

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
    period: {
      name: 'Courier New',
      family: 4,
      size: 12
    },
    tableTitle: {
      name: 'Courier New',
      family: 4,
      size: 12,
      bold: true
    },
    tableHeader: {
      name: 'Courier New',
      family: 4,
      size: 11,
      bold: true
    },
    tableBody: {
      name: 'Times New Roman',
      family: 4,
      size: 10
    },
    tableFooter: {
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
    { value: 'LAPORAN ASET CUSTOMER', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
    { value: `${storeInfo.name}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant }
  ]

  const tableHeader = [
    [
      { value: 'NO', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'NO PLAT', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'SUB TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'DISKON', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder }
    ]
  ]

  let tableTitles = []
  let tableBodies = []
  let tableFooters = []
  for (let key in listData) {
    let tableTitle = [
      [
        { value: `${listData[key][0].memberCode}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle },
        { value: '-', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableTitle },
        { value: `${listData[key][0].memberName}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableTitle }
      ]
    ]
    tableTitles.push(tableTitle)

    let countQtyValue = 0
    let group = []
    for (let n = 0; n < listData[key].length; n += 1) {
      countQtyValue = ((parseFloat(countQtyValue) || 0) + (parseFloat(listData[key][n].pQty) || 0)) - (parseFloat(listData[key][n].sQty) || 0)
      let tableBody = []
      tableBody.push({ value: `${parseInt((n + 1), 10)}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: '.', alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: `${listData[key][n].policeNo}`, alignment: { vertical: 'middle', horizontal: 'left' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: (parseFloat(listData[key][n].grandTotal) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: (parseFloat(listData[key][n].totalDiscount) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      tableBody.push({ value: (parseFloat(listData[key][n].nettoTotal) || 0), alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
      group.push(tableBody)
    }
    tableBodies.push(group)


    let subTotal = listData[key].reduce((cnt, o) => cnt + (parseFloat(o.grandTotal) || 0), 0)
    let totalDiscount = listData[key].reduce((cnt, o) => cnt + (parseFloat(o.totalDiscount) || 0), 0)
    let total = listData[key].reduce((cnt, o) => cnt + (parseFloat(o.nettoTotal) || 0), 0)
    let tableFooter = []
    tableFooter.push({ value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter })
    tableFooter.push({ value: '', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter })
    tableFooter.push({ value: 'TOTAL', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder })
    tableFooter.push({ value: subTotal, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder })
    tableFooter.push({ value: totalDiscount, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder })
    tableFooter.push({ value: total, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableFooter, border: styles.tableBorder })
    tableFooters.push(tableFooter)
  }

  // Declare additional Props
  const XLSProps = {
    className: 'button-width02 button-extra-large bgcolor-green',
    paperSize: 9,
    orientation: 'portrait',
    title,
    tableTitle: tableTitles,
    tableHeader,
    tableBody: tableBodies,
    tableFooter: tableFooters,
    data: Object.keys(listData),
    fileName: 'Asset-Summary'
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
  year: PropTypes.string
  // app: PropTypes.object
}

export default PrintXLS
