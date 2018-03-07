import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReportCard } from 'components'

const PrintShelf = ({ stickers, user, storeInfo }) => {
  const createTableBody = (tableBody) => {
    let body = []
    for (let key in tableBody) {
      if (tableBody.hasOwnProperty(key)) {
        for (let i = 0; i < tableBody[key].qty; i += 1) {
          let row = []
          const maxStringPerRow = tableBody[key].name.substr(0, 28).toString()
          row.push({ text: maxStringPerRow, style: 'productName', alignment: 'left' })
          row.push({
            columns: [
              { text: `Rp ${(tableBody[key].info.sellPrice || 0).toLocaleString()}`, style: 'sellPrice' },
              { text: '(Sellprice)', style: 'info', margin: [0, 12, 0, 0] }
            ]
          })
          row.push({
            columns: [
              { text: `Rp ${(tableBody[key].info.distPrice01 || 0).toLocaleString()}`, style: 'others' },
              { text: '(Dist price 01)', style: 'info', margin: [0, 5, 0, 0] }
            ]
          })
          row.push({
            columns: [
              { text: `Rp ${(tableBody[key].info.distPrice02 || 0).toLocaleString()}`, style: 'others' },
              { text: '(Dist price 02)', style: 'info', margin: [0, 5, 0, 0] }
            ]
          })
          row.push({ text: (tableBody[key].info.productCode || '').toString(), style: 'others', alignment: 'left' })
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
      alignment: 'left',
      fontSize: 19,
      margin: [5, 3, 0, 0]
    },
    productName: {
      fontSize: 15,
      margin: [5, 0, 0, 0]
    },
    others: {
      fontSize: 12,
      margin: [5, 3, 0, 0],
      alignment: 'left'
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

  const header = [
    { text: `${storeInfo.name}`, style: 'headerStoreName' },
    { text: 'LAPORAN DAFTAR STOK BARANG', style: 'headerTitle' }
  ]

  const footer = (currentPage, pageCount) => {
    return {
      margin: [40, 30, 40, 0],

      stack: [
        {
          canvas: [{ type: 'line', x1: 2, y1: -5, x2: 732, y2: -5, lineWidth: 0.1, margin: [0, 0, 0, 120] }]
        },
        {
          columns: [
            {
              text: `Tanggal Cetak: ${moment().format('DD-MM-YYYY hh:mm:ss')}`,
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
              text: `Halaman: ${currentPage.toString()} dari ${pageCount}`,
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
    name: 'Shelf',
    width: [260, 260, 260],
    pageSize: { width: 870, height: 560 },
    pageOrientation: 'landscape',
    pageMargins: [25, 90, 25, 70],
    tableStyle: styles,
    tableBody: getList,
    header,
    footer
  }

  return (
    <BasicReportCard {...pdfProps} />
  )
}

PrintShelf.propTypes = {
  user: PropTypes.object,
  storeInfo: PropTypes.object,
  stickers: PropTypes.object
}

export default PrintShelf
