import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'

const PrintPDF = ({ dataSource, summary, selectedVendor, user, storeInfo }) => {
  const styles = {
    header: {
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 10],
      alignment: 'center'
    },
    tableHeader: {
      bold: true,
      fontSize: 13,
      alignment: 'center'
    },
    tableBody: {
      fontSize: 11
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
            text: `LAPORAN LABA RUGI (${moment(summary.from).format('DD MMM YYYY')} - ${moment(summary.to).format('DD MMM YYYYY')})`,
            style: 'header'
          },
          {
            canvas: [{ type: 'line', x1: 2, y1: 5, x2: 762, y2: 5, lineWidth: 0.5 }]
          }
        ]
      }
    ],
    margin: [40, 12, 40, 30]
  }

  const tableHeader = [
    [
      { text: 'KETERANGAN', style: 'tableHeader' },
      { text: 'JUMLAH', style: 'tableHeader' }
    ]
  ]

  const createTableBody = () => {
    let body = []
    let row = []
    row.push({ text: 'VENDOR', alignment: 'center' })
    row.push({ text: selectedVendor.name, alignment: 'center' })
    body.push(row)

    row = []
    row.push({ text: 'TOTAL PENJUALAN', alignment: 'center' })
    row.push({ text: summary.total, alignment: 'center' })
    body.push(row)

    row = []
    row.push({ text: 'MODAL', alignment: 'center' })
    row.push({ text: summary.capital, alignment: 'center' })
    body.push(row)

    row = []
    row.push({ text: 'PAYMENT CHARGE', alignment: 'center' })
    row.push({ text: summary.charge, alignment: 'center' })
    body.push(row)

    row = []
    row.push({ text: 'KOMISI', alignment: 'center' })
    row.push({ text: summary.commission, alignment: 'center' })
    body.push(row)

    row = []
    row.push({ text: 'LABA KOTOR', alignment: 'center' })
    row.push({ text: summary.profit, alignment: 'center' })
    body.push(row)

    return body
  }

  const footer = (currentPage, pageCount) => {
    return {
      margin: [40, 30, 40, 0],

      stack: [
        {
          canvas: [{ type: 'line', x1: 2, y1: -5, x2: 762, y2: -5, lineWidth: 0.1, margin: [0, 0, 0, 120] }]
        },
        {
          columns: [
            {
              text: `Tanggal Cetak: ${moment().format('DD-MM-YYYY HH:mm:ss')}`,
              margin: [0, 0, 0, 0],
              fontSize: 9,
              alignment: 'left'
            },
            {
              text: `Dicetak Oleh: ${user.userid}`,
              fontSize: 9,
              margin: [0, 0, 0, 0],
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
  try {
    tableBody = createTableBody(dataSource)
  } catch (e) {
    console.log(e)
  }

  const pdfProps = {
    buttonType: '',
    iconSize: '',
    buttonSize: '',
    name: 'PDF',
    className: '',
    buttonStyle: { background: 'transparent', border: 'none', padding: 0 },
    width: ['25%', '25%'],
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [40, 130, 40, 60],
    tableStyle: styles,
    layout: 'noBorder',
    tableHeader,
    tableBody,
    data: dataSource,
    header,
    footer
  }

  console.log('pdfProps', pdfProps)

  return (
    <BasicReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  user: PropTypes.object.isRequired,
  storeInfo: PropTypes.object.isRequired,
  dataSource: PropTypes.object
}

export default PrintPDF
