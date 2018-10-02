const formatNumberInExcel = (value, decimal) => {
  if (value !== 0 && typeof value === 'number') {
    let defaultFormat = '#,##0'
    if (decimal > 0) {
      defaultFormat += '.'
      for (let i = 0; i < decimal; i += 1) {
        defaultFormat += '0'
      }
    } else {
      return Error('cannot accept underzero')
    }
    return defaultFormat
  }
  return 'General'
}

const formatNumberIndonesia = (text) => {
  if (typeof text === 'number') {
    return (parseFloat(text)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } else if (typeof text === 'string') {
    return (parseFloat(text)).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return (parseFloat(text) || '-').toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

module.exports = {
  formatNumberInExcel,
  formatNumberIndonesia
}
