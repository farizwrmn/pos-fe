const compareExistsById = (listSource, resultList) => {
  let currentExists
  for (let n = 0; n < (resultList || []).length; n += 1) {
    currentExists = listSource.filter(x => x.productId === resultList[n].productId)
    if ((currentExists || []).length > 0) {
      return {
        status: true,
        data: resultList[n]
      }
    }
  }
  return {
    status: false
  }
}

const compareBundleExists = (listSource, resultList) => {
  let currentExists = []
  currentExists = listSource.filter(x => x.bundleId === resultList.id)
  // Jika Pernah ada
  if ((currentExists || []).length > 0) {
    return {
      status: true,
      data: currentExists
    }
  }

  // Jika Belum pernah ada
  return {
    status: false,
    data: currentExists
  }
}

const compareBundleItemExists = (listSource, resultList) => {
  let currentExists = []
  for (let n = 0; n < (resultList || []).length; n += 1) {
    currentExists = listSource.filter(x => x.bundleId === resultList[n].bundleId && x.productId === resultList[n].productId)
    if ((currentExists || []).length > 0) {
      return {
        status: true,
        data: resultList
      }
    }
  }
  return {
    status: false
  }
}

module.exports = {
  compareExistsById,
  compareBundleExists,
  compareBundleItemExists
}
