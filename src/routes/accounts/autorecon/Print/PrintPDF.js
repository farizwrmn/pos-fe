import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'
import { currencyFormatter } from 'utils/string'

const PrintPDF = ({ dataSource, user, name }) => {
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
            text: 'LAPORAN MDR CSV',
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
      { text: 'TANGGAL', style: 'tableHeader' },
      { text: 'TRANS NO', style: 'tableHeader' },
      { text: 'APPROVAL CODE', style: 'tableHeader' },
      { text: 'GROSS AMOUNT', style: 'tableHeader' },
      { text: 'MDR AMOUNT', style: 'tableHeader' },
      { text: 'MDR PERCENTAGE', style: 'tableHeader' }
    ]
  ]

  const createTableBody = (tableBody) => {
    let body = []
    let count = 1
    for (let key in tableBody) {
      if (tableBody.hasOwnProperty(key)) {
        for (let key1 in tableBody[key].paymentImport) {
          let row = []
          let paymentImport = tableBody[key].paymentImport[key1]
          row.push({ text: count, alignment: 'center' })
          row.push({ text: (tableBody[key].payment.transDate ? moment(tableBody[key].payment.transDate).format('DD MMM YYYY') : ''), alignment: 'center' })
          row.push({ text: tableBody[key].payment.posPayment.transNo || '', alignment: 'left' })
          row.push({ text: paymentImport.approvalCode || '', alignment: 'left' })
          row.push({ text: currencyFormatter(paymentImport.grossAmount), alignment: 'center' })
          row.push({ text: currencyFormatter(paymentImport.mdrAmount || 0), alignment: 'center' })
          row.push({ text: `${Number((paymentImport.mdrAmount / paymentImport.grossAmount) * 100).toFixed(2)} %`, alignment: 'center' })
          body.push(row)
        }
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
    name,
    className: '',
    width: ['4%', '10%', '17%', '15%', '20%', '15%', '19%'],
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
