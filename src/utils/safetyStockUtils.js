export const getRecommendedQtyToBuy = ({
  stock,
  orderedQty,
  safetyStock
}) => {
  let qtyToBuy = 0
  if ((stock - orderedQty) >= safetyStock) {
    qtyToBuy = 0
  } else {
    qtyToBuy = safetyStock - stock - orderedQty
  }
  return qtyToBuy
}

export const getRecommendedBoxToBuy = ({
  dimensionBox,
  stock,
  orderedQty,
  safetyStock
}) => {
  const minimumBuyingQty = dimensionBox
  let qtyToBuy = getRecommendedQtyToBuy({
    stock,
    orderedQty,
    safetyStock
  })
  let boxToBuy = 0
  if (Number(minimumBuyingQty) > 1 && qtyToBuy > 0) {
    boxToBuy = Math.ceil(qtyToBuy / minimumBuyingQty)
  }
  return boxToBuy
}
