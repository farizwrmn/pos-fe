const posTotal = (data) => {
  let H1 = ((parseFloat(data.sellingPrice) * parseFloat(data.qty))) * (1 - (data.disc1 / 100))
  let H2 = H1 * (1 - (data.disc2 / 100))
  let H3 = H2 * (1 - (data.disc3 / 100))
  let TOTAL = H3 - data.discount
  return TOTAL
}

module.exports = {
  posTotal
}
