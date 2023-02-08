import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'

const PrintPDF = ({ dataSource, user, storeInfo }) => {
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
            text: 'LAPORAN CUT OFF',
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
      { text: 'NO', style: 'tableHeader' },
      { text: 'VENDOR', style: 'tableHeader' },
      { text: 'BANK', style: 'tableHeader' },
      { text: 'NO. REK', style: 'tableHeader' },
      { text: 'PEMILIK REK', style: 'tableHeader' },
      { text: 'TOTAL', style: 'tableHeader' },
      { text: 'KOMISI', style: 'tableHeader' },
      { text: 'BIAYA', style: 'tableHeader' },
      { text: 'BIAYA TRANSFER', style: 'tableHeader' },
      { text: 'DIBAYARKAN', style: 'tableHeader' },
      { text: 'DURASI SEWA', style: 'tableHeader' }
    ]
  ]

  const createTableBody = (tableBody) => {
    let body = []
    let count = 1
    for (let key in tableBody) {
      if (tableBody.hasOwnProperty(key)) {
        let row = []
        row.push({ text: count, alignment: 'center' })
        row.push({ text: (tableBody[key]['vendor.name']), alignment: 'left' })
        row.push({ text: (tableBody[key]['vendor.bank_name']), alignment: 'left' })
        row.push({ text: (tableBody[key]['vendor.account_number']), alignment: 'center' })
        row.push({ text: (tableBody[key]['vendor.account_name']), alignment: 'center' })
        row.push({ text: (tableBody[key].total), alignment: 'left' })
        row.push({ text: (tableBody[key].commission), alignment: 'left' })
        row.push({ text: (tableBody[key].charge), alignment: 'left' })
        row.push({ text: (tableBody[key]['vendor.bank_name'].toLowerCase() !== 'bca' ? 5000 : 0), alignment: 'left' })
        row.push({
          text: (tableBody[key]['vendor.bank_name'].toLowerCase() !== 'bca'
            ? tableBody[key].total - tableBody[key].commission - tableBody[key].charge - 5000
            : tableBody[key].total - tableBody[key].commission - tableBody[key].charge),
          alignment: 'left'
        })
        row.push({ text: (tableBody[key].endDate), alignment: 'left' })
        body.push(row)
      }
      count += 1
    }
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
    width: ['5%', '5%', '9%', '9%', '9%', '9%', '9%', '9%', '9%', '9%', '9%', '9%'],
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
