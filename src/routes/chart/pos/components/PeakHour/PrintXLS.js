/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicExcelReport } from 'components'

const PrintXLS = ({ listTrans, fromDate, toDate, storeInfo }) => {
  let totalData = 0
  let totalDataIn = 0

  // Declare Variable
  let count1 = listTrans.reduce((cnt, o) => cnt + o.count1, 0)
  let count2 = listTrans.reduce((cnt, o) => cnt + o.count2, 0)
  let count3 = listTrans.reduce((cnt, o) => cnt + o.count3, 0)
  let count4 = listTrans.reduce((cnt, o) => cnt + o.count4, 0)
  let count5 = listTrans.reduce((cnt, o) => cnt + o.count5, 0)
  let count6 = listTrans.reduce((cnt, o) => cnt + o.count6, 0)
  let count7 = listTrans.reduce((cnt, o) => cnt + o.count7, 0)
  let count8 = listTrans.reduce((cnt, o) => cnt + o.count8, 0)
  let count9 = listTrans.reduce((cnt, o) => cnt + o.count9, 0)
  let count10 = listTrans.reduce((cnt, o) => cnt + o.count10, 0)
  let count11 = listTrans.reduce((cnt, o) => cnt + o.count11, 0)
  let count12 = listTrans.reduce((cnt, o) => cnt + o.count12, 0)
  let count13 = listTrans.reduce((cnt, o) => cnt + o.count13, 0)
  let count14 = listTrans.reduce((cnt, o) => cnt + o.count14, 0)
  let count15 = listTrans.reduce((cnt, o) => cnt + o.count15, 0)
  let count16 = listTrans.reduce((cnt, o) => cnt + o.count16, 0)
  let count17 = listTrans.reduce((cnt, o) => cnt + o.count17, 0)
  let count18 = listTrans.reduce((cnt, o) => cnt + o.count18, 0)
  let count19 = listTrans.reduce((cnt, o) => cnt + o.count19, 0)
  let count20 = listTrans.reduce((cnt, o) => cnt + o.count20, 0)
  let count21 = listTrans.reduce((cnt, o) => cnt + o.count21, 0)
  let count22 = listTrans.reduce((cnt, o) => cnt + o.count22, 0)
  let count23 = listTrans.reduce((cnt, o) => cnt + o.count23, 0)
  let count24 = listTrans.reduce((cnt, o) => cnt + o.count24, 0)

  let countIn1 = listTrans.reduce((cnt, o) => cnt + o.countIn1, 0)
  let countIn2 = listTrans.reduce((cnt, o) => cnt + o.countIn2, 0)
  let countIn3 = listTrans.reduce((cnt, o) => cnt + o.countIn3, 0)
  let countIn4 = listTrans.reduce((cnt, o) => cnt + o.countIn4, 0)
  let countIn5 = listTrans.reduce((cnt, o) => cnt + o.countIn5, 0)
  let countIn6 = listTrans.reduce((cnt, o) => cnt + o.countIn6, 0)
  let countIn7 = listTrans.reduce((cnt, o) => cnt + o.countIn7, 0)
  let countIn8 = listTrans.reduce((cnt, o) => cnt + o.countIn8, 0)
  let countIn9 = listTrans.reduce((cnt, o) => cnt + o.countIn9, 0)
  let countIn10 = listTrans.reduce((cnt, o) => cnt + o.countIn10, 0)
  let countIn11 = listTrans.reduce((cnt, o) => cnt + o.countIn11, 0)
  let countIn12 = listTrans.reduce((cnt, o) => cnt + o.countIn12, 0)
  let countIn13 = listTrans.reduce((cnt, o) => cnt + o.countIn13, 0)
  let countIn14 = listTrans.reduce((cnt, o) => cnt + o.countIn14, 0)
  let countIn15 = listTrans.reduce((cnt, o) => cnt + o.countIn15, 0)
  let countIn16 = listTrans.reduce((cnt, o) => cnt + o.countIn16, 0)
  let countIn17 = listTrans.reduce((cnt, o) => cnt + o.countIn17, 0)
  let countIn18 = listTrans.reduce((cnt, o) => cnt + o.countIn18, 0)
  let countIn19 = listTrans.reduce((cnt, o) => cnt + o.countIn19, 0)
  let countIn20 = listTrans.reduce((cnt, o) => cnt + o.countIn20, 0)
  let countIn21 = listTrans.reduce((cnt, o) => cnt + o.countIn21, 0)
  let countIn22 = listTrans.reduce((cnt, o) => cnt + o.countIn22, 0)
  let countIn23 = listTrans.reduce((cnt, o) => cnt + o.countIn23, 0)
  let countIn24 = listTrans.reduce((cnt, o) => cnt + o.countIn24, 0)

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
        let totalCount = 0
        let totalCountIn = 0
        for (let m = 0; m < 24; m += 1) {
          totalCount += parseInt(data[`count${m + 1}`], 10)
        }
        for (let m = 0; m < 24; m += 1) {
          totalCountIn += parseInt(data[`countIn${m + 1}`], 10)
        }
        totalData += totalCount
        totalDataIn += totalCountIn

        let row = [
          { value: start, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          {},
          { value: data.transDateIn ? moment(data.transDateIn).format('DD-MMM-YYYY') : '-', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder },
          { value: data.transDate ? moment(data.transDate).format('DD-MMM-YYYY') : '-', alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder }
        ]
        for (let n = 0; n < 24; n += 1) {
          row.push({ value: `${data[`countIn${n + 1}`]} - ${data[`count${n + 1}`]}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        }
        row.push({ value: `${totalCountIn} - ${totalCount}`, alignment: { vertical: 'middle', horizontal: 'right' }, font: styles.tableBody, border: styles.tableBorder })
        body.push(row)
      }
      start += 1
    }
    return body
  }

  const title = [
    { value: 'LAPORAN PEAK HOUR', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.title },
    { value: `${storeInfo.name}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.merchant },
    { value: `PERIODE : ${moment(fromDate).format('DD-MMM-YYYY')}  TO  ${moment(toDate).format('DD-MMM-YYYY')}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.date }
  ]

  const tableHeader = [
    [
      { value: 'NO.', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'MASUK', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'KELUAR', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '0', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '1', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '2', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '3', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '4', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '5', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '6', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '7', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '8', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '9', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '10', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '11', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '12', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '13', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '14', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '15', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '16', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '17', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '18', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '19', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '20', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '21', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '22', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: '23', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder },
      { value: 'total', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableHeader, border: styles.tableBorder }
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
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter },
      { value: '', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter },
      { value: 'GRAND TOTAL', alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${countIn1} - ${count1}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${countIn2} - ${count2}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${countIn3} - ${count3}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${countIn4} - ${count4}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${countIn5} - ${count5}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${countIn6} - ${count6}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${countIn7} - ${count7}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${countIn8} - ${count8}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${countIn9} - ${count9}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${countIn10} - ${count10}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${countIn11} - ${count11}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${countIn12} - ${count12}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${countIn13} - ${count13}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${countIn14} - ${count14}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${countIn15} - ${count15}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${countIn16} - ${count16}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${countIn17} - ${count17}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${countIn18} - ${count18}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${countIn19} - ${count19}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${countIn20} - ${count20}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${countIn21} - ${count21}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${countIn22} - ${count22}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${countIn23} - ${count23}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${countIn24} - ${count24}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder },
      { value: `${totalDataIn} - ${totalData}`, alignment: { vertical: 'middle', horizontal: 'center' }, font: styles.tableFooter, border: styles.tableBorder }
    ]
  ]

  // Declare additional Props
  const XLSProps = {
    className: 'button-width02 button-extra-large bgcolor-green',
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
