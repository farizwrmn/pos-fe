import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { RepeatReport } from 'components'

const PrintPDF = ({ user, listTrans, itemPrint }) => {
  let width = []
  let outJSON = listTrans

  let groupBy = (xs, key) => {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x)
      return rv
    }, {})
  }

  let groubedByTeam = groupBy(outJSON, 'transNo')
  let arr = Object.keys(groubedByTeam).map(index => groubedByTeam[index])

  const createTableBody = (tabledata) => {
    const headers = [
      [
        { fontSize: 8, text: 'NO', style: 'tableHeader', alignment: 'center' },
        { fontSize: 8, text: '@', style: 'tableHeader', alignment: 'center' },
        { fontSize: 8, text: 'CODE', style: 'tableHeader', alignment: 'center' },
        { fontSize: 8, text: 'NAME', style: 'tableHeader', alignment: 'center' },
        { fontSize: 8, text: 'BARCODE', style: 'tableHeader', alignment: 'center' },
        { fontSize: 8, text: 'QTY', style: 'tableHeader', alignment: 'center' }
      ]
    ]

    const rows = tabledata
    let body = headers
    let counter = 1
    for (let key in rows) {
      if (rows.hasOwnProperty(key)) {
        let data = rows[key]
        let row = [
          { text: counter, alignment: 'center', fontSize: 8 },
          { text: (data.locationName || '').toString(), alignment: 'left', fontSize: 8 },
          { text: (data.productCode || '').toString(), alignment: 'left', fontSize: 8 },
          { text: (data.productName || '').toString(), alignment: 'left', fontSize: 8 },
          { text: (data.barCode01 || '').toString(), alignment: 'left', fontSize: 8 },
          { text: (data.qty || '').toString(), alignment: 'center', fontSize: 8 }
        ]
        body.push(row)
      }
      counter += 1
    }

    const totalQty = tabledata.reduce((cnt, o) => cnt + (parseFloat(o.qty) || 0), 0)

    let totalRow = [
      { text: 'Total', colSpan: 5, alignment: 'center', fontSize: 8 },
      {},
      {},
      {},
      {},
      { text: totalQty, alignment: 'right', fontSize: 8 }
    ]
    body.push(totalRow)
    width.push(['6%', '7%', '20%', '38%', '20%', '9%'])
    return body
  }

  let tableBody = []
  let tableTitle = []
  for (let i = 0; i < arr.length; i += 1) {
    try {
      tableBody.push(createTableBody(arr[i]))
      tableTitle.push({ text: `Trans No : ${arr[i][0].transNo} - ${arr[i][0].description}`, style: 'tableTitle' })
    } catch (e) {
      console.log(e)
    }
  }

  const header = {
    stack: [
      {
        stack: [
          {
            text: 'PICKING LIST',
            style: 'header',
            fontSize: 12,
            alignment: 'center'
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 1080, y2: 5, lineWidth: 0.5 }]
          },
          {
            columns: [
              {
                text: `\n DARI: ${itemPrint.storeName} KE ${itemPrint.storeReceiverName}`,
                fontSize: 12,
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
          canvas: [{ type: 'line', x1: 0, y1: -8, x2: 1080, y2: -8, lineWidth: 0.5 }]
        },
        {
          columns: [
            {
              text: `Tanggal cetak: ${moment().format('LLLL')}`,
              margin: [0, 0, 0, 0],
              fontSize: 8,
              alignment: 'left'
            },
            {
              text: `Dicetak oleh: ${user.username}`,
              margin: [0, 0, 0, 0],
              fontSize: 8,
              alignment: 'center'
            },
            {
              text: `Halaman: ${(currentPage || 0).toString()} dari ${pageCount}`,
              fontSize: 8,
              margin: [0, 0, 0, 0],
              alignment: 'right'
            }
          ]
        }
      ]
    }
  }

  const styles = {
    header: {
      fontSize: 8,
      bold: true,
      margin: [0, 0, 0, 10]
    },
    subheader: {
      fontSize: 8,
      bold: true,
      margin: [0, 10, 0, 5]
    },
    tableExample: {
      margin: [0, 5, 0, 15]
    },
    tableHeader: {
      bold: true,
      fontSize: 8,
      color: 'black'
    },
    tableTitle: {
      fontSize: 8,
      margin: [0, 20, 0, 8]
    }
  }

  const pdfProps = {
    className: 'button-width02',
    pageSize: 'A4',
    pageOrientation: 'portrait',
    width,
    pageMargins: [50, 130, 50, 60],
    header,
    tableTitle,
    tableBody,
    layout: 'noBorder',
    footer,
    name: 'Picking List',
    buttonType: 'default',
    iconSize: 'icon-medium',
    tableStyle: styles,
    data: arr
  }

  return (
    <RepeatReport {...pdfProps} />
  )
}

PrintPDF.propTypes = {
  listTrans: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  period: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  storeInfo: PropTypes.object
}

export default PrintPDF
