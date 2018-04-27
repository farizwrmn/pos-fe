/**
 * Created by boo on 9/19/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'

const PrintPDF = ({ user, listTrans, storeInfo, date,
  grandTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.nettoTotal || 0), 0),
  paidTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.paid || 0), 0),
  gt120daysTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.gt120days || 0), 0),
  gt90daysTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.gt90days || 0), 0),
  gt60daysTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.gt60days || 0), 0),
  gt30daysTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.gt30days || 0), 0),
  gt15daysTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.gt15days || 0), 0),
  gte0daysTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.gte0days || 0), 0),
  nettoTotal = listTrans.reduce((cnt, o) => cnt + parseFloat(o.restNetto || 0), 0) }) => {
  // Declare Function
  const createTableBody = (tabledata) => {
    let body = []
    const rows = tabledata
    let count = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = []
        row.push({ text: count, alignment: 'center', style: 'tableContent' })
        row.push({ text: (data.invoiceDate ? moment(data.invoiceDate).format('DD-MMM-YYYY') : '').toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'left', style: 'tableContent' })
        row.push({ text: (data.transNo || '').toString(), alignment: 'left', style: 'tableContent' })
        row.push({ text: (data.memberName || '').toString(), alignment: 'left', style: 'tableContent' })
        row.push({ text: (data.memberGroupName || '').toString(), alignment: 'left', style: 'tableContent' })
        row.push({ text: (data.nettoTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', style: 'tableContent' })
        row.push({ text: (data.paid || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', style: 'tableContent' })
        row.push({ text: (data.gt120days || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', style: 'tableContent' })
        row.push({ text: (data.gt90days || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', style: 'tableContent' })
        row.push({ text: (data.gt60days || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', style: 'tableContent' })
        row.push({ text: (data.gt30days || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', style: 'tableContent' })
        row.push({ text: (data.gt15days || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', style: 'tableContent' })
        row.push({ text: (data.gte0days || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', style: 'tableContent' })
        row.push({ text: (data.restNetto || '').toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', style: 'tableContent' })
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
      fontSize: 10,
      color: 'black'
    },
    tableContent: {
      fontSize: 11,
      color: 'black'
    },
    tableFooter: {
      bold: true,
      fontSize: 10,
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
            text: 'LAPORAN TUNGGAKAN AR',
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
                text: `\nPER ${date ? moment(date, 'YYYY-MM-DD').format('DD-MMM-YYYY') : ''}`,
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
              text: `Tanggal cetak: ${moment().format('DD-MMM-YYYY hh:mm:ss')}`,
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
      { text: 'NO', rowSpan: 2, style: 'tableHeader', alignment: 'center' },
      { text: 'TANGGAL', rowSpan: 2, style: 'tableHeader', alignment: 'center' },
      { text: 'NO FAKTUR', rowSpan: 2, style: 'tableHeader', alignment: 'center' },
      { text: 'NAMA CUSTOMER', rowSpan: 2, style: 'tableHeader', alignment: 'center' },
      { text: 'GROUP', rowSpan: 2, style: 'tableHeader', alignment: 'center' },
      { text: 'NETTO', rowSpan: 2, style: 'tableHeader', alignment: 'center' },
      { text: 'BAYAR', rowSpan: 2, style: 'tableHeader', alignment: 'center' },
      { text: 'UMUR PIUTANG (HARI)', colSpan: 6, style: 'tableHeader', alignment: 'center' },
      { text: '', style: 'tableHeader', alignment: 'center' },
      { text: '', style: 'tableHeader', alignment: 'center' },
      { text: '', style: 'tableHeader', alignment: 'center' },
      { text: '', style: 'tableHeader', alignment: 'center' },
      { text: '', style: 'tableHeader', alignment: 'center' },
      { text: 'SISA', rowSpan: 2, style: 'tableHeader', alignment: 'center' }
    ],
    [
      { text: '', style: 'tableHeader', alignment: 'center' },
      { text: '', style: 'tableHeader', alignment: 'center' },
      { text: '', style: 'tableHeader', alignment: 'center' },
      { text: '', style: 'tableHeader', alignment: 'center' },
      { text: '', style: 'tableHeader', alignment: 'center' },
      { text: '', style: 'tableHeader', alignment: 'center' },
      { text: '', style: 'tableHeader', alignment: 'center' },
      { text: '> 120', style: 'tableHeader', alignment: 'center' },
      { text: '91 - 120', style: 'tableHeader', alignment: 'center' },
      { text: '61 - 90', style: 'tableHeader', alignment: 'center' },
      { text: '31 - 60', style: 'tableHeader', alignment: 'center' },
      { text: '16 - 30', style: 'tableHeader', alignment: 'center' },
      { text: '1 - 15', style: 'tableHeader', alignment: 'center' },
      { text: '', style: 'tableHeader', alignment: 'center' }
    ]
  ]
  let tableBody = []
  try {
    tableBody = createTableBody(listTrans)
  } catch (e) {
    console.log(e)
  }
  const tableFooter = [
    [
      { text: 'Grand Total', colSpan: 5, alignment: 'center', style: 'tableFooter', fontSize: 12 },
      {},
      {},
      {},
      {},
      { text: `${(grandTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', style: 'tableFooter' },
      { text: `(${paidTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`, alignment: 'right', style: 'tableFooter' },
      { text: `${(gt120daysTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', style: 'tableFooter' },
      { text: `${(gt90daysTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', style: 'tableFooter' },
      { text: `${(gt60daysTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', style: 'tableFooter' },
      { text: `${(gt30daysTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', style: 'tableFooter' },
      { text: `${(gt15daysTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', style: 'tableFooter' },
      { text: `${(gte0daysTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', style: 'tableFooter' },
      { text: `${nettoTotal.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', style: 'tableFooter' }
    ]
  ]

  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    width: ['3%', '6%', '8%', '12%', '8%',
      '7%', '7%', '7%', '7%',
      '7%', '7%', '7%', '7%', '7%'],
    pageMargins: [50, 130, 50, 60],
    pageSize: { width: 842, height: 1430 },
    pageOrientation: 'landscape',
    tableStyle: styles,
    layout: 'noBorder',
    tableHeader,
    tableBody,
    tableFooter,
    data: listTrans,
    header,
    footer
  }

  return (
    <BasicReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  listTrans: PropTypes.array,
  user: PropTypes.object,
  storeInfo: PropTypes.object.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string
}

export default PrintPDF
