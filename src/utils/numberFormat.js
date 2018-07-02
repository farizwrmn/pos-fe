const format = (value, decimal) => {
  if (value !== 0 && value instanceof Number) {
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

module.exports = {
  format
}
