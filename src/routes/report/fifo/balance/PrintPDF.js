/**
 * Created by veirry on 28/11/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport, RepeatReport } from 'components'

const PrintPDF = ({ user, listRekap, storeInfo, period, year, activeKey }) => {
  const styles = {
    header: {
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 10]
    },
    subheader: {
      fontSize: 16,
      bold: true,
      margin: [0, 10, 0, 5]
    },
    tableExample: {
      margin: [0, 5, 0, 15]
    },
    tableHeader: {
      bold: true,
      fontSize: 13,
      color: 'black'
    },
    tableTitle: {
      fontSize: 14,
      margin: [0, 20, 0, 8]
    },
    textLeft: {
      fontSize: 11,
      alignment: 'left'
    },
    textCenter: {
      fontSize: 11,
      alignment: 'center'
    },
    textRight: {
      fontSize: 11,
      alignment: 'right'
    }
  }
  // Declare Function
  const createTableBody = (tabledata) => {
    let inQty = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.pQty) || 0), 0)
    let outQty = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.sQty) || 0), 0)

    let body = []
    if (activeKey === '3') {
      body.push(
        [
          { fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' },
          { fontSize: 12, text: 'DATE', style: 'tableHeader', alignment: 'center' },
          { fontSize: 12, text: 'TRANS', style: 'tableHeader', alignment: 'center' },
          { fontSize: 12, text: 'TYPE', style: 'tableHeader', alignment: 'center' },
          { fontSize: 12, text: 'IN', style: 'tableHeader', alignment: 'center' },
          { fontSize: 12, text: 'OUT', style: 'tableHeader', alignment: 'center' },
          { fontSize: 12, text: 'COUNT', style: 'tableHeader', alignment: 'center' }
        ]
      )
    }
    const rows = tabledata
    let count = 1
    let countQtyValue = 0
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        countQtyValue = ((parseFloat(countQtyValue) || 0) + (parseFloat(data.pQty) || 0)) - (parseFloat(data.sQty) || 0)
        let row = []
        switch (activeKey) {
        case '0':
          row.push({ text: count, style: 'textCenter' })
          row.push({ text: data.productCode.toString(), style: 'textLeft' })
          row.push({ text: data.productName.toString(), style: 'textLeft' })
          row.push({ text: data.beginQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), style: 'textRight' })
          row.push({ text: data.purchaseQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), style: 'textRight' })
          row.push({ text: data.adjInQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), style: 'textRight' })
          row.push({ text: data.posQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), style: 'textRight' })
          row.push({ text: data.adjOutQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), style: 'textRight' })
          row.push({ text: data.count.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), style: 'textRight' })
          body.push(row)
          break
        case '1':
          row.push({ text: count, style: 'textCenter' })
          row.push({ text: data.productCode.toString(), style: 'textLeft' })
          row.push({ text: data.productName.toString(), style: 'textLeft' })
          row.push({ text: data.count.toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 }), style: 'textRight' })
          body.push(row)
          break
        case '2':
          row.push({ text: count, style: 'textCenter' })
          row.push({ text: data.productCode.toString(), style: 'textLeft' })
          row.push({ text: data.productName.toString(), style: 'textLeft' })
          row.push({ text: data.beginQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), style: 'textRight' })
          row.push({ text: data.purchaseQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), style: 'textRight' })
          row.push({ text: data.adjInQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), style: 'textRight' })
          row.push({ text: data.posQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), style: 'textRight' })
          row.push({ text: data.valuePrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), style: 'textRight' })
          row.push({ text: data.adjOutQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), style: 'textRight' })
          row.push({ text: data.count.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), style: 'textRight' })
          body.push(row)
          break
        case '3':
          row.push({ text: count, style: 'textCenter' })
          row.push({ text: moment(data.transDate).format('DD-MMM-YYYY'), style: 'textLeft' })
          row.push({ text: data.transNo.toString(), style: 'textLeft' })
          row.push({ text: data.transType.toString(), style: 'textLeft' })
          row.push({ text: (parseFloat(data.pQty) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 }), style: 'textRight' })
          row.push({ text: (parseFloat(data.sQty) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 }), style: 'textRight' })
          row.push({ text: countQtyValue.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), style: 'textRight' })
          body.push(row)
          break
        default:
        }
      }
      count += 1
    }
    if (activeKey === '3') {
      body.push(
        [
          { text: 'Grand Total', colSpan: 4, style: 'textCenter' },
          {},
          {},
          {},
          { text: `${inQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'textRight' },
          { text: `${outQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'textRight' },
          {}
        ]
      )
    }
    return body
  }

  // Declare Variable
  let beginQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.beginQty), 0)
  let purchaseQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.purchaseQty), 0)
  let adjInQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjInQty), 0)
  let posQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.posQty), 0)
  let valuePrice = listRekap.reduce((cnt, o) => cnt + parseFloat(o.valuePrice), 0)
  let adjOutQty = listRekap.reduce((cnt, o) => cnt + parseFloat(o.adjOutQty), 0)
  let count = listRekap.reduce((cnt, o) => cnt + parseFloat(o.count), 0)

  let tableHeader = []
  let tableFooter = []
  let headerTitle
  let widths = []
  let underline
  let pageSize
  switch (activeKey) {
  case '0':
    headerTitle = 'LAPORAN REKAP FIFO'
    underline = 1050
    widths.push('4%', '20%', '28%', '8%', '8%', '8%', '8%', '8%', '8%')
    pageSize = { width: 842, height: 1150 }
    tableHeader.push(
      [
        { fontSize: 12, text: 'NO', rowSpan: 2, alignment: 'center' },
        { fontSize: 12, text: 'PRODUCT CODE', rowSpan: 2, alignment: 'center' },
        { fontSize: 12, text: 'PRODUCT NAME', rowSpan: 2, alignment: 'center' },
        { fontSize: 12, text: 'OPENING BALANCE', alignment: 'center' },
        { fontSize: 12, text: 'PURCHASE', alignment: 'center' },
        { fontSize: 12, text: 'ADJUST IN + SALES RETURN', alignment: 'center' },
        { fontSize: 12, text: 'SALES', alignment: 'center' },
        { fontSize: 12, text: 'ADJUST OUT + PURHCASE RETURN', alignment: 'center' },
        { fontSize: 12, text: 'CLOSING BALANCE', alignment: 'center' }
      ]
    )
    tableHeader.push(
      [
        {},
        {},
        {},
        { fontSize: 12, text: 'QTY', alignment: 'center' },
        { fontSize: 12, text: 'QTY', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'QTY', alignment: 'center' },
        { fontSize: 12, text: 'QTY', alignment: 'center' },
        { fontSize: 12, text: 'QTY', alignment: 'center' },
        { fontSize: 12, text: 'QTY', alignment: 'center' }
      ]
    )
    tableFooter.push(
      [
        { text: 'Grand Total', colSpan: 3, alignment: 'center', fontSize: 12 },
        {},
        {},
        { text: `${beginQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'textRight' },
        { text: `${purchaseQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'textRight' },
        { text: `${adjInQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'textRight' },
        { text: `${posQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'textRight' },
        { text: `${adjOutQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'textRight' },
        { text: `${count.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'textRight' }
      ]
    )
    break
  case '1':
    headerTitle = 'LAPORAN SISA SALDO STOCK'
    underline = 747
    widths.push('6%', '30%', '50%', '15%')
    pageSize = 'A4'
    tableHeader.push(
      [
        { fontSize: 12, text: 'NO', alignment: 'center' },
        { fontSize: 12, text: 'PRODUCT CODE', alignment: 'center' },
        { fontSize: 12, text: 'PRODUCT NAME', alignment: 'center' },
        { fontSize: 12, text: 'BALANCE', alignment: 'center' }
      ]
    )
    tableFooter.push(
      [
        { text: 'Grand Total', colSpan: 3, alignment: 'center', fontSize: 12 },
        {},
        {},
        { text: `${count.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 }
      ]
    )
    break
  case '2':
    headerTitle = 'LAPORAN NILAI PERSEDIAAN'
    underline = 1330
    widths.push('4%', '16%', '24%', '8%', '8%', '8%', '8%', '8%', '8%', '8%')
    pageSize = { width: 842, height: 1430 }
    tableHeader.push(
      [
        { fontSize: 12, text: 'NO', rowSpan: 2, alignment: 'center' },
        { fontSize: 12, text: 'PRODUCT CODE', rowSpan: 2, alignment: 'center' },
        { fontSize: 12, text: 'PRODUCT NAME', rowSpan: 2, alignment: 'center' },
        { fontSize: 12, text: 'OPENING BALANCE', alignment: 'center' },
        { fontSize: 12, text: 'PURCHASE', alignment: 'center' },
        { fontSize: 12, text: 'ADJUST IN + SALES RETURN', alignment: 'center' },
        { fontSize: 12, text: 'SALES', colSpan: 2, alignment: 'center' },
        {},
        { fontSize: 12, text: 'ADJUST OUT + PURCHASE RETURN', alignment: 'center' },
        { fontSize: 12, text: 'CLOSING BALANCE', alignment: 'center' }
      ]
    )
    tableHeader.push(
      [
        {},
        {},
        {},
        { fontSize: 12, text: 'QTY', alignment: 'center' },
        { fontSize: 12, text: 'QTY', style: 'tableHeader', alignment: 'center' },
        { fontSize: 12, text: 'QTY', alignment: 'center' },
        { fontSize: 12, text: 'QTY', alignment: 'center' },
        { fontSize: 12, text: 'NET SALES', alignment: 'center' },
        { fontSize: 12, text: 'QTY', alignment: 'center' },
        { fontSize: 12, text: 'QTY', alignment: 'center' }
      ]
    )
    tableFooter.push(
      [
        { text: 'Grand Total', colSpan: 3, alignment: 'center', fontSize: 12 },
        {},
        {},
        { text: `${beginQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'textRight' },
        { text: `${purchaseQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'textRight' },
        { text: `${adjInQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'textRight' },
        { text: `${posQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'textRight' },
        { text: `${valuePrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'textRight' },
        { text: `${adjOutQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'textRight' },
        { text: `${count.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'textRight' }
      ]
    )
    break
  case '3':
    headerTitle = 'LAPORAN KARTU STOK FIFO'
    underline = 742
    widths.push('6%', '20%', '30%', '14%', '10%', '10%', '10%')
    pageSize = 'A4'
    break
  default:
  }

  const header = {
    stack: [
      {
        stack: [
          {
            stack: storeInfo.stackHeader01
          },
          {
            text: headerTitle,
            style: 'header',
            fontSize: 18,
            alignment: 'center'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: underline, y2: 5, lineWidth: 0.5 }]
          },
          {
            columns: [
              {
                text: `\nPERIODE: ${moment(period, 'MM').format('MMMM').concat('-', year)}`,
                fontSize: 12,
                alignment: 'left'
              },
              {
                text: '',
                fontSize: 12,
                alignment: 'center'
              },
              {
                text: '',
                fontSize: 12,
                alignment: 'right'
              }
            ]
          }
        ]
      }
    ],
    margin: [50, 12, 50, 30]
  }
  const footer = (currentPage, pageCount) => {
    return {
      margin: [50, 30, 50, 0],
      stack: [
        {
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: underline, y2: 5, lineWidth: 0.5 }]
        },
        {
          columns: [
            {
              text: `Tanggal cetak: ${moment().format('LLLL')}`,
              margin: [0, 0, 0, 0],
              fontSize: 9,
              alignment: 'left'
            },
            {
              text: `Dicetak oleh: ${user.username}`,
              margin: [0, 0, 0, 0],
              fontSize: 9,
              alignment: 'center'
            },
            {
              text: `Halaman: ${currentPage.toString()} dari ${pageCount}`,
              fontSize: 9,
              margin: [0, 0, 0, 0],
              alignment: 'right'
            }
          ]
        }
      ]
    }
  }

  let tableBody = []
  let tableTitle = []
  try {
    if (activeKey === '3') {
      let groupBy = (xs, key) => {
        return xs.reduce((rv, x) => {
          (rv[x[key]] = rv[x[key]] || []).push(x)
          return rv
        }, {})
      }
      let groubedByTeam = groupBy(listRekap, 'productCode')
      let arr = Object.keys(groubedByTeam).map(index => groubedByTeam[index])
      for (let i = 0; i < arr.length; i += 1) {
        tableBody.push(createTableBody(arr[i]))
        tableTitle.push({ text: `Product : ${arr[i][0].productCode} - ${arr[i][0].productName}`, style: 'tableTitle' })
      }
    } else {
      tableBody = createTableBody(listRekap)
    }
  } catch (e) {
    console.log(e)
  }

  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    width: widths,
    pageMargins: [50, 130, 50, 60],
    pageSize,
    pageOrientation: 'landscape',
    tableStyle: styles,
    layout: 'noBorder',
    tableHeader,
    tableBody,
    tableTitle,
    tableFooter,
    data: listRekap,
    header,
    footer
  }

  let reportType = (<BasicReport {...pdfProps} />)
  if (activeKey === '3') {
    reportType = (<RepeatReport {...pdfProps} />)
  }

  return (
    { ...reportType }
  )
}

PrintPDF.propTypes = {
  listRekap: PropTypes.array,
  dataSource: PropTypes.array,
  user: PropTypes.object.isRequired,
  period: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  storeInfo: PropTypes.object.isRequired
}

export default PrintPDF
