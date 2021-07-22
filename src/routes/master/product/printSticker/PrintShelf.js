import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReportCard } from 'components'
import { currencyFormatter } from 'utils/string'
import { name } from 'utils/config.main'
import { lstorage } from 'utils'

const NUMBER_OF_COLUMN = 5
const NUMBER_OF_PRODUCT_NAME = 28
const WIDTH_TABLE = (5 / 2.54) * 72
const HEIGHT_TABLE = (3.8 / 2.54) * 72

const PrintShelf = ({ stickers, user, aliases }) => {
  const createTableBody = (tableBody) => {
    let body = []
    const storeId = lstorage.getCurrentUserStore()
    for (let key in tableBody) {
      if (tableBody.hasOwnProperty(key)) {
        for (let i = 0; i < tableBody[key].qty; i += 1) {
          const { info: item } = tableBody[key]
          if (item && item.storePrice && item.storePrice[0]) {
            const price = item.storePrice.filter(filtered => filtered.storeId === storeId)
            if (price && price[0]) {
              item.sellPrice = price[0].sellPrice
              item.distPrice01 = price[0].distPrice01
              item.distPrice02 = price[0].distPrice02
              item.distPrice03 = price[0].distPrice03
              item.distPrice04 = price[0].distPrice04
              item.distPrice05 = price[0].distPrice05
            }
          }
          const maxStringPerRow1 = tableBody[key].info.productName.slice(0, NUMBER_OF_PRODUCT_NAME).toString()
          let maxStringPerRow2 = ' '
          if (tableBody[key].info.productName.toString().length > NUMBER_OF_PRODUCT_NAME) {
            maxStringPerRow2 = tableBody[key].info.productName.slice(NUMBER_OF_PRODUCT_NAME, 60).toString()
          }
          let row = [
            { text: maxStringPerRow1, style: 'productName1', alignment: 'center' },
            { text: maxStringPerRow2, style: 'productName2', alignment: 'center' }
          ]
          const background = tableBody[key].info.categoryColor
          const color = '#000'
          // row.push({
          //   canvas: [{ type: 'line', x1: 0, y1: 5, x2: WIDTH_TABLE, y2: 5, lineWidth: 0.5 }]
          // })
          if (aliases.check1) {
            row.push({ text: aliases.alias1, style: 'info', margin: [0, 5, 0, 0] })
            row.push({ text: currencyFormatter(tableBody[key].info[aliases.price1]), width: '100%', fillColor: background, background, color, style: 'sellPrice' })
          }
          if (aliases.check2) {
            // row.push({ text: aliases.alias2, style: 'info', margin: [0, 5, 0, 0] })
            // row.push({ text: currencyFormatter(tableBody[key].info[aliases.price2]), style: 'others' })
            row.push({
              columns: [
                { text: aliases.alias2, style: 'info', margin: [0, 5, 0, 0], alignment: 'left' },
                { text: `Rp ${(tableBody[key].info[aliases.price2] || 0).toLocaleString()}`, style: 'others', alignment: 'right' }
              ]
            })
          }
          row.push({
            columns: [
              { text: (tableBody[key].info.productCode || '').toString(), style: 'productCode', alignment: 'left' },
              { text: moment().format('DD/MMM/YYYY'), style: 'productCode', alignment: 'right' }
            ]
          })
          row.push({ text: name, style: 'productCode', margin: [0, 5], alignment: 'center' })
          body.push(row)
        }
      }
    }
    return body
  }
  const styles = {
    info: {
      alignment: 'left',
      fontSize: 7,
      bold: true
    },
    sellPrice: {
      bold: true,
      alignment: 'center',
      fontSize: 17,
      width: '100%',
      margin: [0, 5]
    },
    productName1: {
      alignment: 'center',
      fontSize: 7,
      margin: [0, 5, 0, 0]
    },
    productName2: {
      alignment: 'center',
      fontSize: 7,
      margin: [0, 0, 0, 9]
    },
    others: {
      fontSize: 12,
      margin: [5],
      alignment: 'left'
    },
    productCode: {
      fontSize: 9,
      margin: [0, 0],
      alignment: 'left'
    }
  }

  const footer = (currentPage, pageCount) => {
    return {
      margin: [40, 30, 40, 0],

      stack: [
        {
          canvas: [{ type: 'line', x1: 2, y1: -5, x2: 760, y2: -5, lineWidth: 0.1, margin: [0, 0, 0, 120] }]
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

  const pdfProps = {
    name: 'Print',
    width: [WIDTH_TABLE, WIDTH_TABLE, WIDTH_TABLE, WIDTH_TABLE, WIDTH_TABLE],
    height: HEIGHT_TABLE,
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [17, 70, 17, 70],
    tableStyle: styles,
    layout: {
      hLineStyle () {
        return { dash: { length: 10, space: 4 } }
      },
      vLineStyle () {
        return { dash: { length: 4 } }
      }
    },
    tableBody: getList,
    footer
  }

  return (
    <BasicReportCard {...pdfProps} />
  )
}

PrintShelf.propTypes = {
  user: PropTypes.object,
  stickers: PropTypes.object
}

export default PrintShelf
