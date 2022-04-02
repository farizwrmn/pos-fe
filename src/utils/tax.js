const PPN_PERCENTAGE = 11

export const getVATPercentage = () => {
  return PPN_PERCENTAGE
}

export const getDenominatorDppExclude = () => {
  return (100 + PPN_PERCENTAGE) / 100
}

export const getDenominatorPPNInclude = () => {
  return (100 + PPN_PERCENTAGE) / PPN_PERCENTAGE
}

export const getDenominatorPPNExclude = () => {
  return PPN_PERCENTAGE / 100
}
