import reduce from 'lodash/reduce'

const chooseOnePaymentType = (type = 'C', list = []) => {
  if (!type) return 'Cash'
  if (!list) return 'Cash'
  const selected = list.filter(item => item.typeCode === type)
  if (selected && selected.length > 0 && selected[0]) {
    return selected[0].typeName
  }
  return 'Cash'
}

const group = (data, key) => {
  return reduce(data, (group, item) => {
    (group[`${item[key]}`] = group[`${item[key]}`] || []).push(item)
    return group
  }, [])
}

const groupProduct = (list, dataBundle = []) => {
  const listGroup = group(list.filter(filtered => filtered.bundleId), 'bundleCode')
  let newList = []
  for (let key in listGroup) {
    if (key === 'remove') {
      // eslint-disable-next-line no-continue
      continue
    }
    const price = listGroup[key].reduce((prev, next) => prev + next.total, 0)
    // eslint-disable-next-line no-loop-func
    const filteredBundle = dataBundle && dataBundle[0] ? dataBundle.filter(filtered => parseFloat(filtered.bundleId) === parseFloat(listGroup[key][0].bundleId)) : []
    newList.push({
      key,
      code: filteredBundle && filteredBundle[0] ? filteredBundle[0].code : key,
      name: filteredBundle && filteredBundle[0] ? filteredBundle[0].name : key,
      detail: listGroup[key],
      price,
      sellPrice: price,
      type: 'Bundle',
      inputTime: filteredBundle && filteredBundle[0] ? filteredBundle[0].inputTime : 0,
      qty: filteredBundle && filteredBundle[0] ? filteredBundle.reduce((prev, next) => prev + next.qty, 0) : 1,
      total: price
    })
  }
  return newList
}

export {
  chooseOnePaymentType,
  groupProduct
}
