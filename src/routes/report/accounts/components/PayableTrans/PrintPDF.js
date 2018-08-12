/**
 * Created by boo on 9/19/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'
import { numberFormat, formatDate } from 'utils'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const PrintPDF = ({ user, listTrans, storeInfo, from, to }) => {
  // Declare Variable
  let beginTotal = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.beginValue || 0), 0)
  let nettoTotal = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.nettoTotal || 0), 0)
  let paidTotal = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.paid || 0), 0)
  let paidBankTotal = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.paidBank || 0), 0)
  let returnTotal = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.returnTotal || 0), 0)
  let adjustTotal = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.adjustTotal || 0), 0)
  let total = (listTrans || []).reduce((cnt, o) => cnt + parseFloat(o.nettoTotal ? ((o.nettoTotal || 0) - ((o.paid || 0) + (o.paidBank || 0))) : ((o.beginValue || 0) - ((o.paid || 0) + (o.paidBank || 0))) || 0), 0)

  // Declare Function
  const createTableBody = (tabledata) => {
    let body = []
    const rows = tabledata
    let count = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        const totalValue = data.nettoTotal ? ((data.nettoTotal || 0) - ((data.paid || 0) + (data.paidBank || 0))) : ((data.beginValue || 0) - ((data.paid || 0) + (data.paidBank || 0)))
        let row = [
          { text: count, alignment: 'center', fontSize: 11 },
          { text: (data.supplierName || ''), alignment: 'left', fontSize: 11 },
          { text: (data.supplierTaxId || ''), alignment: 'left', fontSize: 11 },
          { text: (data.address01 || data.address02 || ''), alignment: 'left', fontSize: 11 },
          { text: (data.accountNo || ''), alignment: 'left', fontSize: 11 },

          { text: formatDate(data.invoiceDate), alignment: 'left', fontSize: 11 },
          { text: formatDate(data.dueDate), alignment: 'left', fontSize: 11 },
          { text: (data.transNo || ''), alignment: 'left', fontSize: 11 },
          { text: formatNumberIndonesia(data.beginValue || 0), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.nettoTotal || 0), alignment: 'right', fontSize: 11 },

          { text: formatDate(data.printDate), alignment: 'left', fontSize: 11 },
          { text: formatNumberIndonesia(data.paid || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 }), alignment: 'right', fontSize: 11 },
          { text: (data.bankName || ''), alignment: 'right', fontSize: 11 },
          { text: (data.checkNo || ''), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.paidBank || 0), alignment: 'right', fontSize: 11 },

          { text: formatNumberIndonesia((data.paid + data.paidBank) || 0), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.returnTotal || 0), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.adjustTotal || 0), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(totalValue), alignment: 'right', fontSize: 11 },
          { text: (data.detail || ''), alignment: 'right', fontSize: 11 }
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
                text: `\nPERIODE: ${formatDate(from)}  TO  ${formatDate(to)}`,
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
      { fontSize: 12, text: 'NO', rowSpan: '2', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'SUPPLIER', colSpan: '4', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },

      { fontSize: 12, text: 'TGL FAKTUR', rowSpan: '2', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'TGL JTO', rowSpan: '2', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'NO FAKTUR', rowSpan: '2', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'SALDO AWAL', rowSpan: '2', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'PEMBELIAN', rowSpan: '2', style: 'tableHeader', alignment: 'center' },

      { fontSize: 12, text: 'PEMBAYARAN', colSpan: '6', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },

      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'RETUR PEMBELIAN', rowSpan: '2', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'ADJ', rowSpan: '2', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'SALDO AKHIR', rowSpan: '2', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'KETERANGAN', rowSpan: '2', style: 'tableHeader', alignment: 'center' }
    ],
    [
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'NAMA SUPPLIER', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'NPWP', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'ALAMAT', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'NO REK', style: 'tableHeader', alignment: 'center' },

      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },

      { fontSize: 12, text: 'TGL BYR TERAKHIR', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'CASH', style: 'tableHeader', alignment: 'center' },
      // { fontSize: 12, text: 'VIA BANK', colSpan: '3', style: 'tableHeader', alignment: 'center' },
      // { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      // { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'NAMA BANK', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'NO GIRO', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'NOMINAL BANK', style: 'tableHeader', alignment: 'center' },

      { fontSize: 12, text: 'JUMLAH BAYAR', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' }
    ]
    // ,
    // [
    //   { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
    //   { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
    //   { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
    //   { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
    //   { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },

    //   { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
    //   { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
    //   { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
    //   { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
    //   { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },

    //   { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
    //   { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
    //   { fontSize: 12, text: 'NAMA BANK', style: 'tableHeader', alignment: 'center' },
    //   { fontSize: 12, text: 'NO GIRO', style: 'tableHeader', alignment: 'center' },
    //   { fontSize: 12, text: 'NOMINAL BANK', style: 'tableHeader', alignment: 'center' },

    //   { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
    //   { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
    //   { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
    //   { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' },
    //   { fontSize: 12, text: '', style: 'tableHeader', alignment: 'center' }
    // ]
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
      { text: `${(paidBankTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 },

      { text: `${(paidTotal + paidBankTotal || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, alignment: 'right', fontSize: 12 },
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
  from: PropTypes.string.isRequired,
  to: PropTypes.string
}

export default PrintPDF
