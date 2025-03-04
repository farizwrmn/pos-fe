/**
 * Created by veirry on 31/01/2021.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicInvoice } from 'components'

const PrintPDF = ({ user, listItem, itemHeader, storeInfo, printNo, itemPrint }) => {
  // Declare Function
  const createTableBody = (tabledata) => {
    let body = []
    const rows = tabledata
    let count = 1
    for (let key in rows) {
      let data = rows[key]
      if (rows.hasOwnProperty(key)) {
        let row = []
        row.push({ text: count, alignment: 'center', fontSize: 11 })
        row.push({ text: data.productName, alignment: 'left', fontSize: 11 })
        row.push({ text: parseFloat(data.qty), alignment: 'right', fontSize: 11 })
        body.push(row)
      }
      count += 1
    }
    return body
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
            text: 'MATERIAL',
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
          widths: ['15%', '1%', '32%', '10%', '15%', '1%', '27%'],
          body: [
            [{ text: 'NO TRANSAKSI', fontSize: 11 }, ':', { text: (itemPrint.transNo || '').toString(), fontSize: 11 }, {}, {}, {}, {}],
            [{ text: 'DATE', fontSize: 11 }, ':', { text: moment(itemPrint.transDate).format('DD-MM-YYYY'), fontSize: 11 }, {}, {}, {}, {}],
            [{ text: 'MEMO', fontSize: 11 }, ':', { text: (itemPrint.description || '').toString(), fontSize: 11 }, {}, {}, {}, {}]
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
              { text: `PIC \n\n\n\n. . . . . . . . . . . . . . . .  \n${(itemHeader.employeeId ? itemHeader.employeeId.label : '').toString()}`, fontSize: 12, alignment: 'center', margin: [0, 5, 0, 0] },
              { text: 'Diterima oleh \n\n\n\n. . . . . . . . . . . . . . . .  \n', fontSize: 12, alignment: 'center', margin: [0, 5, 0, 0] }
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
                text: `page: ${(currentPage || 0).toString()} of ${pageCount}\n`,
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
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 820 - (2 * 40), y2: 5, lineWidth: 0.5 }]
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
              text: `page: ${(currentPage || 0).toString()} of ${pageCount}\n`,
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
      { fontSize: 12, text: 'PRODUK', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'QTY', style: 'tableHeader', alignment: 'right' }
    ]
  ]
  let tableBody = []
  try {
    tableBody = createTableBody(listItem)
  } catch (e) {
    console.log('error', e)
  }
  const tableFooter = [
  ]
  const tableLayout = {
    hLineWidth: (i) => {
      return (i === 1 || i === 0) ? 0.01 : 0
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
    width: ['10%', '75%', '15%'],
    pageMargins: [40, 160, 40, 150],
    pageSize: 'A4',
    pageOrientation: 'horizontal',
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
