import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReportCard } from 'components'

const PrintSticker = ({ user, stickers }) => {
  const createTableBody = (tableBody) => {
    let body = []
    for (let key in tableBody) {
      if (tableBody.hasOwnProperty(key)) {
        for (let i = 0; i < tableBody[key].qty; i += 1) {
          let row = []
          const maxStringPerRow = tableBody[key].name.slice(0, 20).toString()
          row.push({ text: maxStringPerRow, style: 'productName' })
          row.push({ text: `Rp ${(tableBody[key].info.sellPrice || 0).toLocaleString()}`, style: 'sellPrice' })
          body.push(row)
        }
      }
    }
    return body
  }
  const styles = {
    info: {
      alignment: 'right',
      fontSize: 10
    },
    sellPrice: {
      bold: true,
      alignment: 'right',
      fontSize: 10,
      margin: [0, 7, 0, 2]
    },
    productName: {
      fontSize: 10,
      alignment: 'center'
    }
  }

  const footer = (currentPage, pageCount) => {
    return {
      margin: [40, 30, 40, 0],

      stack: [
        {
          canvas: [{ type: 'line', x1: 2, y1: -5, x2: 790, y2: -5, lineWidth: 0.1, margin: [0, 0, 0, 120] }]
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
    tableBody = createTableBody(stickers)
  } catch (e) {
    console.log(e)
  }

  let getList = []
  const getThree = (x, y) => {
    if (tableBody.slice(x, y).length < 6) {
      for (let i = x; i < y; i += 1) {
        tableBody[i] = tableBody[i] || []
      }
      getList.push(tableBody.slice(x, y))
    } else {
      getList.push(tableBody.slice(x, y))
    }
    return getList
  }

  let x = 0
  let y = 6
  for (let i = 0; i < Math.ceil(tableBody.length / 6); i += 1) {
    getThree(x, y)
    x += 6
    y += 6
  }

  const pdfProps = {
    name: 'Print',
    width: [130, 130, 130, 130, 130, 130],
    pageSize: { width: 890, height: 615 },
    pageOrientation: 'landscape',
    pageMargins: [25, 10, 25, 70],
    tableStyle: styles,
    tableBody: getList,
    footer
  }

  return (
    <BasicReportCard {...pdfProps} />
  )
}

PrintSticker.propTypes = {
  user: PropTypes.object,
  dataSource: PropTypes.object
}

export default PrintSticker
