import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReportCard } from 'components'

const PrintSticker = ({ dataSource, user, storeInfo, total, logo }) => {
  const createTableBody = (tableBody) => {
    let body = []
    for (let key in tableBody) {
      if (tableBody.hasOwnProperty(key)) {
        for (let i = 0; i < total; i += 1) {
          let row = []
          const maxStringPerRow = tableBody[key].productName.substr(0, 25).toString()
          row.push({ text: maxStringPerRow, style: 'productName' })
          row.push({ image: 'companyLogo', width: 50, alignment: 'center' })
          row.push({ text: `Rp ${(tableBody[key].sellPrice || 0).toLocaleString()}`, style: 'sellPrice' })
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
      fontSize: 8
    },
    productName: {
      fontSize: 8,
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

  const header = [
    { text: `${storeInfo.name}`, style: 'headerStoreName' },
    { text: 'LAPORAN DAFTAR HARGA STOK BARANG', style: 'headerTitle' }
  ]

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
    tableBody = createTableBody(dataSource)
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
    pageSize: { width: 890, height: 565 },
    pageOrientation: 'landscape',
    pageMargins: [25, 80, 25, 70],
    tableStyle: styles,
    tableBody: getList,
    companyLogo: logo,
    header,
    footer
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
