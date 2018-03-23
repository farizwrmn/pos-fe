import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { RepeatReport } from 'components'

const PrintPDF = ({ user, listMechanic, storeInfo, fromDate, toDate }) => {
  const pdfMake = require('pdfmake/build/pdfmake.js')
  const pdfFonts = require('pdfmake/build/vfs_fonts.js')
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  let groupBy = (xs, key) => {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x)
      return rv
    }, {})
  }

  let groupByTeam = groupBy(listMechanic, 'employeeName')
  let arr = Object.keys(groupByTeam).map(index => groupByTeam[index])

  const createTableBody = (tabledata) => {
    let totalQty = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.qty) || 0), 0)
    let totalSellingPrice = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.sellingPrice) || 0), 0)
    let totalDiscount = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.discount) || 0), 0)
    let totalAmount = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.amount) || 0), 0)
    const headers = {
      top: {
        col_1: { fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' },
        col_2: { fontSize: 12, text: 'TRANSACTION NO', style: 'tableHeader', alignment: 'center' },
        col_3: { fontSize: 12, text: 'TRANSACTION DATE', style: 'tableHeader', alignment: 'center' },
        col_4: { fontSize: 12, text: 'SERVICE NAME', style: 'tableHeader', alignment: 'center' },
        col_5: { fontSize: 12, text: 'QTY', style: 'tableHeader', alignment: 'center' },
        col_6: { fontSize: 12, text: 'SELLING PRICE', style: 'tableHeader', alignment: 'center' },
        col_7: { fontSize: 12, text: 'DISCOUNT', style: 'tableHeader', alignment: 'center' },
        col_8: { fontSize: 12, text: 'AMOUNT', style: 'tableHeader', alignment: 'center' }
      }
    }

    const rows = tabledata
    let body = []
    for (let key in headers) {
      if (headers.hasOwnProperty(key)) {
        let header = headers[key]
        let row = []
        row.push(header.col_1)
        row.push(header.col_2)
        row.push(header.col_3)
        row.push(header.col_4)
        row.push(header.col_5)
        row.push(header.col_6)
        row.push(header.col_7)
        row.push(header.col_8)
        body.push(row)
      }
    }
    let countQtyValue = 0
    let countAmountValue = 0
    let counter = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        countQtyValue = ((parseFloat(countQtyValue) || 0) + (parseFloat(data.pQty) || 0)) - (parseFloat(data.sQty) || 0)
        countAmountValue = ((parseFloat(countAmountValue) || 0) + (parseFloat(data.sAmount) || 0)) - (parseFloat(data.sAmount) || 0)
        let row = []
        row.push({ text: counter, alignment: 'center', fontSize: 11 })
        row.push({ text: data.transNo.toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: moment(data.transDate).format('DD-MMM-YYYY'), alignment: 'left', fontSize: 11 })
        row.push({ text: data.serviceName.toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: (parseFloat(data.qty) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: (parseFloat(data.sellingPrice) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: (parseFloat(data.discount) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        row.push({ text: (parseFloat(data.amount) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
        body.push(row)
      }
      counter += 1
    }

    let totalRow = []
    totalRow.push({ text: 'Grand Total', colSpan: 4, alignment: 'center', fontSize: 12 })
    totalRow.push({})
    totalRow.push({})
    totalRow.push({})
    totalRow.push({ text: `${totalQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${totalSellingPrice.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${totalDiscount.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    totalRow.push({ text: `${totalAmount.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 })
    body.push(totalRow)
    return body
  }

  let tableBody = []
  let tableTitle = []
  for (let i = 0; i < arr.length; i += 1) {
    try {
      tableBody.push(createTableBody(arr[i]))
      tableTitle.push({ text: `Employee Name : ${arr[i][0].employeeName}`, style: 'tableTitle' })
    } catch (e) {
      console.log(e)
    }
  }

  const header = {
    stack: [
      {
        stack: [
          {
            stack: storeInfo.stackHeader01
          },
          {
            text: 'LAPORAN HISTORY JASA PER MEKANIK',
            style: 'header',
            fontSize: 18,
            alignment: 'center'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1080, y2: 5, lineWidth: 0.5 }]
          },
          {
            columns: [
              {
                text: `\nPERIODE: ${moment(fromDate).format('DD-MMM-YYYY')}  TO  ${moment(toDate).format('DD-MMM-YYYY')}`,
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
          canvas: [{ type: 'line', x1: 0, y1: -8, x2: 1080, y2: -8, lineWidth: 0.5 }]
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
    }
  }

  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    pageSize: 'A3',
    pageOrientation: 'landscape',
    width: ['5%', '16%', '16%', '24%', '8%', '9%', '9%', '9%'],
    pageMargins: [50, 130, 50, 60],
    header,
    tableTitle,
    tableBody,
    layout: 'noBorder',
    footer,
    tableStyle: styles,
    data: arr
  }

  return (
    <RepeatReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  listMechanic: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired,
  storeInfo: PropTypes.object
}

export default PrintPDF
