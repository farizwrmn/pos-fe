const formatNumberInExcel = (value, decimal) => {
  if (value !== 0 && typeof value === 'number') {
    let defaultFormat = '#,##0'
    if (decimal > 0) {
      defaultFormat += '.'
      for (let i = 0; i < decimal; i += 1) {
        defaultFormat += '0'
      }
    }
    return defaultFormat
  }
  return 'General'
}

const formatNumberIndonesia = (text) => {
  if (!text) {
    text = '-'
  }
  if (typeof text === 'number') {
    return text.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return text.toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const toColumnName = (num) => {
  let ret = ''
  for (let a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
    ret = String.fromCharCode(parseFloat((num % b) / a) + 65) + ret
  }
  return ret
}

const numberToLetters = (num) => {
  let letters = ''
  while (num >= 0) {
    letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[num % 26] + letters
    num = Math.floor(num / 26) - 1
  }
  return letters
}

const numberFormatter = (currency) => {
  if (typeof currency === 'string' || typeof currency === 'number') {
    return `${currency.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
  }
  return '0'
}

module.exports = {
  formatNumberInExcel,
  formatNumberIndonesia,
  toColumnName,
  numberFormatter,
  numberToLetters
}
