import React from 'react'
import PropTypes from 'prop-types'
import { BasicReportCard } from 'components'
// import bwipjs from 'bwip-js'

const NUMBER_OF_COLUMN = 2
const HEIGHTWITHMARGIN = 86.9291338593
const HEIGHT = 75.590551182
const WIDTH = 151.181102364
const MARGIN = 5.66929133865

// const createBarcodeImage = (text, opt) => {
//   opt = opt || {}
//   const format = opt.format || 'code128'
//   const height = opt.height || 5
//   return new Promise((resolve, reject) => {
//     try {
//       bwipjs.toBuffer({
//         bcid: format,
//         text,
//         height,
//         parsefnc: true
//       }, (err, img) => {
//         if (err) { return reject(err) }
//         return resolve(img)
//       })
//     } catch (errMessage) {
//       return reject(errMessage)
//     }
//   })
// }

const createTableBody = async (tableBody) => {
  let body = []
  // function ToBase64 (u8) {
  //   // eslint-disable-next-line no-undef
  //   return btoa(String.fromCharCode.apply(null, u8))
  // }
  for (let key in tableBody) {
    if (tableBody.hasOwnProperty(key)) {
      for (let i = 0; i < tableBody[key].qty; i += 1) {
        const productCode = tableBody[key].info.productCode.toString()
        const productName = tableBody[key].info.productName.slice(0, 85).toString()
        // eslint-disable-next-line no-await-in-loop
        // const res = await createBarcodeImage(tableBody[key].info.barCode01 || productCode)
        let row = []
        // const image = ToBase64(res)
        row.push({ text: productCode, style: 'productCode' })
        row.push({ text: productName, style: 'productName' })
        // row.push({ image: `data:image/jpeg;base64,${image}`, style: 'productBarcode' })
        // row.push({ text: tableBody[key].info.barCode01 || productCode, style: 'productCode' })
        row.push({ text: `Rp ${(tableBody[key].info.sellPrice || 0).toLocaleString()}`, margin: [0, (5 - Math.ceil(productName.length / 26)) * 5, 10, 0], style: 'sellPrice' })
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
    fontSize: 8
  },
  productName: {
    // fontSize: 5,
    fontSize: 9,
    margin: [5, 0, 5, 5],
    alignment: 'center'
  },
  productCode: {
    // fontSize: 5,
    fontSize: 9,
    margin: [0, 0],
    alignment: 'center'
  },
  productBarcode: {
    margin: [10, 0]
  }
}

class PrintSticker extends React.PureComponent {
  state = {
    tableBody: []
  }

  componentDidMount () {
    this.setTableBody()
  }

  componentWillReceiveProps (nextProps) {
    const { stickers } = this.props
    let different = false
    if (stickers.length !== nextProps.stickers) {
      this.setTableBody()
    }
    for (let key in stickers) {
      const item = stickers[key]
      const compareTo = nextProps.stickers[key]
      if (item.name !== compareTo.name || item.qty !== compareTo.qty) {
        different = true
      }
    }
    if (different) {
      this.setTableBody()
    }
  }

  async setTableBody () {
    const { stickers } = this.props
    let getList = []
    let tableBody = await createTableBody(stickers)
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
    this.setState({ tableBody: getList })
  }

  render () {
    const { tableBody } = this.state

    const pdfProps = {
      name: 'Print',
      width: [WIDTH, WIDTH],
      height: HEIGHT,
      pageSize: { width: (WIDTH * 2) + (MARGIN * 4), height: HEIGHTWITHMARGIN * 10 },
      pageOrientation: 'portrait',
      pageMargins: [MARGIN / 2, MARGIN],
      tableStyle: styles,
      tableBody,
      layout: 'noBorders',
      footer: {}
    }

    return (
      <BasicReportCard {...pdfProps} />
    )
  }
}

PrintSticker.propTypes = {
  user: PropTypes.object,
  dataSource: PropTypes.object
}

export default PrintSticker
