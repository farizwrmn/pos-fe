import React from 'react'
import PropTypes from 'prop-types'
import { BasicReportCard } from 'components'

const PrintSticker = ({ stickers }) => {
  const createTableBody = (tableBody) => {
    let body = []
    for (let key in tableBody) {
      if (tableBody.hasOwnProperty(key)) {
        for (let i = 0; i < tableBody[key].qty; i += 1) {
          let row = []
          const maxStringPerRow = tableBody[key].name.substr(0, 20).toString()
          row.push({ text: maxStringPerRow, style: 'productName' })
          row.push({ text: `Rp ${(tableBody[key].price || 0).toLocaleString()}`, style: 'sellPrice' })
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
    },
    headerStoreName: {
      fontSize: 18,
      margin: [45, 15, 0, 0]
    },
    headerTitle: {
      fontSize: 16,
      margin: [45, 2, 0, 0]
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
    name: 'Print Sticker',
    width: [130, 130, 130, 130, 130, 130],
    pageSize: { width: 890, height: 615 },
    pageOrientation: 'landscape',
    pageMargins: [25, 80, 25, 70],
    tableStyle: styles,
    tableBody: getList
    // companyLogo: logo,
  }

  return (
    <BasicReportCard {...pdfProps} />
  )
}

PrintSticker.propTypes = {
  user: PropTypes.object,
  storeInfo: PropTypes.object,
  dataSource: PropTypes.object
}

export default PrintSticker
