import moment from 'moment'
import { posTotal } from './total'
import { getCashierTrans, getConsignment, getItem, getDomainBE, getDomainBEAlt, getPortBE, getProtocolBE, removeItemKey, setCashierTrans, getBundleTrans, setBundleTrans, setConsignment } from './lstorage'

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
    showAsDiscount: item.showAsDiscount,
    memberPendingPayment: item.memberPendingPayment,
    gender: item.gender,
    isBirthday: item.birthDate ? moment(item.birthDate, 'YYYY-MM-DD').month() === moment().month() : false,
    phone: item.mobileNumber === '' ? item.phoneNumber : item.mobileNumber
  }
}

const getAPIURL = () => {
  const BEURL = getDomainBE()
  const BEPORT = getPortBE()
  let APIHOST
  if (!BEURL.match(/^[0-9a-z.-]+$/)) {
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
  let APICOMPANYPROTOCOL = getProtocolBE()
  const APIURL = `${APICOMPANYPROTOCOL}://${APIHOST}:${APIPORT}`
  return APIURL
}

const getAPIURLAlt = () => {
  const BEURL = getDomainBEAlt()
  const BEPORT = getPortBE()
  let APIHOST
  if (!BEURL.match(/^[0-9a-z.-]+$/)) {
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
  let APICOMPANYPROTOCOL = getProtocolBE()
  const APIURL = `${APICOMPANYPROTOCOL}://${APIHOST}:${APIPORT}`
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
    showAsDiscount: item.showAsDiscount,
    memberPendingPayment: item.memberPendingPayment,
    gender: item.gender,
    phone: item.mobileNumber === '' ? item.phoneNumber : item.mobileNumber
  }
}

const insertBundleTrans = async ({
  qty,
  item
}) => {
  item.inputTime = new Date().valueOf()
  const currentBundle = await getBundleTrans()
  let arrayProd = currentBundle
  const filteredBundle = currentBundle.filter(filtered => filtered.bundleId === item.id)
  if (filteredBundle && filteredBundle[0]) {
    arrayProd = currentBundle.map((data) => {
      if (data.no === filteredBundle[0].no) {
        return ({
          ...data,
          qty: parseFloat(data.qty) + qty
        })
      }
      return data
    })
  } else {
    arrayProd.push({
      no: (arrayProd || []).length + 1,
      rewardCategory: item.rewardCategory || [],
      applyMultiple: item.applyMultiple,
      bundleId: item.id,
      categoryCode: item.categoryCode,
      type: item.type,
      code: item.code,
      name: item.name,
      inputTime: new Date().valueOf(),
      minimumPayment: item.minimumPayment,
      paymentOption: item.paymentOption,
      paymentBankId: item.paymentBankId,
      alwaysOn: item.alwaysOn,
      haveTargetPrice: item.haveTargetPrice,
      targetRetailPrice: item.targetRetailPrice,
      targetCostPrice: item.targetCostPrice,
      startDate: item.startDate,
      memberOnly: item.memberOnly,
      memberOnlyApplyMultiple: item.memberOnlyApplyMultiple,
      hasStoreAllocation: item.hasStoreAllocation,
      endDate: item.endDate,
      startHour: item.startHour,
      endHour: item.endHour,
      buildComponent: item.buildComponent,
      availableDate: item.availableDate,
      qty
    })
  }

  console.log('arrayProd', currentBundle, arrayProd)

  await setBundleTrans(JSON.stringify(arrayProd))
  return arrayProd
}

const insertCashierTrans = (dataObject) => {
  let previousData = getCashierTrans()
  dataObject.sellingPrice = dataObject.price
  const total = posTotal(dataObject)

  // eslint-disable-next-line eqeqeq
  const filter = previousData && previousData.filter(filtered => filtered.code == dataObject.code && filtered.bundleId == dataObject.bundleId)

  let newData = []

  if (filter && filter[0]) {
    newData = previousData.map((item) => {
      // eslint-disable-next-line eqeqeq
      if (item.code == filter[0].code && item.bundleId == filter[0].bundleId && item.categoryCode == filter[0].categoryCode) {
        item.qty += dataObject.qty
        item.sellingPrice = dataObject.price
        item.inputTime = new Date().valueOf()
        item.total = posTotal(item)
        return item
      }
      return item
    })
  } else {
    newData = previousData
    newData.push({
      no: dataObject.no,
      bundleId: dataObject.bundleId,
      bundleCode: dataObject.bundleCode,
      bundleName: dataObject.bundleName,
      employeeId: dataObject.employeeId,
      employeeName: dataObject.employeeName,
      productId: dataObject.productId,
      categoryCode: dataObject.categoryCode,
      code: dataObject.code,
      name: dataObject.name,
      probBundleId: dataObject.probBundleId,
      probBundleCode: dataObject.probBundleCode,
      probBundleName: dataObject.probBundleName,
      probBundleTargetQty: dataObject.probBundleTargetQty,
      probFinalPrice: dataObject.probFinalPrice,
      probBundle: dataObject.probBundle,
      qty: dataObject.qty,
      typeCode: dataObject.typeCode,
      sellPrice: dataObject.sellPrice,
      hide: dataObject.hide,
      replaceable: dataObject.replaceable,
      oldValue: dataObject.oldValue,
      newValue: dataObject.newValue,
      inputTime: new Date().valueOf(),
      retailPrice: dataObject.retailPrice,
      distPrice01: dataObject.distPrice01,
      distPrice02: dataObject.distPrice02,
      distPrice03: dataObject.distPrice03,
      distPrice04: dataObject.distPrice04,
      distPrice05: dataObject.distPrice05,
      distPrice06: dataObject.distPrice06,
      distPrice07: dataObject.distPrice07,
      distPrice08: dataObject.distPrice08,
      distPrice09: dataObject.distPrice09,
      price: dataObject.price,
      discount: dataObject.discount,
      disc1: dataObject.disc1,
      disc2: dataObject.disc2,
      disc3: dataObject.disc3,
      total
    })
  }

  setCashierTrans(JSON.stringify(newData))

  return newData
}

const insertConsignment = (dataObject) => {
  const previousData = getConsignment()
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
    stock: dataObject.stock,
    otherSellPrice: dataObject.otherSellPrice,
    martSellPrice: dataObject.martSellPrice,
    commissionGrab: dataObject.commissionGrab,
    originalSellPrice: dataObject.originalSellPrice,
    inputTime: new Date().valueOf(),
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
  setConsignment(JSON.stringify(previousData))

  return previousData
}

module.exports = {
  reArrangeMember,
  reArrangeMemberId,
  insertBundleTrans,
  insertCashierTrans,
  insertConsignment,
  getSetting,
  getPermission,
  getAPIURL,
  getAPIURLAlt
}
