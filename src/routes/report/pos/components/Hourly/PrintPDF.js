/**
 * Created by boo on 9/19/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'

const PrintPDF = ({ user, transTime, listTrans, storeInfo, fromDate, toDate }) => {
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
          { text: moment(data.transDate).format('DD-MMM-YYYY'), alignment: 'left', fontSize: 11 },
          { text: data.count1, alignment: 'right', fontSize: 11 },
          { text: data.count2, alignment: 'right', fontSize: 11 },
          { text: data.count3, alignment: 'right', fontSize: 11 },
          { text: data.count4, alignment: 'right', fontSize: 11 }
        ]
        body.push(row)
      }
      count += 1
    }
    return body
  }

  // Declare Variable
  let count1 = listTrans.reduce((cnt, o) => cnt + o.count1, 0)
  let count2 = listTrans.reduce((cnt, o) => cnt + o.count2, 0)
  let count3 = listTrans.reduce((cnt, o) => cnt + o.count3, 0)
  let count4 = listTrans.reduce((cnt, o) => cnt + o.count4, 0)
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
            text: 'LAPORAN PENJUALAN PER JAM',
            style: 'header',
            fontSize: 18,
            alignment: 'center'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 740, y2: 5, lineWidth: 0.5 }]
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
          canvas: [{ type: 'line', x1: 0, y1: -8, x2: 740, y2: -8, lineWidth: 0.5 }]
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
      { fontSize: 12, text: 'TANGGAL', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: `${transTime.transTime1} - ${transTime.transTime2}`, style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: `${transTime.transTime3} - ${transTime.transTime4}`, style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: `${transTime.transTime5} - ${transTime.transTime6}`, style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: `${transTime.transTime7} - ${transTime.transTime8}`, style: 'tableHeader', alignment: 'center' }
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
      { text: 'Total', colSpan: 2, alignment: 'center', fontSize: 12 },
      {},
      { text: count1, alignment: 'right', fontSize: 12 },
      { text: count2, alignment: 'right', fontSize: 12 },
      { text: count3, alignment: 'right', fontSize: 12 },
      { text: count4, alignment: 'right', fontSize: 12 }
    ]
  ]

  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    width: ['6%', '17%', '19%', '19%', '19%', '19%'],
    pageMargins: [50, 130, 50, 60],
    pageSize: 'A4',
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
