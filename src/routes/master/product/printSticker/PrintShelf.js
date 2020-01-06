import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReportCard } from 'components'
import { currencyFormatter } from 'utils/string'
import { name } from 'utils/config.main'

const PrintShelf = ({ stickers, user, aliases }) => {
  const createTableBody = (tableBody) => {
    let body = []
    for (let key in tableBody) {
      if (tableBody.hasOwnProperty(key)) {
        for (let i = 0; i < tableBody[key].qty; i += 1) {
          const maxStringPerRow1 = tableBody[key].info.productName.slice(0, 28).toString()
          let maxStringPerRow2 = ' '
          if (tableBody[key].info.productName.toString().length > 28) {
            maxStringPerRow2 = tableBody[key].info.productName.slice(28, 60).toString()
          }
          let row = [
            { text: maxStringPerRow1, style: 'productName1', alignment: 'center' },
            { text: maxStringPerRow2, style: 'productName2', alignment: 'center' }
          ]
          if (aliases.check1) {
            row.push({ text: aliases.alias1, style: 'info', margin: [0, 5, 0, 0] })
            row.push({ text: currencyFormatter(tableBody[key].info[aliases.price1]), style: 'sellPrice' })
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
      fontSize: 8
    },
    sellPrice: {
      bold: true,
      alignment: 'center',
      fontSize: 20,
      margin: [0, 10]
    },
    productName1: {
      alignment: 'center',
      fontSize: 13,
      margin: [0, 5, 0, 0]
    },
    productName2: {
      alignment: 'center',
      fontSize: 13,
      margin: [0, 0, 0, 15]
    },
    others: {
      fontSize: 12,
      margin: [5],
      alignment: 'left'
    },
    productCode: {
      fontSize: 9,
      margin: [5, 0],
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
    if (tableBody.slice(x, y).length < 3) {
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
  let y = 3
  for (let i = 0; i < Math.ceil(tableBody.length / 3); i += 1) {
    getThree(x, y)
    x += 3
    y += 3
  }

  const pdfProps = {
    name: 'Print',
    width: [260, 260, 260],
    height: 150,
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [17, 70, 17, 70],
    tableStyle: styles,
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
