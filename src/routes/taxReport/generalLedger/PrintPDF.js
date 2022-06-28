/**
 * Created by veirry on 28/11/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { numberFormat } from 'utils'
import { BasicReport } from 'components'
import { getLinkName } from 'utils/string'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const PrintPDF = ({ user, listRekap, storeInfo, period, year }) => {
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
    let body = []
    const rows = tabledata
    let count = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = [
          { text: count, style: 'textCenter' },
          { text: (data.transDate || '').toString(), style: 'textLeft' },
          { text: (data.transactionType || '').toString(), style: 'textLeft' },
          { text: (data.transNo || data.transactionId || '').toString(), link: getLinkName(data.transactionId, data.transNo, data.transactionType), decoration: getLinkName(data.transactionId, data.transNo, data.transactionType) ? 'underline' : undefined, style: 'textLeft' },
          { text: (data.accountCode || '').toString(), style: 'textLeft' },
          { text: (data.accountName || '').toString(), style: 'textLeft' },
          { text: formatNumberIndonesia(data.debit || 0), style: 'textRight' },
          { text: formatNumberIndonesia(data.credit || 0), style: 'textRight' }
        ]
        body.push(row)
      }
      count += 1
    }
    return body
  }

  let tableHeader = []
  let tableFooter = []
  let headerTitle
  let widths = []
  let underline
  let pageSize
  headerTitle = 'LAPORAN HISTORY BUKU BESAR'
  underline = 1050
  widths.push('2%', '9%', '19%', '15%', '10%', '19%', '13%', '13%')
  pageSize = { width: 842, height: 1150 }
  tableHeader.push(
    [
      { fontSize: 12, text: 'NO', alignment: 'center' },
      { fontSize: 12, text: 'TANGGAL', alignment: 'center' },
      { fontSize: 12, text: 'TIPE TRANSAKSI', alignment: 'center' },
      { fontSize: 12, text: 'NO BUKTI', alignment: 'center' },
      { fontSize: 12, text: 'KODE', alignment: 'center' },
      { fontSize: 12, text: 'NAMA PERKIRAAN', alignment: 'center' },
      { fontSize: 12, text: 'DEBIT', alignment: 'center' },
      { fontSize: 12, text: 'CREDIT', alignment: 'center' }
    ]
  )

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

  let tableBody = []
  let tableTitle = []
  try {
    tableBody = createTableBody(listRekap)
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
