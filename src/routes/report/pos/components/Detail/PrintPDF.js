import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { RepeatReport } from 'components'

const PrintPDF = ({ user, listData, storeInfo, fromDate, toDate }) => {
  const pdfMake = require('pdfmake/build/pdfmake.js')
  const pdfFonts = require('pdfmake/build/vfs_fonts.js')
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  const styles = {
    header: {
      alignment: 'center',
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
      color: 'black',
      alignment: 'center'
    },
    tableTitle: {
      fontSize: 14,
      margin: [0, 20, 0, 8]
    },
    rowTextFooter: {
      alignment: 'center',
      fontSize: 12,
      bold: true
    },
    rowNumberFooter: {
      alignment: 'right',
      fontSize: 12,
      bold: true
    },
    footer: {
      fontSize: 9,
      margin: [0, 0, 0, 0]
    }
  }

  const createTableBody = (tabledata) => {
    let totalQty = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.qty) || 0), 0)
    let totalSubTotal = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.total) || 0), 0)
    let totalDiscount = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.totalDiscount) || 0), 0)
    let totalAfterDiscount = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.netto) || 0), 0)

    const diffData = tabledata.reduce((group, item) => {
      (group[item.typeCode] = group[item.typeCode] || []).push(item)
      return group
    }, [])

    let body = []
    for (let key in diffData) {
      let headers = []
      switch (key) {
      case 'P':
        headers.push(
          [
            { fontSize: 12, text: 'NO', style: 'tableHeader' },
            { fontSize: 12, text: 'PRODUCT CODE', style: 'tableHeader' },
            { fontSize: 12, text: 'PRODUCT NAME', style: 'tableHeader' },
            { fontSize: 12, text: 'QTY', style: 'tableHeader' },
            { fontSize: 12, text: 'UNIT PRICE', style: 'tableHeader' },
            { fontSize: 12, text: 'SUB TOTAL', style: 'tableHeader' },
            { fontSize: 12, text: 'DISCOUNT', style: 'tableHeader' },
            { fontSize: 12, text: 'TOTAL', style: 'tableHeader' }
          ]
        )
        break
      case 'S':
        headers.push(
          [
            { fontSize: 12, text: 'NO', style: 'tableHeader' },
            { fontSize: 12, text: 'SERVICE CODE', style: 'tableHeader' },
            { fontSize: 12, text: 'SERVICE NAME', style: 'tableHeader' },
            { fontSize: 12, text: 'QTY', style: 'tableHeader' },
            { fontSize: 12, text: 'UNIT PRICE', style: 'tableHeader' },
            { fontSize: 12, text: 'SUB TOTAL', style: 'tableHeader' },
            { fontSize: 12, text: 'DISCOUNT', style: 'tableHeader' },
            { fontSize: 12, text: 'TOTAL', style: 'tableHeader' }
          ]
        )
        break
      default:
      }
      for (let i = 0; i < headers.length; i += 1) {
        body.push(headers[i])
      }
      let countQtyValue = 0
      let countAmountValue = 0
      const rows = diffData[key]
      let counter = 1
      for (let key in rows) {
        if (rows.hasOwnProperty(key)) {
          let data = rows[key]
          countQtyValue = ((parseFloat(countQtyValue) || 0) + (parseFloat(data.pQty) || 0)) - (parseFloat(data.sQty) || 0)
          countAmountValue = ((parseFloat(countAmountValue) || 0) + (parseFloat(data.sAmount) || 0)) - (parseFloat(data.sAmount) || 0)
          let row = []
          row.push({ text: counter, alignment: 'center', fontSize: 11 })
          row.push({ text: data.productCode.toString(), alignment: 'left', fontSize: 11 })
          row.push({ text: data.productName.toString(), alignment: 'left', fontSize: 11 })
          row.push({ text: (data.qty || 0), alignment: 'center', fontSize: 11 })
          row.push({ text: (parseFloat(data.sellingPrice) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
          row.push({ text: (parseFloat(data.total) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
          row.push({ text: (parseFloat(data.totalDiscount) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
          row.push({ text: (parseFloat(data.netto) || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 })
          body.push(row)
        }
        counter += 1
      }
    }

    let totalRow = []
    totalRow.push({ text: 'Grand Total', colSpan: 3, style: 'rowTextFooter' })
    totalRow.push({})
    totalRow.push({})
    totalRow.push({ text: `${totalQty.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'rowNumberFooter' })
    totalRow.push({})
    totalRow.push({ text: `${totalSubTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'rowNumberFooter' })
    totalRow.push({ text: `${totalDiscount.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'rowNumberFooter' })
    totalRow.push({ text: `${totalAfterDiscount.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, style: 'rowNumberFooter' })
    body.push(totalRow)
    return body
  }

  let tableTitle = []
  let tableBody = []
  for (let i = 0; i < listData.length; i += 1) {
    try {
      tableTitle.push(
        {
          table: {
            widths: ['15%', '1%', '32%', '10%', '15%', '1%', '27%'],
            body: [
              [{ text: 'Invoice No', fontSize: 11 }, ':', { text: (listData[i].transNo || '').toString(), fontSize: 11 }, {}, { text: 'Police No/KM', fontSize: 11 }, ':', { text: `${(listData[i].policeNo || '').toString()}${(listData[i].policeNo && listData[i].lastMeter) ? '/' : ''}${(listData[i].lastMeter || '').toString()}`, fontSize: 11 }],
              [{ text: 'Invoice Date', fontSize: 11 }, ':', { text: moment(listData[i].transDate).format('DD-MM-YYYY') || moment().format('DD-MM-YYYY'), fontSize: 11 }, {}, { text: 'Merk/Model', fontSize: 11 }, ':', { text: `${(listData[i].merk || '').toString()}${(listData[i].merk && listData[i].model) ? '/' : ''}${(listData[i].model || '').toString()}`, fontSize: 11 }],
              [{ text: 'Member Code', fontSize: 11 }, ':', { text: (listData[i].memberCode || '').toString(), fontSize: 11 }, {}, { text: 'Type/Year', fontSize: 11 }, ':', { text: `${(listData[i].type || '').toString()}${(listData[i].type && listData[i].year) ? '/' : ''}${(listData[i].year || '').toString()}`, fontSize: 11 }],
              [{ text: 'Member Name', fontSize: 11 }, ':', { text: (listData[i].memberName || '').toString(), fontSize: 11 }, {}, { text: 'Mechanic', fontSize: 11 }, ':', { text: (listData[i].technicianName || '').toString(), fontSize: 11 }]
            ]
          },
          layout: 'noBorders',
          margin: [0, 20, 0, 0]
        }
      )
      tableBody.push(createTableBody(listData[i].items))
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
            text: 'LAPORAN HISTORY POS DETAIL',
            style: 'header'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1090, y2: 5, lineWidth: 0.5 }]
          },
          {
            columns: [
              {
                text: `\nPeriode: ${moment(fromDate).format('DD-MMM-YYYY')}  TO  ${moment(toDate).format('DD-MMM-YYYY')}`,
                fontSize: 12,
                alignment: 'left'
              },
              {
                text: '',
                alignment: 'center'
              },
              {
                text: '',
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
          canvas: [{ type: 'line', x1: 0, y1: -8, x2: 1090, y2: -8, lineWidth: 0.5 }]
        },
        {
          columns: [
            {
              text: `Tanggal cetak: ${moment().format('LLLL')}`,
              style: 'footer',
              alignment: 'left'
            },
            {
              text: `Dicetak oleh: ${user.username}`,
              style: 'footer',
              alignment: 'center'
            },
            {
              text: `Halaman: ${currentPage.toString()} dari ${pageCount}`,
              style: 'footer',
              alignment: 'right'
            }
          ]
        }
      ]
    }
  }

  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    pageSize: 'A3',
    pageOrientation: 'landscape',
    width: ['4%', '18%', '35%', '7%', '9%', '9%', '9%', '9%'],
    pageMargins: [50, 130, 50, 60],
    header,
    tableTitle,
    tableBody,
    layout: 'noBorder',
    footer,
    tableStyle: styles,
    data: listData
  }

  return (
    <RepeatReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  listData: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired,
  storeInfo: PropTypes.object
}

export default PrintPDF
