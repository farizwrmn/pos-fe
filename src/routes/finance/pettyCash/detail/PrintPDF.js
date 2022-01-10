/**
 * Created by veirry on 28/11/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { numberFormatter } from 'utils/string'
import { BasicInvoice } from 'components'
import { getReportName } from './utils'

const PrintPDF = ({ user, listItem, itemHeader, storeInfo, printNo }) => {
  // Declare Function
  const createTableBody = (tabledata) => {
    let body = []
    const rows = tabledata
    let count = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = []
        row.push({ text: count, alignment: 'center', fontSize: 11 })
        row.push({ text: (data.transactionType).toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: (data.description || '').toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: numberFormatter(data.depositTotal || 0), alignment: 'left', fontSize: 11 })
        row.push({ text: numberFormatter(data.expenseTotal || 0), alignment: 'right', fontSize: 11 })
        body.push(row)
      }
      count += 1
    }
    return body
  }

  // Declare Variable
  let openTotal = listItem.filter(filtered => filtered.transactionType === 'OPEN').reduce((cnt, o) => cnt + (o.depositTotal - o.expenseTotal), 0)
  let depositTotal = listItem.filter(filtered => filtered.transactionType === 'IN').reduce((cnt, o) => cnt + (o.depositTotal - o.expenseTotal), 0)
  let expenseTotal = listItem.filter(filtered => filtered.transactionType === 'OUT').reduce((cnt, o) => cnt + (o.depositTotal - o.expenseTotal), 0)
  let purchaseTotal = listItem.filter(filtered => filtered.transactionType === 'PRC').reduce((cnt, o) => cnt + (o.depositTotal - o.expenseTotal), 0)
  let adjustTotal = listItem.filter(filtered => filtered.transactionType === 'ADJ').reduce((cnt, o) => cnt + (o.depositTotal - o.expenseTotal), 0)
  let closeTotal = listItem.filter(filtered => filtered.transactionType === 'CLOSE').reduce((cnt, o) => cnt + (o.depositTotal - o.expenseTotal), 0)
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
    }
  }
  const header = {
    stack: [
      {
        columns: [
          {
            text: ' ',
            style: 'header',
            fontSize: 18,
            alignment: 'right'
          },
          {
            text: getReportName(itemHeader.transType),
            style: 'header',
            fontSize: 18,
            alignment: 'center'
          },
          {
            stack: storeInfo.stackHeader02
          }
        ]
      },
      {
        table: {
          widths: ['15%', '1%', '46%', '10%', '1%', '1%', '27%'],
          body: [
            [{ text: 'NO TRANSAKSI', fontSize: 11 }, ':', { text: (`${itemHeader.transNo || ''} (${itemHeader.status || ''})` || '').toString(), fontSize: 11 }, {}, {}, {}, {}],
            [{ text: 'TANGGAL', fontSize: 11 }, ':', { text: moment(itemHeader.createdAt).format('DD-MM-YYYY'), fontSize: 11 }, {}, {}, {}, {}],
            [{ text: 'STORE', fontSize: 11 }, ':', { text: (listItem && listItem[0] && listItem[0].storeName ? listItem[0].storeName : '' || '').toString(), fontSize: 11 }, {}, {}, {}, {}],
            [{ text: 'MEMO', fontSize: 11 }, ':', { text: (itemHeader.description || '').toString(), fontSize: 11 }, {}, {}, {}, {}]
          ]
        },
        layout: 'noBorders'
      },
      {
        canvas: [{ type: 'line', x1: 0, y1: 5, x2: 733, y2: 5, lineWidth: 0.5 }]
      }
    ],
    margin: [30, 12, 12, 30]
  }
  const footer = (currentPage, pageCount) => {
    if (currentPage === pageCount) {
      return {
        margin: [40, 0, 40, 0],
        height: 160,
        stack: [
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 733, y2: 5, lineWidth: 0.5 }]
          },
          {
            // columns: [
            //   { fontSize: 12, text: `Terbilang : ${terbilang(Total).toUpperCase()} RUPIAH`, alignment: 'left' },
            //   { fontSize: 12, text: `TOTAL : Rp ${(Total).toLocaleString(['ban', 'id'])}`, alignment: 'right' },
            // ],
          },
          {
            columns: [
              { text: `Dibuat oleh \n\n\n\n. . . . . . . . . . . . . . . .  \n${user.username}`, fontSize: 12, alignment: 'center', margin: [0, 5, 0, 0] },
              { text: '', fontSize: 12, alignment: 'center', margin: [0, 5, 0, 0] },
              { text: `Diterima oleh \n\n\n\n. . . . . . . . . . . . . . . .  \n${(itemHeader.employeeReceiver ? itemHeader.employeeReceiver : '').toString()}`, fontSize: 12, alignment: 'center', margin: [0, 5, 0, 0] }
            ]
          },
          {
            fontSize: 9,
            columns: [
              {
                text: `Tgl Cetak: ${moment().format('DD-MM-YYYY HH:mm:ss')}`,
                margin: [0, 10, 0, 10],
                fontSize: 9,
                alignment: 'left'
              },
              {
                text: `Cetakan ke: ${printNo}`,
                margin: [0, 10, 0, 10],
                fontSize: 9,
                alignment: 'center'
              },
              {
                text: `Dicetak Oleh: ${user.username}`,
                margin: [0, 10, 0, 10],
                fontSize: 9,
                alignment: 'center'
              },
              {
                text: `page: ${(currentPage || 0).toString()} of ${pageCount} \n`,
                fontSize: 9,
                margin: [0, 10, 0, 10],
                alignment: 'right'
              }
            ],
            alignment: 'center'
          }
        ]
      }
    }
    return {
      margin: [40, 100, 40, 10],
      height: 160,
      stack: [
        {
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 733, y2: 5, lineWidth: 0.5 }]
        },
        {
          columns: [
            {
              text: `Tgl Cetak: ${moment().format('DD-MM-YYYY HH:mm:ss')}`,
              margin: [0, 20, 0, 40],
              fontSize: 9,
              alignment: 'left'
            },
            {
              text: `Cetakan ke: ${printNo}`,
              margin: [0, 20, 0, 40],
              fontSize: 9,
              alignment: 'center'
            },
            {
              text: `Dicetak Oleh: ${user.username}`,
              margin: [0, 20, 0, 40],
              fontSize: 9,
              alignment: 'center'
            },
            {
              text: `page: ${(currentPage || 0).toString()} of ${pageCount} \n`,
              fontSize: 9,
              margin: [0, 20, 0, 40],
              alignment: 'right'
            }
          ]
        }
      ]
    }
  }
  const tableHeader = [
    [
      { fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'NAME', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'DESCRIPTION', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'IN', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'OUT', style: 'tableHeader', alignment: 'center' }
    ]
  ]
  let tableBody = []
  try {
    tableBody = createTableBody(listItem)
  } catch (e) {
    console.log(e)
  }
  const tableFooter = []
  if (tableFooter) {
    if (openTotal !== 0) {
      tableFooter.push([
        { text: 'Open Total', colSpan: 4, alignment: 'center', fontSize: 12 },
        {},
        {},
        {},
        { text: numberFormatter(openTotal), alignment: 'right', fontSize: 12 }
      ])
    }
    if (depositTotal !== 0) {
      tableFooter.push([
        { text: 'Deposit Total', colSpan: 4, alignment: 'center', fontSize: 12 },
        {},
        {},
        {},
        { text: numberFormatter(depositTotal), alignment: 'right', fontSize: 12 }
      ])
    }
    if (expenseTotal !== 0) {
      tableFooter.push([
        { text: 'Expense Total', colSpan: 4, alignment: 'center', fontSize: 12 },
        {},
        {},
        {},
        { text: numberFormatter(expenseTotal), alignment: 'right', fontSize: 12 }
      ])
    }
    if (purchaseTotal !== 0) {
      tableFooter.push([
        { text: 'Purchase Total', colSpan: 4, alignment: 'center', fontSize: 12 },
        {},
        {},
        {},
        { text: numberFormatter(purchaseTotal), alignment: 'right', fontSize: 12 }
      ])
    }
    if (adjustTotal !== 0) {
      tableFooter.push([
        { text: 'Adjust Total', colSpan: 4, alignment: 'center', fontSize: 12 },
        {},
        {},
        {},
        { text: numberFormatter(adjustTotal), alignment: 'right', fontSize: 12 }
      ])
    }
    if (closeTotal !== 0) {
      tableFooter.push([
        { text: 'Close Total', colSpan: 4, alignment: 'center', fontSize: 12 },
        {},
        {},
        {},
        { text: numberFormatter(closeTotal), alignment: 'right', fontSize: 12 }
      ])
    }
  }
  const tableLayout = {
    hLineWidth: (i, node) => {
      return (i === 1 || i === 0 || i === node.table.body.length || i === (node.table.body.length - 1)) ? 0.01 : 0
    },
    vLineWidth: (i, node) => {
      return (i === 0 || i === node.table.widths.length) ? 0 : 0
    },
    hLineColor: (i, node) => {
      return (i === 1 || i === 0 || i === node.table.body.length || i === (node.table.body.length - 1)) ? 'black' : 'grey'
    },
    vLineColor: () => {
      return 'black'
    }
  }
  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    width: ['12%', '10%', '48%', '15%', '15%'],
    pageMargins: [40, 180, 40, 150],
    pageSize: { width: 813, height: 530 },
    pageOrientation: 'landscape',
    tableStyle: styles,
    layout: tableLayout,
    tableHeader,
    tableBody,
    tableFooter,
    data: listItem,
    header,
    footer,
    printNo: 1
  }

  return (
    <BasicInvoice {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  listItem: PropTypes.array,
  user: PropTypes.object.isRequired,
  storeInfo: PropTypes.object.isRequired
  // fromDate: PropTypes.string.isRequired,
  // toDate: PropTypes.string.isRequired,
}

export default PrintPDF
