const checkBankActive = (item, cost = []) => {
  if (!item) return false
  if (!cost) return false
  if (item && !item.id) return false
  if (cost && cost.length === 0) return false
  const selectedCost = cost.filter(filtered => filtered.bankId === item.id && filtered.active)
  if (selectedCost && selectedCost.length > 0) return true
  return false
}

const getCharge = (item, cost = [], type = 'chargeNominal') => {
  if (!item) return 0
  if (!cost) return 0
  if (item && !item.id) return 0
  if (cost && cost.length === 0) return 0
  const selectedCost = cost.filter(filtered => filtered.bankId === item.id && filtered.active)
  if (selectedCost && selectedCost.length > 0) return selectedCost[0][type]
  return 0
}

const generateListBank = (bank = [], cost = []) => {
  if (bank && bank.length > 0) {
    return bank.map((item) => {
      const active = checkBankActive(item, cost)
      const chargeNominal = getCharge(item, cost, 'chargeNominal')
      const chargePercent = getCharge(item, cost, 'chargePercent')
      return ({
        ...item,
        chargeNominal,
        chargePercent,
        active
      })
    })
  }
  return []
}

export {
  getCharge,
  checkBankActive,
  generateListBank
}
