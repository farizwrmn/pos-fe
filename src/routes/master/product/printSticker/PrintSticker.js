import React from 'react'
import PropTypes from 'prop-types'
import { BasicReportCard } from 'components'

const NUMBER_OF_COLUMN = 2

const PrintSticker = ({ stickers }) => {
  const createTableBody = (tableBody) => {
    let body = []
    for (let key in tableBody) {
      if (tableBody.hasOwnProperty(key)) {
        for (let i = 0; i < tableBody[key].qty; i += 1) {
          let row = []
          const productCode = tableBody[key].info.productCode.toString()
          const productName = tableBody[key].info.productName.slice(0, 20).toString()
          row.push({ text: productName, style: 'productName' })
          row.push({ text: productCode, style: 'productCode' })
          // row.push({ text: `Rp ${(tableBody[key].info.sellPrice || 0).toLocaleString()}`, style: 'sellPrice' })
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
      fontSize: 7,
      alignment: 'center'
    },
    productCode: {
      fontSize: 7,
      alignment: 'center'
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
    if (tableBody.slice(x, y).length < NUMBER_OF_COLUMN) {
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
  let y = NUMBER_OF_COLUMN
  for (let i = 0; i < Math.ceil(tableBody.length / NUMBER_OF_COLUMN); i += 1) {
    getThree(x, y)
    x += NUMBER_OF_COLUMN
    y += NUMBER_OF_COLUMN
  }

  const HEIGHTWITHMARGIN = 86.9291338593
  const HEIGHT = 75.590551182
  const WIDTH = 151.181102364
  const MARGIN = 5.66929133865

  const pdfProps = {
    name: 'Print',
    width: [WIDTH, WIDTH],
    height: HEIGHT,
    pageSize: { width: (WIDTH * 2) + (MARGIN * 4), height: HEIGHTWITHMARGIN * 10 },
    pageOrientation: 'portrait',
    pageMargins: [MARGIN / 2, MARGIN * 2],
    tableStyle: styles,
    tableBody: getList,
    // layout: 'noBorders',
    footer: {}
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
