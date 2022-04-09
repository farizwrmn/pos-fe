const PPN_PERCENTAGE = 11

export const getVATPercentage = () => {
  return PPN_PERCENTAGE
}

const PB1_PERCENTAGE = 10

export const getCountryTaxPercentage = () => {
  return PB1_PERCENTAGE
}

export const getDenominatorDppInclude = () => {
  return (100 + PPN_PERCENTAGE) / 100
}

export const getDenominatorPPNInclude = () => {
  return (100 + PPN_PERCENTAGE) / PPN_PERCENTAGE
}

export const getDenominatorPPNExclude = () => {
  return PPN_PERCENTAGE / 100
}
