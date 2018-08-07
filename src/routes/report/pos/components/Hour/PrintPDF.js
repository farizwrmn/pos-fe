/**
 * Created by boo on 9/19/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReport } from 'components'

const PrintPDF = ({ user, listTrans, storeInfo, fromDate, toDate }) => {
  // Declare Function
  let totalData = 0
  const createTableBody = (tabledata) => {
    let body = []
    const rows = tabledata
    let count = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let totalCount = 0
        for (let m = 0; m < 24; m += 1) {
          totalCount += parseInt(data[`count${m + 1}`], 10)
        }
        totalData += totalCount

        let row = [
          { text: count, alignment: 'center', fontSize: 11 },
          { text: moment(data.transDate).format('DD-MMM-YYYY'), alignment: 'left', fontSize: 11 },
          { text: data.count1, alignment: 'right', fontSize: 11 },
          { text: data.count2, alignment: 'right', fontSize: 11 },
          { text: data.count3, alignment: 'right', fontSize: 11 },
          { text: data.count4, alignment: 'right', fontSize: 11 },
          { text: data.count5, alignment: 'right', fontSize: 11 },
          { text: data.count6, alignment: 'right', fontSize: 11 },
          { text: data.count7, alignment: 'right', fontSize: 11 },
          { text: data.count8, alignment: 'right', fontSize: 11 },
          { text: data.count9, alignment: 'right', fontSize: 11 },
          { text: data.count10, alignment: 'right', fontSize: 11 },
          { text: data.count11, alignment: 'right', fontSize: 11 },
          { text: data.count12, alignment: 'right', fontSize: 11 },
          { text: data.count13, alignment: 'right', fontSize: 11 },
          { text: data.count14, alignment: 'right', fontSize: 11 },
          { text: data.count15, alignment: 'right', fontSize: 11 },
          { text: data.count16, alignment: 'right', fontSize: 11 },
          { text: data.count17, alignment: 'right', fontSize: 11 },
          { text: data.count18, alignment: 'right', fontSize: 11 },
          { text: data.count19, alignment: 'right', fontSize: 11 },
          { text: data.count20, alignment: 'right', fontSize: 11 },
          { text: data.count21, alignment: 'right', fontSize: 11 },
          { text: data.count22, alignment: 'right', fontSize: 11 },
          { text: data.count23, alignment: 'right', fontSize: 11 },
          { text: data.count24, alignment: 'right', fontSize: 11 },
          { text: totalCount, alignment: 'right', fontSize: 11 }
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
  let count5 = listTrans.reduce((cnt, o) => cnt + o.count5, 0)
  let count6 = listTrans.reduce((cnt, o) => cnt + o.count6, 0)
  let count7 = listTrans.reduce((cnt, o) => cnt + o.count7, 0)
  let count8 = listTrans.reduce((cnt, o) => cnt + o.count8, 0)
  let count9 = listTrans.reduce((cnt, o) => cnt + o.count9, 0)
  let count10 = listTrans.reduce((cnt, o) => cnt + o.count10, 0)
  let count11 = listTrans.reduce((cnt, o) => cnt + o.count11, 0)
  let count12 = listTrans.reduce((cnt, o) => cnt + o.count12, 0)
  let count13 = listTrans.reduce((cnt, o) => cnt + o.count13, 0)
  let count14 = listTrans.reduce((cnt, o) => cnt + o.count14, 0)
  let count15 = listTrans.reduce((cnt, o) => cnt + o.count15, 0)
  let count16 = listTrans.reduce((cnt, o) => cnt + o.count16, 0)
  let count17 = listTrans.reduce((cnt, o) => cnt + o.count17, 0)
  let count18 = listTrans.reduce((cnt, o) => cnt + o.count18, 0)
  let count19 = listTrans.reduce((cnt, o) => cnt + o.count19, 0)
  let count20 = listTrans.reduce((cnt, o) => cnt + o.count20, 0)
  let count21 = listTrans.reduce((cnt, o) => cnt + o.count21, 0)
  let count22 = listTrans.reduce((cnt, o) => cnt + o.count22, 0)
  let count23 = listTrans.reduce((cnt, o) => cnt + o.count23, 0)
  let count24 = listTrans.reduce((cnt, o) => cnt + o.count24, 0)
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
            text: 'LAPORAN CUSTOMER PER JAM (24h)',
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
      { fontSize: 12, text: 'NO', rowSpan: 2, style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'TANGGAL', rowSpan: 2, style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'Hours', colSpan: 24, style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '1', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '2', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '3', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '4', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '5', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '6', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '7', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '8', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '9', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '10', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '11', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '12', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '13', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '14', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '15', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '16', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '17', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '18', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '19', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '20', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '21', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '22', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '23', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'total', rowSpan: 2, style: 'tableHeader', alignment: 'center' }
    ],
    [
      { fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'TANGGAL', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '0', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '1', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '2', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '3', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '4', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '5', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '6', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '7', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '8', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '9', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '10', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '11', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '12', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '13', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '14', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '15', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '16', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '17', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '18', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '19', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '20', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '21', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '22', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: '23', style: 'tableHeader', alignment: 'center' },
      { fontSize: 12, text: 'total', style: 'tableHeader', alignment: 'center' }
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
      { text: count4, alignment: 'right', fontSize: 12 },
      { text: count5, alignment: 'right', fontSize: 12 },
      { text: count6, alignment: 'right', fontSize: 12 },
      { text: count7, alignment: 'right', fontSize: 12 },
      { text: count8, alignment: 'right', fontSize: 12 },
      { text: count9, alignment: 'right', fontSize: 12 },
      { text: count10, alignment: 'right', fontSize: 12 },
      { text: count11, alignment: 'right', fontSize: 12 },
      { text: count12, alignment: 'right', fontSize: 12 },
      { text: count13, alignment: 'right', fontSize: 12 },
      { text: count14, alignment: 'right', fontSize: 12 },
      { text: count15, alignment: 'right', fontSize: 12 },
      { text: count16, alignment: 'right', fontSize: 12 },
      { text: count17, alignment: 'right', fontSize: 12 },
      { text: count18, alignment: 'right', fontSize: 12 },
      { text: count19, alignment: 'right', fontSize: 12 },
      { text: count20, alignment: 'right', fontSize: 12 },
      { text: count21, alignment: 'right', fontSize: 12 },
      { text: count22, alignment: 'right', fontSize: 12 },
      { text: count23, alignment: 'right', fontSize: 12 },
      { text: count24, alignment: 'right', fontSize: 12 },
      { text: totalData, alignment: 'right', fontSize: 12 }
    ]
  ]

  // Declare additional Props
  const pdfProps = {
    className: 'button-width02 button-extra-large bgcolor-blue',
    width: [
      '6%',
      '17%',
      '3%', // 1
      '3%', // 2
      '3%', // 3
      '3%', // 4
      '3%', // 5
      '3%', // 6
      '3%', // 7
      '3%', // 8
      '3%', // 9
      '3%', // 10
      '3%', // 11
      '3%', // 12
      '3%', // 13
      '3%', // 14
      '3%', // 15
      '3%', // 16
      '3%', // 17
      '3%', // 18
      '3%', // 19
      '3%', // 20
      '3%', // 21
      '3%', // 22
      '3%', // 23
      '3%', // 24
      '5%'
    ],
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
