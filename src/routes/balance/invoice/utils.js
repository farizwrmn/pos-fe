import reduce from 'lodash/reduce'
import { BALANCE_TYPE_TRANSACTION, BALANCE_TYPE_CLOSING } from 'utils/variable'

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
  return reduce(data, (group, item) => {
    (group[`${item[secondaryKey]} - ${item[key]}`] = group[`${item[secondaryKey]} - ${item[key]}`] || []).push(item)
    return group
  }, [])
}

const groupProduct = (list, dataBundle = []) => {
  const listGroup = group(list, 'bundlingCode', 'bundlingName')
  let newList = []
  for (let key in listGroup) {
    const price = listGroup[key] ? listGroup[key].reduce((prev, next) => prev + next.total, 0) : []
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

const calculateBalance = (data, paymentOptionCashId) => {
  let pos = null
  let input = null
  // Iterate through the array of objects using Array.prototype.find
  // const PAYMENT_OPTION_CASH = 1
  data.forEach((obj) => {
    // validate only Cash payment option
    if (obj.paymentOptionId === paymentOptionCashId) {
      if (obj.balanceType === BALANCE_TYPE_TRANSACTION) {
        pos += obj.balanceIn
      } else if (obj.balanceType === BALANCE_TYPE_CLOSING) {
        input += obj.balanceIn
      }
    } else {
      return 'Error: Only Cash payment option available to count..'
    }
  })

  // Check if either pos or input is null using short-circuit evaluation
  if (pos === null || input === null) {
    return 'Error: Amount cannot be 0. Can not submit.'
  }

  // Return the maximum of input and pos using Math.max directly
  return Math.max(input, pos)
}

export {
  calculateBalance,
  chooseOnePaymentType,
  groupProduct
}
