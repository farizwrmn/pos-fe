export const getDiscountByProductCode = (currentGrabOrder, productCode) => {
  let discount = 0
  const filteredCampaign = currentGrabOrder && currentGrabOrder.campaignItem ? currentGrabOrder
    .campaignItem
    .filter((filtered) => {
      if (!filtered) return false
      const splitTheObject = filtered.split('-')
      if (splitTheObject
        && splitTheObject.length === 3
        && splitTheObject[2] === productCode) {
        return true
      }
      return false
    }) : []
  if (filteredCampaign && filteredCampaign[0]) {
    let filteredCampaignOrder = currentGrabOrder
      .campaigns
      .filter((filtered) => {
        if (filtered && filtered.appliedItemIDs && filtered.appliedItemIDs.length > 0) {
          const selectedAppliedItems = filtered.appliedItemIDs.filter((filtered) => {
            if (!filtered) return false
            const splitTheObject = filtered.split('-')
            if (splitTheObject
              && splitTheObject.length === 3
              && splitTheObject[2] === productCode) {
              return true
            }
            return false
          })
          if (selectedAppliedItems && selectedAppliedItems[0]) {
            return true
          }
          return false
        }
        return false
      })
    if (filteredCampaignOrder
      && filteredCampaignOrder[0]
      && filteredCampaignOrder[0].deductedAmount > 0) {
      discount = filteredCampaignOrder[0].deductedAmount / 100
    }
  }
  return discount
}

export const getDiscountByBundleCode = (currentGrabOrder, bundleCode, listProduct) => {
  let discount = 0
  const validateProduct = listProduct.filter(filtered => filtered.bundleCode === bundleCode)
  if (validateProduct && validateProduct.length > 1) {
    return discount
  }
  const filteredCampaign = currentGrabOrder && currentGrabOrder.campaignItem ? currentGrabOrder
    .campaignItem
    .filter((filtered) => {
      if (!filtered) return false
      const splitTheObject = filtered.split('-')
      if (splitTheObject
        && splitTheObject.length === 3
        && splitTheObject[2] === bundleCode) {
        return true
      }
      return false
    }) : []
  if (filteredCampaign && filteredCampaign[0]) {
    let filteredCampaignOrder = currentGrabOrder
      .campaigns
      .filter((filtered) => {
        if (filtered && filtered.appliedItemIDs && filtered.appliedItemIDs.length > 0) {
          const selectedAppliedItems = filtered.appliedItemIDs.filter((filtered) => {
            if (!filtered) return false
            const splitTheObject = filtered.split('-')
            if (splitTheObject
              && splitTheObject.length === 3
              && splitTheObject[2] === bundleCode) {
              return true
            }
            return false
          })
          if (selectedAppliedItems && selectedAppliedItems[0]) {
            return true
          }
          return false
        }
        return false
      })
    if (filteredCampaignOrder
      && filteredCampaignOrder[0]
      && filteredCampaignOrder[0].deductedAmount > 0) {
      discount = filteredCampaignOrder[0].deductedAmount / 100
    }
  }
  return discount
}
