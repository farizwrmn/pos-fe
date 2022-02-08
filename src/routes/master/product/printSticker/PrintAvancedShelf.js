import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { numberFormatter, withoutFormat } from 'utils/string'
import { lstorage } from 'utils'
import { IMAGEURL, APPNAME } from 'utils/config.company'
import ShelfStickerCard from '../../../../components/Pdf/ShelfStickerCard'

const NUMBER_OF_COLUMN = 3
const PRODUCT_NAME_SIZE_IN_POINT = 8
const PRICE_SIZE_IN_POINT = 20
const PRODUCT_NAME_SIZE = PRODUCT_NAME_SIZE_IN_POINT * 1.3333 // ubah ke adobe pt
const PRICE_SIZE = PRICE_SIZE_IN_POINT * 1.3333 // ubah ke adobe pt
const NUMBER_OF_PRODUCT_NAME = 28
const WIDTH_TABLE_IN_CENTI = 8
const HEIGHT_TABLE_IN_CENTI = 5
const WIDTH_TABLE = (WIDTH_TABLE_IN_CENTI / 2.54) * 72
const HEIGHT_TABLE = (HEIGHT_TABLE_IN_CENTI / 2.54) * 72
const WIDTH_LOGO_IMAGE_IN_CENTI = 5
const HEIGHT_LOGO_IMAGE_IN_CENTI = 0.8
const WIDTH_IMAGE_IN_CENTI = 2
const HEIGHT_IMAGE_IN_CENTI = 2
const WIDTH_LOGO_IMAGE = (WIDTH_LOGO_IMAGE_IN_CENTI / 2.54) * 72
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
    margin: [0, 12, 0, 0]
  },
  productName1: {
    alignment: 'center',
    fontSize: PRODUCT_NAME_SIZE,
    margin: [0, 5, 0, 0]
  },
  productName2: {
    alignment: 'center',
    fontSize: PRODUCT_NAME_SIZE,
    margin: [0, 0, 0, 4]
  },
  others: {
    fontSize: PRICE_SIZE,
    margin: [5],
    alignment: 'left'
  },
  productCode: {
    fontSize: PRODUCT_NAME_SIZE,
    margin: [10, 0],
    alignment: 'left'
  },
  printDate: {
    fontSize: PRODUCT_NAME_SIZE,
    margin: [10, 0],
    alignment: 'right'
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
  let images
  const storeId = lstorage.getCurrentUserStore()
  const base = await getBase64FromUrl(`/invoice-logo-white-${APPNAME}.png`)
  images = {
    AppLogo: base
  }
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
        let row = [
          {
            image: 'AppLogo',
            width: WIDTH_LOGO_IMAGE,
            height: HEIGHT_LOGO_IMAGE,

            fontSize: 30,
            color: '#ffffff',
            fillColor: '#212121',
            alignment: 'center'
          }
        ]
        console.log('row', row)
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
            width: WIDTH_TABLE
          }
        )
        row.push({
          text: maxStringPerRow2,
          style: 'productName2',
          alignment: 'center'
        })

        row.push({
          text: moment().format('YYYY-MM-DD'),
          style: 'printDate',
          alignment: 'right'
        })
        let background = '#ffffff'
        if (tableBody[key].info.categoryColor) {
          background = tableBody[key].info.categoryColor
        }
        const color = '#000000'
        // row.push({
        //   canvas: [{ type: 'line', x1: 0, y1: 5, x2: WIDTH_TABLE, y2: 5, lineWidth: 0.5 }]
        // })

        let imageBase = null
        if (!images[`${item.productCode}`]) {
          if (item
            && item.productImage != null
            && item.productImage !== '["no_image.png"]'
            && item.productImage !== '"no_image.png"'
            && item.productImage !== 'no_image.png') {
            const image = JSON.parse(item.productImage)
            if (image && image[0]) {
              // eslint-disable-next-line no-await-in-loop
              imageBase = await getBase64FromUrl(`${IMAGEURL}/${withoutFormat(image[0])}-small.jpg`)
            }
          }
        } else {
          imageBase = images[`${item.productCode}`]
        }
        if (imageBase && item.productCode) {
          images[`${item.productCode}`] = imageBase
        }
        if (aliases.check1) {
          if (imageBase && item.productCode) {
            row.push({
              columns: [
                {
                  image: `${item.productCode}`,
                  width: WIDTH_IMAGE,
                  height: HEIGHT_IMAGE,
                  margin: [10, 0],
                  fillColor: background,
                  background
                },

                {
                  text: numberFormatter(tableBody[key].info[aliases.price1]),
                  width: '70%',
                  fillColor: background,
                  background,
                  color,
                  style: 'sellPrice'
                }
              ],
              fillColor: background,
              background
            })
          } else {
            row.push({
              text: numberFormatter(tableBody[key].info[aliases.price1]),
              width: '100%',
              fillColor: background,
              background,
              color,
              style: 'sellPrice'
            })
          }
        }
        if (aliases.check2) {
          row.push({
            columns: [
              {
                text: `Rp ${(tableBody[key].info[aliases.price2] || 0).toLocaleString()}`,
                style: 'others',
                alignment: 'right'
              }
            ]
          })
        }
        row.push({
          text: (tableBody[key].info.productCode || '').toString(),
          style: 'productCode',
          margin: [10, 0],
          alignment: 'right'
        })
        body.push(row)
      }
    }
  }
  return { tableBody: body, images }
}

class PrintShelf extends Component {
  constructor (props) {
    super(props)
    this.generateSticker = this.generateSticker.bind(this)
  }

  state = {
    pdfProps: {
      name: 'Advanced Print',
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
    this.props.setClick(this.generateSticker)
    const { stickers } = this.props

    this.generateSticker(stickers)
  }

  generateSticker (stickers) {
    const { aliases } = this.props
    createTableBody(stickers, aliases).then((result) => {
      const { tableBody, images } = result
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
      return this.setState({
        pdfProps: {
          images,
          name: 'Advanced Print',
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
            },
            hLineColor () {
              return '#c4c4c4'
            },
            vLineColor () {
              return '#c4c4c4'
            },
            hLineWidth () {
              return 0.5
            },
            vLineWidth () {
              return 0.5
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
    console.log('this.state.pdfProps', this.state.pdfProps)
    return (
      <ShelfStickerCard {...this.state.pdfProps} />
    )
  }
}

PrintShelf.propTypes = {
  user: PropTypes.object,
  stickers: PropTypes.object
}

export default PrintShelf
