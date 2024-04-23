import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { numberFormatter } from 'utils/string'
import { lstorage } from 'utils'
import { APPNAME, MAIN_WEBSITE } from 'utils/config.company'
import QRCode from 'qrcode'
import ShelfStickerCard from '../../../../components/Pdf/ShelfStickerCard'

const NUMBER_OF_COLUMN = 5
const BRAND_NAME_SIZE_IN_POINT = 4
const BRAND_NAME_SIZE = BRAND_NAME_SIZE_IN_POINT * 1.3333 // ubah ke adobe pt
const PRODUCT_NAME_SIZE_IN_POINT = 5
const PRODUCT_NAME_SIZE = PRODUCT_NAME_SIZE_IN_POINT * 1.3333 // ubah ke adobe pt

const PRODUCT_CODE_SIZE_IN_POINT = 4
const PRODUCT_CODE_SIZE = PRODUCT_CODE_SIZE_IN_POINT * 1.3333 // ubah ke adobe pt

const PRICE_SIZE_IN_POINT = 12
const PRICE_SIZE = PRICE_SIZE_IN_POINT * 1.3333 // ubah ke adobe pt
const NUMBER_OF_PRODUCT_NAME = 32
const WIDTH_TABLE_IN_CENTI = 5
const HEIGHT_TABLE_IN_CENTI = 3.4
const WIDTH_TABLE = (WIDTH_TABLE_IN_CENTI / 2.54) * 72
const HEIGHT_TABLE = (HEIGHT_TABLE_IN_CENTI / 2.54) * 72
const WIDTH_LOGO_IMAGE_IN_CENTI = 1.7
const HEIGHT_LOGO_IMAGE_IN_CENTI = 0.3
const WIDTH_LOGO_IMAGE = (WIDTH_LOGO_IMAGE_IN_CENTI / 2.54) * 72
const HEIGHT_LOGO_IMAGE = (HEIGHT_LOGO_IMAGE_IN_CENTI / 2.54) * 72

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
    margin: [3, 0]
  },
  brandName: {
    alignment: 'left',
    bold: true,
    fontSize: BRAND_NAME_SIZE,
    margin: [0, 0, 0, 0]
  },
  productName1: {
    alignment: 'left',
    fontSize: PRODUCT_NAME_SIZE,
    margin: [0, 0, 0, 0]
  },
  productName2: {
    alignment: 'left',
    fontSize: PRODUCT_NAME_SIZE,
    margin: [0, 0, 0, 0]
  },
  others: {
    fontSize: PRICE_SIZE,
    margin: [5],
    alignment: 'left'
  },
  productCode: {
    fontSize: PRODUCT_CODE_SIZE,
    margin: [5, 0],
    alignment: 'left'
  },
  halalText: {
    fontSize: PRODUCT_CODE_SIZE,
    margin: [5, 0],
    bold: true,
    alignment: 'left'
  },
  printDate: {
    fontSize: PRODUCT_NAME_SIZE,
    margin: [3, 0],
    italics: true,
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

const getQRCode = async (productCode) => {
  const canvasId = document.createElement('canvas')
  return new Promise(
    (resolve, reject) => {
      QRCode.toCanvas(canvasId, `${MAIN_WEBSITE}/product/${productCode}`, (error) => {
        if (error) reject(error)
        resolve(canvasId.toDataURL('image/png'))
      })
    }
  )
}

const createTableBody = async (tableBody, aliases) => {
  let body = []
  let images
  const storeId = lstorage.getCurrentUserStore()
  const base = await getBase64FromUrl(`/print-shelf-${APPNAME}.png`)
  const pigIcon = await getBase64FromUrl('/pig-icon.png')
  images = {
    AppLogo: base,
    PigIcon: pigIcon
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
            item.distPrice06 = price[0].distPrice06
            item.distPrice07 = price[0].distPrice07
            item.distPrice08 = price[0].distPrice08
            item.distPrice09 = price[0].distPrice09
          }
        }
        let background = '#ffffff'
        if (tableBody[key].info.categoryColor) {
          background = tableBody[key].info.categoryColor
        }
        let color = '#000000'
        // eslint-disable-next-line no-await-in-loop
        const imageBase = await getQRCode(tableBody[key].info.productCode)
        images[`${item.productCode}`] = imageBase
        const maxStringPerRow1 = tableBody[key].info.productName.slice(0, NUMBER_OF_PRODUCT_NAME).toString()
        // eslint-disable-next-line no-await-in-loop
        let row = [
          {
            columns: [
              {
                stack: [
                  {
                    image: 'AppLogo',
                    width: WIDTH_LOGO_IMAGE,
                    height: HEIGHT_LOGO_IMAGE,

                    alignment: 'left'
                  },
                  {
                    text: tableBody[key].info.brandName.slice(0, NUMBER_OF_PRODUCT_NAME).toString(),
                    style: 'brandName',
                    alignment: 'left',
                    width: WIDTH_TABLE
                  }
                ]
              }
            ]
          }
        ]
        row.push(

        )
        let maxStringPerRow2 = ' '
        if (tableBody[key].info.productName.toString().length > NUMBER_OF_PRODUCT_NAME) {
          maxStringPerRow2 = tableBody[key].info.productName.slice(NUMBER_OF_PRODUCT_NAME, 68).toString()
        }

        row.push(
          {
            text: maxStringPerRow1,
            style: 'productName1',
            alignment: 'left',
            width: WIDTH_TABLE
          }
        )
        row.push({
          text: maxStringPerRow2,
          style: 'productName2',
          alignment: 'left'
        })
        // row.push({
        //   canvas: [{ type: 'line', x1: 0, y1: 5, x2: WIDTH_TABLE, y2: 5, lineWidth: 0.5 }]
        // })
        // eslint-disable-next-line no-await-in-loop


        if (aliases.check1) {
          row.push({
            text: numberFormatter(tableBody[key].info[aliases.price1]),
            fillColor: background,
            background,
            color,
            style: 'sellPrice'
          })
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

        const stackProduct = []
        stackProduct.push({
          text: tableBody[key].info.productCode,
          style: 'productCode',
          margin: [0, 0],
          alignment: 'left',
          width: '60%'
        })
        stackProduct.push({
          text: moment().format('YYYY-MM-DD'),
          style: 'productCode',
          margin: [0, 0],
          alignment: 'left',
          width: '60%'
        })

        const columnProduct = []

        columnProduct.push({
          stack: stackProduct
        })

        row.push({
          columns: columnProduct
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
          name: 'Print',
          width: [WIDTH_TABLE, WIDTH_TABLE, WIDTH_TABLE, WIDTH_TABLE, WIDTH_TABLE],
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
    }).catch(error => console.log('error: ', error))
  }

  render () {
    return (
      <div>
        <ShelfStickerCard {...this.state.pdfProps} />
      </div>
    )
  }
}

PrintShelf.propTypes = {
  user: PropTypes.object,
  stickers: PropTypes.object
}

export default PrintShelf
