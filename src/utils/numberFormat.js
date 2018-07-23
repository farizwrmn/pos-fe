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
  if (typeof value === 'number') {
    return (text || 0).toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } else if (typeof value === 'string') {
    return (text || '-').toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return (text || '-').toLocaleString(['ban', 'id'], { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

module.exports = {
  formatNumberInExcel,
  formatNumberIndonesia
}
