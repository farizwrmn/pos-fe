const chooseOnePaymentType = (type = 'C', list = []) => {
  if (!type) return 'Cash'
  if (!list) return 'Cash'
  const selected = list.filter(item => item.typeCode === type)
  if (selected && selected.length > 0 && selected[0]) {
    return selected[0].typeName
  }
  return 'Cash'
}

const group = (data, key, secondaryKey) => {
  return _.reduce(data, (group, item) => {
    (group[`${item[secondaryKey]} - ${item[key]}`] = group[`${item[secondaryKey]} - ${item[key]}`] || []).push(item)
    return group
  }, [])
}

const groupProduct = (list, dataBundle = []) => {
  const listGroup = group(list, 'bundlingCode', 'bundlingName')
  let newList = []
  for (let key in listGroup) {
    const price = listGroup[key].reduce((prev, next) => prev + next.total, 0)
    // eslint-disable-next-line no-loop-func
    const filteredBundle = dataBundle && dataBundle[0] ? dataBundle.filter(filtered => filtered.bundlingId === listGroup[key][0].bundlingId) : []
    newList.push({
      key,
      detail: listGroup[key],
      price,
      qty: filteredBundle && filteredBundle[0] ? filteredBundle[0].qty : 1,
      total: price
    })
  }
  return newList
}

export {
  chooseOnePaymentType,
  groupProduct
}
