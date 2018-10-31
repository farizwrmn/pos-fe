import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'
import { numberFormat } from 'utils'

const { formatNumberIndonesia } = numberFormat

const PrintPDF = ({ customerInfo, listCashback, user, storeInfo, from, to }) => {
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
          { text: (data.transNo || '').toString(), alignment: 'left', fontSize: 11 },
          { text: (data.posDate ? moment(data.posDate).format('DD-MMM-YYYY') : '').toString(), alignment: 'left', fontSize: 11 },
          { text: (data.expirationDate ? moment(data.expirationDate).format('DD-MMM-YYYY') : '').toString(), alignment: 'left', fontSize: 11 },
          { text: formatNumberIndonesia(data.cashbackIn || ''), alignment: 'right', fontSize: 11 },
          { text: formatNumberIndonesia(data.cashbackOut || ''), alignment: 'right', fontSize: 11 },
          { text: (data.memo || ''), alignment: 'right', fontSize: 11 }
        ]
        body.push(row)
      }
      count += 1
    }
    return body
  }

  // Declare Variable
  let cashbackInTotal = listCashback.reduce((cnt, o) => cnt + parseFloat(o.cashbackIn), 0)
  let cashbackOutTotal = listCashback.reduce((cnt, o) => cnt + parseFloat(o.cashbackOut), 0)

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

  let periode
  if (from !== '' && to !== '') {
    periode = [
      {
        text: `\nPERIODE: ${moment(from).format('DD-MMM-YYYY')}  TO  ${moment(to).format('DD-MMM-YYYY')}`,
        fontSize: 12,
        alignment: 'left'
      },
      {
        text: `\nCUSTOMER: ${customerInfo.memberName} (${customerInfo.memberCode})`,
        fontSize: 12,
        alignment: 'right'
      }
    ]
  }

  const header = {
    stack: [
      {
        stack: [
          {
            stack: storeInfo.stackHeader01
          },
          {
            text: 'LAPORAN HISTORY CASHBACK',
            style: 'header',
            fontSize: 18,
            alignment: 'center'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 820 - (2 * 40), y2: 5, lineWidth: 0.5 }]
          },
          {
            columns: periode
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
          canvas: [{ type: 'line', x1: 0, y1: -8, x2: 820 - (2 * 40), y2: -8, lineWidth: 0.5 }]
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
      { fontSize: 12, text: 'NO_FAKTUR', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'TANGGAL', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'EXPIRED', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'IN', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'OUT', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'MEMO', style: 'tableHeader', alignment: 'center' }
    ]
  ]
  let tableBody = []
  try {
    tableBody = createTableBody(listCashback)
  } catch (e) {
    console.log(e)
  }
  const tableFooter = [
    [
      { text: 'Total', colSpan: 4, alignment: 'center', fontSize: 12 },
      {},
      {},
      {},
      { text: formatNumberIndonesia(cashbackInTotal), alignment: 'right', fontSize: 12 },
      { text: formatNumberIndonesia(cashbackOutTotal), alignment: 'right', fontSize: 12 },
      {}
    ]
  ]

  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    width: ['5%', '15%', '15%', '15%', '13%', '13%', '24%'],
    pageMargins: [50, 130, 50, 60],
    pageSize: 'A4',
    pageOrientation: 'landscape',
    tableStyle: styles,
    layout: 'noBorder',
    tableHeader,
    tableBody,
    tableFooter,
    data: listCashback,
    header,
    footer
  }

  return (
    <BasicReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  listCashback: PropTypes.array,
  user: PropTypes.object.isRequired,
  storeInfo: PropTypes.object.isRequired,
  from: PropTypes.string,
  to: PropTypes.string
}

export default PrintPDF
