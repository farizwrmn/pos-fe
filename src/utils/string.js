import {
  EXPENSE,
  DEPOSITE,
  JOURNALENTRY,
  SALES,
  SALESPAY,
  PURCHASE,
  PPAY
} from 'utils/variable'

const currencyFormatter = (currency) => {
  if (typeof currency === 'string' || typeof currency === 'number') {
    return `Rp ${currency.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
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
    default:
      return undefined
  }
}

export {
  currencyFormatter,
  numberFormatter,
  discountFormatter,
  composeData,
  countFollower,
  getLinkName
}
