/**
 * Created by veirry on 28/11/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicInvoice } from 'components'

const PrintPDF = ({ user, listItem, itemHeader, storeInfo, printNo, itemPrint, ...formConfirmProps }) => {
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
        row.push({ text: data.productCode.toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: data.productName.toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: data.qty.toString(), alignment: 'right', fontSize: 11 })
        row.push({ text: (data.description || '').toString(), alignment: 'left', fontSize: 11 })
        body.push(row)
      }
      count += 1
    }
    return body
  }

  // Declare Variable
  let productTotal = listItem.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
  const styles = {
    header: {
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 10],
    },
    subheader: {
      fontSize: 16,
      bold: true,
      margin: [0, 10, 0, 5],
    },
    tableExample: {
      margin: [0, 5, 0, 15],
    },
    tableHeader: {
      bold: true,
      fontSize: 13,
      color: 'black',
    },
  }
  const header = {
    stack: [
      {
        columns: [
          {
            stack: storeInfo.stackHeader02
          },
          {
            text: 'SURAT PENGANTAR',
            style: 'header',
            fontSize: 18,
            alignment: 'center'
          },
          {
            text: ' ',
            style: 'header',
            fontSize: 18,
            alignment: 'right'
          },
        ],
      },
      {
        table: {
          widths: ['15%', '1%', '32%', '10%', '15%', '1%', '27%'],
          body: [
            [{ text: 'NO TRANSAKSI', fontSize: 12 }, ':', { text: (itemPrint.transNo || '').toString(), fontSize: 12 }, {}, { text: 'PIC', fontSize: 12 }, ':', { text: (itemHeader.employeeId ? itemHeader.employeeId.label : '').toString(), fontSize: 12 }],
            [{ text: 'TANGGAL', fontSize: 12 }, ':', { text: moment().format('YYYY/MM/DD'), fontSize: 12 }, {}, { text: 'NO POLISI', fontSize: 12 }, ':', { text: (itemHeader.carNumber || '').toString(), fontSize: 12 }],
            [{ text: 'DARI', fontSize: 12 }, ':', { text: (itemHeader.storeId ? itemHeader.storeId.label : '').toString(), fontSize: 12 }, {}, { text: 'TOTAL COLLY', fontSize: 12 }, ':', { text: (itemHeader.totalColly || ''), fontSize: 12 }],
            [{ text: 'KEPADA', fontSize: 12 }, ':', { text: (itemHeader.storeIdReceiver ? itemHeader.storeIdReceiver.label : '').toString(), fontSize: 12 }, {}, { text: 'DESKRIPSI', fontSize: 12 }, ':', { text: (itemHeader.description || '').toString(), fontSize: 12 }],
          ],
        },
        layout: 'noBorders',
      },
      {
        canvas: [{ type: 'line', x1: 0, y1: 5, x2: 753, y2: 5, lineWidth: 0.5 }]
      },
    ],
    margin: [30, 12, 12, 30],
  }
  const footer = (currentPage, pageCount) => {
    if (currentPage === pageCount) {
      return {
        margin: [40, 0, 40, 0],
        height: 160,
        stack: [
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 813 - 2 * 40, y2: 5, lineWidth: 0.5 }],
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
              { text: `Diterima oleh \n\n\n\n. . . . . . . . . . . . . . . .  \n`, fontSize: 12, alignment: 'center', margin: [0, 5, 0, 0] },
            ],
          },
          {
            fontSize: 9,
            columns: [
              {
                text: `Tgl Cetak: ${moment().format('DD-MM-YYYY hh:mm:ss')}`,
                margin: [0, 10, 0, 10],
                fontSize: 9,
                alignment: 'left',
              },
              {
                text: `Cetakan ke: ${printNo}`,
                margin: [0, 10, 0, 10],
                fontSize: 9,
                alignment: 'center',
              },
              {
                text: `Dicetak Oleh: ${user.username}`,
                margin: [0, 10, 0, 10],
                fontSize: 9,
                alignment: 'center',
              },
              {
                text: 'page: ' + currentPage.toString() + ' of ' + pageCount + '\n',
                fontSize: 9,
                margin: [0, 10, 0, 10],
                alignment: 'right',
              },
            ],
            alignment: 'center',
          },
        ],
      }
    } else {
      return {
        margin: [40, 100, 40, 10],
        height: 160,
        stack: [
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 813 - 2 * 40, y2: 5, lineWidth: 0.5 }],
          },
          {
            columns: [
              {
                text: `Tgl Cetak: ${moment().format('DD-MM-YYYY hh:mm:ss')}`,
                margin: [0, 20, 0, 40],
                fontSize: 9,
                alignment: 'left',
              },
              {
                text: `Cetakan ke: ${printNo}`,
                margin: [0, 20, 0, 40],
                fontSize: 9,
                alignment: 'center',
              },
              {
                text: `Dicetak Oleh: ${user.username}`,
                margin: [0, 20, 0, 40],
                fontSize: 9,
                alignment: 'center'
              },
              {
                text: 'page: ' + currentPage.toString() + ' of ' + pageCount + '\n',
                fontSize: 9,
                margin: [0, 20, 0, 40],
                alignment: 'right',
              },
            ],
          },
        ],
      }
    }
  }
  const tableHeader = [
    [
      { fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'CODE', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'NAME', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'QTY', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'DESKRIPSI', style: 'tableHeader', alignment: 'center' },      
    ]
  ]
  let tableBody = []
  try {
    tableBody = createTableBody(listItem)
  } catch (e) {
    console.log(e)
  }
  const tableFooter = [
    [
      { text: 'Grand Total', colSpan: 3, alignment: 'center', fontSize: 12 },
      {},
      {},
      { text: `${(parseFloat(productTotal)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 },
      {},      
    ]
  ]
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
    vLineColor: (i, node) => {
      return 'black'
    },
  }
  // Declare additional Props
  const pdfProps = {
    className: "button-width02 button-extra-large bgcolor-blue",
    width: ['6%', '20%', '34%', '6%', '34%'],
    pageMargins: [40, 150, 40, 150],
    pageSize: { width: 813, height: 530 },
    pageOrientation: 'landscape',
    tableStyle: styles,
    layout: tableLayout,
    tableHeader: tableHeader,
    tableBody: tableBody,
    tableFooter: tableFooter,
    data: listItem,
    header: header,
    footer: footer,
    printNo: 1
  }

  return (
    <BasicInvoice  {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  listItem: PropTypes.array,
  user: PropTypes.object.isRequired,
  storeInfo: PropTypes.object.isRequired,
  // fromDate: PropTypes.string.isRequired,
  // toDate: PropTypes.string.isRequired,
}

export default PrintPDF
