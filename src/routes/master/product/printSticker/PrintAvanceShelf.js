import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { BasicReportCard } from 'components'
import { numberFormatter } from 'utils/string'
import { lstorage } from 'utils'
import { APPNAME } from 'utils/config.company'

const NUMBER_OF_COLUMN = 3
const PRODUCT_NAME_SIZE_IN_POINT = 8
const PRICE_SIZE_IN_POINT = 28
const PRODUCT_NAME_SIZE = PRODUCT_NAME_SIZE_IN_POINT * 1.3333 // ubah ke adobe pt
const PRICE_SIZE = PRICE_SIZE_IN_POINT * 1.3333 // ubah ke adobe pt
const NUMBER_OF_PRODUCT_NAME = 28
const WIDTH_TABLE_IN_CENTI = 8
const HEIGHT_TABLE_IN_CENTI = 5
const WIDTH_TABLE = (WIDTH_TABLE_IN_CENTI / 2.54) * 72
const HEIGHT_TABLE = (HEIGHT_TABLE_IN_CENTI / 2.54) * 72
const WIDTH_LOGO_IMAGE_IN_CENTI = 2
const HEIGHT_LOGO_IMAGE_IN_CENTI = 1.2
const WIDTH_IMAGE_IN_CENTI = 2
const HEIGHT_IMAGE_IN_CENTI = 2
const WEIGHT_LOGO_IMAGE = (WIDTH_LOGO_IMAGE_IN_CENTI / 2.54) * 72
const HEIGHT_LOGO_IMAGE = (HEIGHT_LOGO_IMAGE_IN_CENTI / 2.54) * 72
const WIDTH_IMAGE = (WIDTH_IMAGE_IN_CENTI / 2.54) * 72
const HEIGHT_IMAGE = (HEIGHT_IMAGE_IN_CENTI / 2.54) * 72

const styles = {
  info: {
    alignment: 'left',
    fontSize: PRODUCT_NAME_SIZE,
    bold: true
  },
  sellPrice: {
    bold: true,
    alignment: 'right',
    fontSize: PRICE_SIZE,
    width: '100%',
    margin: [0, 5]
  },
  productName1: {
    alignment: 'center',
    fontSize: PRODUCT_NAME_SIZE,
    margin: [0, 5, 0, 0]
  },
  productName2: {
    alignment: 'center',
    fontSize: PRODUCT_NAME_SIZE,
    margin: [0, 0, 0, 9]
  },
  others: {
    fontSize: PRICE_SIZE,
    margin: [5],
    alignment: 'left'
  },
  productCode: {
    fontSize: PRODUCT_NAME_SIZE,
    margin: [0, 0],
    alignment: 'left'
  }
}

const getBase64FromUrl = async (url) => {
  const data = await fetch(url)
  const blob = await data.blob()
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onloadend = () => {
      const base64data = reader.result
      resolve(base64data)
    }
  })
}

const createTableBody = async (tableBody, aliases) => {
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
        // eslint-disable-next-line no-await-in-loop
        const base = await getBase64FromUrl(`/invoice-logo-white-${APPNAME}.png`)
        let row = [
          {
            // image: `${base}`,
            text: 'K3MART',
            size: 40,
            fontSize: 40,
            width: WIDTH_TABLE / 2,
            height: HEIGHT_LOGO_IMAGE,
            color: '#FFFFFF',
            alignment: 'center',
            background: '#212121',
            fillColor: '#212121'
          }
        ]
        const maxStringPerRow1 = tableBody[key].info.productName.slice(0, NUMBER_OF_PRODUCT_NAME).toString()
        let maxStringPerRow2 = ' '
        if (tableBody[key].info.productName.toString().length > NUMBER_OF_PRODUCT_NAME) {
          maxStringPerRow2 = tableBody[key].info.productName.slice(NUMBER_OF_PRODUCT_NAME, 60).toString()
        }

        row.push(
          {
            text: maxStringPerRow1,
            style: 'productName1',
            alignment: 'center',
            width: WIDTH_TABLE,
            fillColor: '#ffffff'
          }
        )
        row.push({ text: maxStringPerRow2, style: 'productName2', alignment: 'center', fillColor: '#ffffff' })

        row.push({
          text: moment().format('YYYY-MM-DD'), style: 'productCode', alignment: 'right', fillColor: '#ffffff'
        })
        let background = '#ffffff'
        if (tableBody[key].info.categoryColor) {
          background = tableBody[key].info.categoryColor
        }
        const color = '#000000'
        // row.push({
        //   canvas: [{ type: 'line', x1: 0, y1: 5, x2: WIDTH_TABLE, y2: 5, lineWidth: 0.5 }]
        // })
        if (aliases.check1) {
          row.push({ text: numberFormatter(tableBody[key].info[aliases.price1]), width: '100%', fillColor: background, background, color, style: 'sellPrice' })
        }
        if (aliases.check2) {
          row.push({
            columns: [
              { text: `Rp ${(tableBody[key].info[aliases.price2] || 0).toLocaleString()}`, style: 'others', alignment: 'right', fillColor: '#ffffff' }
            ]
          })
        }
        row.push({
          text: (tableBody[key].info.productCode || '').toString(), style: 'productCode', alignment: 'right', fillColor: '#ffffff'
        })
        body.push(row)
      }
    }
  }
  return body
}

class PrintShelf extends Component {
  state = {
    pdfProps: {
      name: 'Print',
      width: [WIDTH_TABLE, WIDTH_TABLE, WIDTH_TABLE],
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
      tableBody: [],
      footer: () => {
        return ({
          margin: [],
          stack: []
        })
      }
    }
  }

  componentDidMount () {
    const { stickers, aliases } = this.props
    createTableBody(stickers, aliases).then((tableBody) => {
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
      console.log('tableBody', tableBody)
      return this.setState({
        pdfProps: {
          name: 'Print',
          width: [WIDTH_TABLE, WIDTH_TABLE, WIDTH_TABLE],
          height: HEIGHT_TABLE,
          pageSize: 'A4',
          pageOrientation: 'landscape',
          pageMargins: [17, 30, 17, 30],
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
          footer: () => {
            return ({
              margin: [],
              stack: []
            })
          }
        }
      })
    })
  }

  render () {
    return (
      <BasicReportCard {...this.state.pdfProps} />
    )
  }
}

PrintShelf.propTypes = {
  user: PropTypes.object,
  stickers: PropTypes.object
}

export default PrintShelf
