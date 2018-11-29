import { posTotal } from './total'
import { getCashierTrans, getItem, getDomainBE, getPortBE, removeItemKey } from './lstorage'

const reArrangeMember = (item) => {
  return {
    memberCode: item.memberCode,
    memberName: item.memberName,
    address01: item.address01,
    cashback: item.cashback ? item.cashback : 0,
    id: item.id,
    memberTypeName: item.memberTypeName,
    memberTypeId: item.memberTypeId,
    memberSellPrice: item.memberSellPrice,
    memberPendingPayment: item.memberPendingPayment,
    gender: item.gender,
    phone: item.mobileNumber === '' ? item.phoneNumber : item.mobileNumber
  }
}

const getAPIURL = () => {
  const BEURL = getDomainBE()
  const BEPORT = getPortBE()
  let APIHOST
  if (!BEURL.match(/^[0-9a-z.]+$/)) {
    removeItemKey('cdi')
    APIHOST = 'localhost'
  } else {
    APIHOST = BEURL
  }
  let APIPORT
  if (!BEPORT.match(/^[0-9a-z]+$/)) {
    APIPORT = 5557
  } else {
    APIPORT = BEPORT
  }
  const APIURL = `http://${APIHOST}:${APIPORT}`
  return APIURL
}

const getSettingLocal = () => getItem('setting')

const getSetting = key => getSettingLocal()[key]

const getPermissionLocal = () => getItem('permission')

const getPermission = key => getPermissionLocal()[key]

const reArrangeMemberId = (item) => {
  return {
    memberCode: item.memberCode,
    memberName: item.memberName,
    address01: item.address01,
    cashback: item.cashback ? item.cashback : 0,
    id: item.memberId,
    memberTypeName: item.memberTypeName,
    memberTypeId: item.memberTypeId,
    memberSellPrice: item.memberSellPrice,
    memberPendingPayment: item.memberPendingPayment,
    gender: item.gender,
    phone: item.mobileNumber === '' ? item.phoneNumber : item.mobileNumber
  }
}

const insertCashierTrans = (dataObject) => {
  const previousData = getCashierTrans()
  dataObject.sellingPrice = dataObject.price
  const total = posTotal(dataObject)

  previousData.push({
    no: dataObject.no,
    bundleId: dataObject.bundleId,
    employeeId: dataObject.employeeId,
    employeeName: dataObject.employeeName,
    productId: dataObject.productId,
    code: dataObject.code,
    name: dataObject.name,
    qty: dataObject.qty,
    typeCode: dataObject.typeCode,
    sellPrice: dataObject.sellPrice,
    price: dataObject.price,
    discount: dataObject.discount,
    disc1: dataObject.disc1,
    disc2: dataObject.disc2,
    disc3: dataObject.disc3,
    total
  })
  localStorage.setItem('cashier_trans', JSON.stringify(previousData))

  return previousData
}

module.exports = {
  reArrangeMember,
  reArrangeMemberId,
  insertCashierTrans,
  getSetting,
  getPermission,
  getAPIURL
}
