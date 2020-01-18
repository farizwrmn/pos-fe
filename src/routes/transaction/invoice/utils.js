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
  return _.reduce(data, (group, item) => {
    (group[item[key]] = group[item[key]] || []).push(item)
    return group
  }, [])
}

const groupProduct = (list) => {
  return group(list, 'bundlingId')
}

export {
  chooseOnePaymentType,
  groupProduct
}
