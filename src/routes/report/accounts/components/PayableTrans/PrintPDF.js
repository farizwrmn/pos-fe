/**
 * Created by boo on 9/19/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'

const PrintPDF = ({ user, listTrans, storeInfo, fromDate, toDate }) => {
  // Declare Variable
  let beginTotal = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.beginValue || 0), 0)
  let nettoTotal = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.nettoTotal || 0), 0)
  let paidTotal = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.paidTotal || 0), 0)
  let returnTotal = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.returnTotal || 0), 0)
  let adjustTotal = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.adjustTotal || 0), 0)
  let total = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.total || 0), 0)

  // Declare Function
  const createTableBody = (tabledata) => {
    let body = []
    const rows = tabledata
    let count = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = [
          { text: count, alignment: 'center', fontSize: 11 },
          { text: (data.supplierName || '').toString(), alignment: 'left', fontSize: 11 },
          { text: (data.supplierTaxId || '').toString(), alignment: 'left', fontSize: 11 },
          { text: (data.address01 || data.address02 || '').toString(), alignment: 'left', fontSize: 11 },
          { text: (data.accountNo || '').toString(), alignment: 'left', fontSize: 11 },

          { text: data.invoiceDate ? moment(data.invoiceDate).format('DD-MMM-YYYY').toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '', alignment: 'left', fontSize: 11 },
          { text: data.dueDate ? moment(data.dueDate).format('DD-MMM-YYYY').toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '', alignment: 'left', fontSize: 11 },
          { text: (data.transNo || '').toString(), alignment: 'left', fontSize: 11 },
          { text: (data.beginValue || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 },
          { text: (data.nettoTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 },

          { text: data.transDate ? moment(data.transDate).format('DD-MMM-YYYY').toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '', alignment: 'left', fontSize: 11 },
          { text: (data.paid || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 },
          { text: (data.bankName || '').toString(), alignment: 'right', fontSize: 11 },
          { text: (data.checkNo || '').toString(), alignment: 'right', fontSize: 11 },
          { text: (data.paid || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 },

          { text: (data.paidTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 },
          { text: (data.returnTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 },
          { text: (data.adjustTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 },
          { text: (data.total || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 },
          { text: (data.detail || '').toString(), alignment: 'right', fontSize: 11 }
        ]
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
        stack: [
          {
            stack: storeInfo.stackHeader01
          },
          {
            text: 'LAPORAN PEMBAYARAN HUTANG',
            style: 'header',
            fontSize: 18,
            alignment: 'center'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 2000, y2: 5, lineWidth: 0.5 }]
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
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 2000, y2: 5, lineWidth: 0.5 }]
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
      { fontSize: 12, text: 'NO', rowSpan: '3', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'SUPPLIER', colSpan: '4', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },

      { fontSize: 12, text: 'TGL FAKTUR', rowSpan: '3', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'TGL JTO', rowSpan: '3', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'NO FAKTUR', rowSpan: '3', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'SALDO AWAL', rowSpan: '3', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'PEMBELIAN', rowSpan: '3', style: 'tableHeader', alignment: 'center' },

      { fontSize: 12, text: 'PEMBAYARAN', colSpan: '6', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },

      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'RETUR PEMBELIAN', rowSpan: '3', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'ADJ', rowSpan: '3', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'SALDO AKHIR', rowSpan: '3', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'KETERANGAN', rowSpan: '3', style: 'tableHeader', alignment: 'center' }
    ],
    [
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'NAMA SUPPLIER', rowSpan: '2', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'NPWP', rowSpan: '2', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'ALAMAT', rowSpan: '2', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'NO REK', rowSpan: '2', style: 'tableHeader', alignment: 'center' },

      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },

      { fontSize: 12, text: 'TGL BAYAR', rowSpan: '2', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'CASH', rowSpan: '2', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'VIA BANK', colSpan: '3', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },

      { fontSize: 12, text: 'JUMLAH BAYAR', rowSpan: '2', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' }
    ],
    [
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },

      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },

      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'NAMA BANK', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'NO GIRO', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'NOMINAL BANK', style: 'tableHeader', alignment: 'center' },

      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' }
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
      { text: 'SUBTOTAL', colSpan: 8, alignment: 'center', fontSize: 12 },
      {},
      {},
      {},
      {},

      {},
      {},
      {},
      { text: `${(beginTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 },
      { text: `${(nettoTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 },

      {},
      { text: `${(paidTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 },
      {},
      {},
      { text: `${(paidTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 },

      { text: `${(paidTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 },
      { text: `${(returnTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 },
      { text: `${(adjustTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 },
      { text: `${(total || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 },
      {}
    ]
  ]

  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    width: [
      '3%', '6%', '6%', '5%', '5%',
      '5%', '5%', '5%', '5%', '5%',
      '5%', '5%', '5%', '5%', '5%',
      '5%', '5%', '5%', '5%', '5%'
    ],
    pageMargins: [50, 130, 50, 60],
    pageSize: { width: 1483, height: 2100 },
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
