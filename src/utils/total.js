import { formatNumberIndonesia } from './numberFormat'

const posTotal = (data) => {
  if (data.sellingPrice == null && data.price == null) {
    throw new Error('SellingPrice cannot be null')
  }
  if (data.qty === null || data.qty === undefined) {
    throw new Error('qty cannot be null')
  }
  if (data.discount === null || data.discount === undefined) {
    throw new Error('disc1 cannot be null')
  }
  if (data.disc1 === null || data.disc1 === undefined) {
    throw new Error('disc1 cannot be null')
  }
  if (data.disc2 === null || data.disc2 === undefined) {
    throw new Error('disc2 cannot be null')
  }
  if (data.disc3 === null || data.disc3 === undefined) {
    throw new Error('disc3 cannot be null')
  }

  let H1 = ((parseFloat(data.sellingPrice == null ? data.price : data.sellingPrice) * parseFloat(data.qty))) * (1 - (data.disc1 / 100))
  let H2 = H1 * (1 - (data.disc2 / 100))
  let H3 = H2 * (1 - (data.disc3 / 100))
  let TOTAL = H3 - data.discount
  return TOTAL
}

const posDiscount = (data) => {
  if (data.sellingPrice == null && data.sellPrice == null) {
    throw new Error('SellingPrice cannot be null')
  }
  if (data.qty === null || data.qty === undefined) {
    throw new Error('qty cannot be null')
  }
  if (data.discount === null || data.discount === undefined) {
    throw new Error('disc1 cannot be null')
  }
  if (data.disc1 === null || data.disc1 === undefined) {
    throw new Error('disc1 cannot be null')
  }
  if (data.disc2 === null || data.disc2 === undefined) {
    throw new Error('disc2 cannot be null')
  }
  if (data.disc3 === null || data.disc3 === undefined) {
    throw new Error('disc3 cannot be null')
  }

  let TOTALFIRST = (parseFloat(data.sellingPrice || data.sellPrice) * parseFloat(data.qty))
  let H1 = TOTALFIRST * (1 - (data.disc1 / 100))
  let H2 = H1 * (1 - (data.disc2 / 100))
  let H3 = H2 * (1 - (data.disc3 / 100))
  let TOTAL = H3 - data.discount
  return TOTALFIRST - TOTAL
}

const selisihMember = item => Math.max(0, (item.sellPrice - item.sellingPrice))

const formatNumbering = string => formatNumberIndonesia(parseFloat(string || 0))

module.exports = {
  posDiscount,
  posTotal,
  selisihMember,
  formatNumbering
}
