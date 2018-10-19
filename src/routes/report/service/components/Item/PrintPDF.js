/**
 * Created by boo on 9/19/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'
import { formatDate, numberFormat, posTotal } from 'utils'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const PrintPDF = ({ user, list, storeInfo, fromDate, toDate }) => {
  // Declare Function
  const createTableBody = (tabledata) => {
    let body = []
    const rows = tabledata
    let count = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        const totalPrice = (data.sellingPrice * data.qty)
        let row = [
          { text: count, alignment: 'center', fontSize: 11 },
          { text: (data.technicianCode || ''), alignment: 'left', fontSize: 11 },
          { text: (data.technicianName || ''), alignment: 'left', fontSize: 11 },
          { text: (data.employeeDetailCode || ''), alignment: 'left', fontSize: 11 },
          { text: (data.employeeDetailName || ''), alignment: 'left', fontSize: 11 },

          { text: (data.transNo || ''), alignment: 'left', fontSize: 11 },
          { text: formatDate(data.transDate, 'YYYY-MM-DD'), alignment: 'left', fontSize: 11 },
          { text: (data.typeCode || ''), alignment: 'left', fontSize: 11 },
          { text: (data.productCode || ''), alignment: 'left', fontSize: 11 },
          { text: (data.productName || ''), alignment: 'left', fontSize: 11 },

          { text: formatNumberIndonesia(data.qty), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.sellingPrice), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(posTotal(data)), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia((totalPrice - posTotal(data)) + data.discountLoyalty), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.DPP), alignment: 'right', fontSize: 11 },

          { text: formatNumberIndonesia(data.PPN), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(parseFloat(data.DPP || 0) + parseFloat(data.PPN || 0)), alignment: 'right', fontSize: 11 }
        ]
        body.push(row)
      }
      count += 1
    }
    return body
  }

  // Declare Variable
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
        stack: [
          {
            stack: storeInfo.stackHeader01
          },
          {
            text: 'LAPORAN SERVICE EMPLOYEE ITEM',
            style: 'header',
            fontSize: 18,
            alignment: 'center'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1330, y2: 5, lineWidth: 0.5 }]
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
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1330, y2: 5, lineWidth: 0.5 }]
        },
        {
          columns: [
            {
              text: `Tanggal cetak: ${moment().format('DD-MMM-YYYY HH:mm:ss')}`,
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
              text: `Halaman: ${(currentPage || 0).toString()} dari ${pageCount}`,
              fontSize: 9,
              margin: [0, 0, 0, 0],
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
      { fontSize: 12, text: 'INV EMP CODE', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'INV EMP NAME', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'ITEM EMP CODE', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'ITEM EMP NAME', style: 'tableHeader', alignment: 'center' },

      { fontSize: 12, text: 'NO FAKTUR', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'TGL FAKTUR', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'TYPE', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'KODE PRODUK', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'NAMA PRODUK', style: 'tableHeader', alignment: 'center' },

      { fontSize: 12, text: 'QTY', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'PRICE', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'TOTAL', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'DISCOUNT', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'DPP', style: 'tableHeader', alignment: 'center' },

      { fontSize: 12, text: 'PPN', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'NETTO', style: 'tableHeader', alignment: 'center' }
    ]
  ]
  let tableBody = []
  try {
    tableBody = createTableBody(list)
  } catch (e) {
    console.log(e)
  }
  let qty = (list || []).reduce((cnt, o) => cnt + parseFloat(o.qty || 0), 0)
  let price = (list || []).reduce((cnt, data) => cnt + parseFloat(data.sellingPrice || 0), 0)
  let total = (list || []).reduce((cnt, data) => cnt + posTotal(data), 0)
  let discount = (list || []).reduce((cnt, data) => cnt + (((parseFloat(data.sellingPrice) * parseFloat(data.qty)) - posTotal(data)) + data.discountLoyalty), 0)
  let dpp = (list || []).reduce((cnt, data) => cnt + parseFloat(data.DPP || 0), 0)
  let ppn = (list || []).reduce((cnt, data) => cnt + parseFloat(data.PPN || 0), 0)
  let netto = (list || []).reduce((cnt, data) => cnt + parseFloat(data.DPP || 0) + parseFloat(data.PPN || 0), 0)

  const tableFooter = [
    [
      { text: 'TOTAL', colSpan: 10, alignment: 'center', fontSize: 11 },
      {},
      {},
      {},
      {},

      {},
      {},
      {},
      {},
      {},

      { text: `${formatNumberIndonesia(qty)}`, alignment: 'right', fontSize: 11 },
      { text: `${formatNumberIndonesia(price)}`, alignment: 'right', fontSize: 11 },
      { text: `${formatNumberIndonesia(total)}`, alignment: 'right', fontSize: 11 },
      { text: `${formatNumberIndonesia(discount)}`, alignment: 'right', fontSize: 11 },
      { text: `${formatNumberIndonesia(dpp)}`, alignment: 'right', fontSize: 11 },

      { text: `${formatNumberIndonesia(ppn)}`, alignment: 'right', fontSize: 11 },
      { text: `${formatNumberIndonesia(netto)}`, alignment: 'right', fontSize: 11 }
    ]
  ]

  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    // width: ['4%', '8%', '10%', '9%', '7%', '8%', '9%', '11%', '13%', '8%', '13%'],
    pageMargins: [50, 130, 50, 60],
    pageSize: { width: 842, height: 1430 },
    pageOrientation: 'landscape',
    tableStyle: styles,
    layout: 'noBorder',
    tableHeader,
    tableBody,
    tableFooter,
    data: list,
    header,
    footer
  }

  return (
    <BasicReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  list: PropTypes.array,
  user: PropTypes.object,
  storeInfo: PropTypes.object.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string
}

export default PrintPDF
