const checkBankActive = (item, cost = []) => {
  if (!item) return false
  if (!cost) return false
  if (item && !item.id) return false
  if (cost && cost.length === 0) return false
  const selectedCost = cost.filter(filtered => filtered.bankId === item.id && filtered.active)
  if (selectedCost && selectedCost.length > 0) return true
  return false
}

const generateListBank = (bank = [], cost = []) => {
  if (bank && bank.length > 0) {
    return bank.map(item => ({
      ...item,
      active: checkBankActive(item, cost)
    }))
  }
  return []
}

export {
  checkBankActive,
  generateListBank
}
