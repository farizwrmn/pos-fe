import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'

const PrintPDF = ({ user, itemPrint, listTrans }) => {
  // Declare Function
  const createTableBody = (tabledata) => {
    let body = []
    const rows = tabledata
    let count = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = []
        row.push({ text: count, alignment: 'center', fontSize: 11 })
        row.push({ text: (data.transNo || '').toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: (data.deliveryOrderNo || '').toString(), alignment: 'left', fontSize: 11 })
        row.push({ text: (data.boxNumber || '').toString(), alignment: 'center', fontSize: 11 })
        row.push({ text: '', alignment: 'left', fontSize: 11 })
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
            text: 'TRUCKING LIST',
            style: 'header',
            fontSize: 18,
            alignment: 'center'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1151, y2: 5, lineWidth: 0.5 }]
          },
          {
            columns: [
              {
                text: `\n DARI: ${itemPrint.storeName} KE ${itemPrint.storeReceiverName}`,
                fontSize: 18,
                alignment: 'center'
              }
            ]
          },
          {
            text: `DATE: ${moment(itemPrint.createdAt).format('DD-MM-YYYY')}`,
            fontSize: 10,
            alignment: 'left'
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
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1151, y2: 5, lineWidth: 0.5 }]
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
      { fontSize: 12, text: 'TRANSFER OUT', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'DELIVERY ORDER', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'BOX NUMBER', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'CHECK', style: 'tableHeader', alignment: 'center' }
    ]
  ]
  let tableBody = []
  try {
    tableBody = createTableBody(listTrans)
  } catch (e) {
    console.log(e)
  }
  const tableFooter = []

  // Declare additional Props
  const pdfProps = {
    className: 'button-width02',
    width: ['6%', '30%', '30%', '22%', '12%'],
    pageMargins: [50, 130, 50, 60],
    pageSize: 'A4',
    pageOrientation: 'portrait',
    tableStyle: styles,
    layout: 'noBorder',
    name: 'Trucking List',
    buttonType: 'default',
    iconSize: 'icon-medium',
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

