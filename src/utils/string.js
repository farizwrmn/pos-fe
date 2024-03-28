import {
  EXPENSE,
  DEPOSITE,
  JOURNALENTRY,
  SALES,
  SALESPAY,
  PURCHASE,
  PPAY,
  TRANSFERINVOICE
} from 'utils/variable'
import lstorage from './lstorage'

const showOnlyLastWord = (words, digitToShow) => {
  let result = ''
  if (!words) return words

  const splitWord = words.split('')
  for (let key in splitWord) {
    let word = splitWord[key]
    const lastDigit = words.length - digitToShow
    const isLastDigit = key >= lastDigit
    if (isLastDigit) {
      result += word
    } else {
      result += 'X'
    }
  }
  return result
}

const currencyFormatterSetoran = (currency) => {
  if (typeof currency === 'string' || typeof currency === 'number') {
    return `Rp${(currency || '-').toLocaleString()}`
  }
  return 'Rp0'
}

const currencyFormatter = (currency) => {
  if (typeof currency === 'string' || typeof currency === 'number') {
    return `Rp ${(currency || '-').toLocaleString()}`
  }
  return 'Rp 0'
}

const numberFormatter = (currency) => {
  if (typeof currency === 'string' || typeof currency === 'number') {
    return `${currency.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
  }
  return '0'
}

const discountFormatter = (number) => {
  if (typeof number === 'string' || typeof number === 'number') {
    return `${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}%`
  }
  return ''
}

const countFollower = (number) => {
  if (number >= 1000000000) {
    return `${(number / 1000000000).toFixed(1).replace(/\.0$/, '')}B`
  }
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1).replace(/\.0$/, '')}M`
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(1).replace(/\.0$/, '')}K`
  }
  return number
}

const composeData = (id, value) => {
  return ({ id, value })
}

const getLinkName = (id, transNo, transType) => {
  switch (transType) {
    case EXPENSE:
      return `${window.location.origin}/cash-entry?edit=${encodeURIComponent(id)}`
    case DEPOSITE:
      return `${window.location.origin}/bank-entry?edit=${encodeURIComponent(id)}`
    case JOURNALENTRY:
      return `${window.location.origin}/journal-entry?edit=${encodeURIComponent(id)}`
    case SALES:
    case SALESPAY:
      return `${window.location.origin}/accounts/payment/${encodeURIComponent(transNo)}`
    case PURCHASE:
    case PPAY:
      return `${window.location.origin}/accounts/payable/${encodeURIComponent(transNo)}`
    case TRANSFERINVOICE:
      return `${window.location.origin}/inventory/transfer/invoice/${encodeURIComponent(id)}`
    default:
      return undefined
  }
}

const getDistPriceName = (fromStock) => {
  const listPrice = lstorage.getPriceName()
  const selectedDist = listPrice.filter(filtered => filtered.sellPrice === fromStock)
  if (selectedDist && selectedDist[0]) {
    return `${selectedDist[0].typeName}`
  }
  return fromStock
}

const getDistPricePercent = (fromStock) => {
  const listPrice = lstorage.getPriceName()
  const selectedDist = listPrice.filter(filtered => filtered.sellPrice === fromStock)
  if (selectedDist && selectedDist[0]) {
    return selectedDist[0].distPricePercent
  }
  return 1
}

const getDistPriceDescription = (fromStock) => {
  const listPrice = lstorage.getPriceName()
  const selectedDist = listPrice.filter(filtered => filtered.sellPrice === fromStock)
  if (selectedDist && selectedDist[0]) {
    return `${selectedDist[0].description}`
  }
  return fromStock
}

function withoutFormat (file) {
  const formats = ['png', 'jpg', 'jpeg', 'gif']
  const regex = new RegExp(`.(${formats.join('|')})$`, 'gi')
  return file.replace(regex, '')
}

export {
  showOnlyLastWord,
  currencyFormatter,
  currencyFormatterSetoran,
  numberFormatter,
  discountFormatter,
  composeData,
  countFollower,
  getLinkName,
  getDistPriceName,
  withoutFormat,
  getDistPriceDescription,
  getDistPricePercent
}
