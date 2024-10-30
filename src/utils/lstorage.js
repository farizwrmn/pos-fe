/**
 * Created by boo on 12/22/17.
 */
import moment from 'moment'
import { prefix } from './config.main'
import { encrypt, decrypt } from './crypt'
import { TYPE_PEMBELIAN_UMUM } from './variable'

const putStorageKey = (key, value, norandom) => {
  // 'udi' { 1: userid, 2: role, 3: store, 4: usercompany, 5: userlogintime, 6: difftime_be-fe, 7: sessionid }
  // [data.profile.userid, data.profile.role, data.profile.store, data.profile.usercompany, data.profile.userlogintime, data.profile.sessionaid]
  let rdmText
  let counter = 0
  if (norandom) {
    rdmText = norandom
  } else {
    rdmText = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8)
  }
  const rdmTextcryp = encrypt(rdmText)
  let cryptedValue = ''
  for (let index of value) {
    counter += 1
    // cryptedValue += encrypt((index) ? index.toString() : '', rdmTextcryp) + '#'
    if (key === 'udi') {
      if (counter === 5) {
        const diffDate = moment(new Date()).diff(moment(new Date(index)))
        cryptedValue += `${encrypt((diffDate) ? diffDate.toString() : '', rdmTextcryp)}#`
      } else if (counter === 6) {
        cryptedValue += index ? `${index.toString()}#` : ''
      } else {
        cryptedValue += `${encrypt((index) ? index.toString() : '', rdmTextcryp)}#`
      }
    } else {
      cryptedValue += `${encrypt((index) ? index.toString() : '', rdmTextcryp)}#`
    }
  }
  localStorage.setItem(`${prefix}${key}`, `${rdmText}#${cryptedValue.slice(0, -1)}`)
}

const getStorageKey = (key) => {
  const localId = localStorage.getItem(`${prefix}${key}`)
  let pair = []
  if (localId && localId.indexOf('#') > -1) {
    const localIds = localId.split('#')
    const rdmText = encrypt(localIds[0])
    pair[0] = localIds[0]
    switch (key) {
      case 'uelor':
        pair[1] = JSON.parse(decrypt(localIds[1], rdmText) || '')
        break
      default:
        pair[1] = decrypt(localIds[1], rdmText) || ''
    }
    pair[2] = decrypt(localIds[2], rdmText) || ''
    pair[3] = decrypt(localIds[3], rdmText) || ''
    pair[4] = decrypt(localIds[4], rdmText) || ''
    pair[5] = decrypt(localIds[5], rdmText) || ''
    pair[6] = localIds[6] || ''
    pair[7] = decrypt(localIds[7], rdmText) || ''
    pair[8] = decrypt(localIds[8], rdmText) || ''
  } else {
    pair[1] = decrypt(localStorage.getItem(`${prefix}${key}`)) || ''
    pair[2] = '---'
    pair[3] = '---'
    pair[4] = '---'
    pair[5] = '---'
    pair[6] = '---'
  }
  return pair
}

const setItem = (key, text) => localStorage.setItem(`${prefix}${key}`, encrypt(text, 'settingPOS'))
const getItem = key => (localStorage.getItem(`${prefix}${key}`) ? JSON.parse(decrypt(localStorage.getItem(`${prefix}${key}`), 'settingPOS')) : {})

const getCashierTrans = () => {
  return localStorage.getItem('cashier_trans') ? JSON.parse(localStorage.getItem('cashier_trans')) : []
}

const getPriceName = () => {
  return localStorage.getItem('disPrece2') ? JSON.parse(localStorage.getItem('disPrece2')) : []
}

const setPriceName = (priceList) => {
  return localStorage.setItem('disPrece2', JSON.stringify(priceList || '[]'))
}

const getPaymentShortcut = () => {
  return localStorage.getItem('payShortcut') ? JSON.parse(localStorage.getItem('payShortcut')) : []
}

const setPaymentShortcut = (priceList) => {
  return localStorage.setItem('payShortcut', JSON.stringify(priceList || '[]'))
}

const getPaymentShortcutSelected = () => {
  return localStorage.getItem('payShortcutSelected') ? JSON.parse(localStorage.getItem('payShortcutSelected')) : {}
}

const setPaymentShortcutSelected = (priceList) => {
  return localStorage.setItem('payShortcutSelected', JSON.stringify(priceList || '{}'))
}

const getGrabmartOrder = () => {
  return localStorage.getItem('grabmartOrder') ? JSON.parse(localStorage.getItem('grabmartOrder')) : {}
}

const setGrabmartOrder = (grabOrder) => {
  return localStorage.setItem('grabmartOrder', JSON.stringify(grabOrder || '{}'))
}

const getExpressOrder = () => {
  return localStorage.getItem('expressOrder') ? JSON.parse(localStorage.getItem('expressOrder')) : {}
}

const setExpressOrder = (grabOrder) => {
  return localStorage.setItem('expressOrder', JSON.stringify(grabOrder || '{}'))
}

const getConsignment = () => {
  return localStorage.getItem('consignment') ? JSON.parse(localStorage.getItem('consignment')) : []
}

const getServiceTrans = () => {
  return localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
}

const getBundleTrans = () => {
  return localStorage.getItem('bundle_promo') ? JSON.parse(localStorage.getItem('bundle_promo')) : []
}

const getVoucherList = () => {
  return localStorage.getItem('voucher_list') ? JSON.parse(localStorage.getItem('voucher_list')) : []
}

const setVoucherList = (data) => {
  return localStorage.setItem('voucher_list', data)
}

const getCachedSerialPort = () => {
  return localStorage.getItem('cachedSerialPort') ? JSON.parse(localStorage.getItem('cachedSerialPort')) : []
}

const setCachedSerialPort = (data) => {
  return localStorage.setItem('cachedSerialPort', data)
}

const getQrisImage = () => {
  return localStorage.getItem('qris_image') ? localStorage.getItem('qris_image') : null
}

const setQrisImage = (data) => {
  return localStorage.setItem('qris_image', data)
}

const getPosReference = () => {
  return localStorage.getItem('pos_reference') ? localStorage.getItem('pos_reference') : null
}

const setPosReference = (data) => {
  return localStorage.setItem('pos_reference', data)
}

const getDynamicQrisPosTransId = () => {
  return localStorage.getItem('dynamic_qris_pos_trans_id') ? localStorage.getItem('dynamic_qris_pos_trans_id') : null
}

const setDynamicQrisPosTransId = (data) => {
  return localStorage.setItem('dynamic_qris_pos_trans_id', data)
}


const getDynamicQrisPosTransNo = () => {
  return localStorage.getItem('dynamic_qris_pos_trans_no') ? localStorage.getItem('dynamic_qris_pos_trans_no') : null
}

const setDynamicQrisPosTransNo = (data) => {
  return localStorage.setItem('dynamic_qris_pos_trans_no', data)
}

const removeDynamicQrisPosTransNo = () => {
  return localStorage.removeItem('dynamic_qris_pos_trans_no')
}

const removeDynamicQrisPosTransId = () => {
  return localStorage.removeItem('dynamic_qris_pos_trans_id')
}

const getDynamicQrisTimeLimit = () => {
  return localStorage.getItem('dynamic_qris_time_limit') ? localStorage.getItem('dynamic_qris_time_limit') : null
}

const setDynamicQrisTimeLimit = (data) => {
  return localStorage.setItem('dynamic_qris_time_limit', data)
}

const removeDynamicQrisTimeLimit = () => {
  return localStorage.removeItem('dynamic_qris_time_limit')
}

const getDynamicQrisImage = () => {
  const stringJson = localStorage.getItem('paylabs_dynamic_qris_image')
  if (stringJson) {
    const json = JSON.parse(stringJson)
    const ttl = json.ttl
    const currentUnix = moment().valueOf()
    if (Number(ttl) > Number(currentUnix)) {
      return json.qrisImage || null
    }
  }
  localStorage.removeItem('paylabs_dynamic_qris_image')
  return null
}

const getDynamicQrisImageTTL = () => {
  const stringJson = localStorage.getItem('paylabs_dynamic_qris_image')
  if (stringJson) {
    try {
      const json = JSON.parse(stringJson)
      const ttl = json.ttl
      const currentTime = moment().valueOf()
      const resultMiliseconds = ttl - currentTime
      const resultSeconds = resultMiliseconds / 1000
      const resultMinutes = resultSeconds / 60
      return resultMinutes
    } catch (error) {
      console.log(`error getDynamicQrisImageTTL: ${error || 'Something went wrong'}`)
    }
  }
  return null
}

const setDynamicQrisImage = (data) => {
  const dynamicQrisImageTimeLimit = getDynamicQrisTimeLimit()
  const json = {
    qrisImage: data,
    ttl: moment().add(Number(dynamicQrisImageTimeLimit || 10), 'minutes').valueOf()
  }
  return localStorage.setItem('paylabs_dynamic_qris_image', JSON.stringify(json))
}

const removeDynamicQrisImage = () => {
  return localStorage.removeItem('paylabs_dynamic_qris_image')
}

const getQrisPaymentLastTransaction = () => {
  return localStorage.getItem('qris_latest_transaction') ? localStorage.getItem('qris_latest_transaction') : null
}

const setQrisPaymentLastTransaction = (data) => {
  return localStorage.setItem('qris_latest_transaction', data)
}

const removeQrisPaymentLastTransaction = () => {
  return localStorage.removeItem('qris_latest_transaction')
}

const getQrisMerchantTradeNo = () => {
  return localStorage.getItem('qris_merchant_trade_number') ? localStorage.getItem('qris_merchant_trade_number') : null
}

const setQrisMerchantTradeNo = (data) => {
  return localStorage.setItem('qris_merchant_trade_number', data)
}

const removeQrisMerchantTradeNo = () => {
  return localStorage.removeItem('qris_merchant_trade_number')
}

const getInvoiceTimeLimit = () => {
  return localStorage.getItem('invoice_time_limit') ? localStorage.getItem('invoice_time_limit') : null
}

const setInvoiceTimeLimit = (data) => {
  return localStorage.setItem('invoice_time_limit', data)
}

const removeInvoiceTimeLimit = () => {
  return localStorage.removeItem('invoice_time_limit')
}

const getQrisPaymentTimeLimit = () => {
  return localStorage.getItem('qris_payment_time_limit') ? localStorage.getItem('qris_payment_time_limit') : null
}

const setQrisPaymentTimeLimit = (data) => {
  return localStorage.setItem('qris_payment_time_limit', data)
}

const removeQrisPaymentTimeLimit = () => {
  return localStorage.removeItem('qris_payment_time_limit')
}

const getCurrentPaymentTransactionId = () => {
  return localStorage.getItem('current_payment_transaction_id') ? localStorage.getItem('current_payment_transaction_id') : null
}

const setCurrentPaymentTransactionId = (data) => {
  return localStorage.setItem('current_payment_transaction_id', data)
}

const removeCurrentPaymentTransactionId = () => {
  return localStorage.removeItem('current_payment_transaction_id')
}

const getCustomerViewLastTransactionTimeLimit = () => {
  return localStorage.getItem('customer_view_transaction_time_limit') ? localStorage.getItem('customer_view_transaction_time_limit') : null
}

const setCustomerViewLastTransactionTimeLimit = (data) => {
  return localStorage.setItem('customer_view_transaction_time_limit', data)
}

const removeCustomerViewLastTransactionTimeLimit = () => {
  return localStorage.removeItem('customer_view_transaction_time_limit')
}

const removeQrisImage = () => {
  return localStorage.removeItem('qris_image')
}

const setCashierTrans = (data) => {
  return localStorage.setItem('cashier_trans', data)
}

const setConsignment = (data) => {
  return localStorage.setItem('consignment', data)
}

const setServiceTrans = (data) => {
  return localStorage.setItem('service_detail', data)
}

const setBundleTrans = (data) => {
  return localStorage.setItem('bundle_promo', data)
}

const setEdc = (data) => {
  const ttl = moment().set({ hours: 23, minutes: 59, seconds: 59 }).valueOf()
  return localStorage.setItem('payment_edc', JSON.stringify({ data, ttl }))
}

const getEdc = () => {
  let cachedData = localStorage.getItem('payment_edc') ? JSON.parse(localStorage.getItem('payment_edc')) : null
  if (cachedData) {
    const { data, ttl } = cachedData
    let ttlTimestamp = Number(ttl)
    let currentTimeStamp = moment().valueOf()
    if (ttlTimestamp > currentTimeStamp) {
      return data
    }
    return null
  }
  return null
}

const setCost = (data) => {
  const ttl = moment().set({ hours: 23, minutes: 59, seconds: 59 }).valueOf()
  return localStorage.setItem('payment_cost', JSON.stringify({ data, ttl }))
}

const getCost = () => {
  let cachedData = localStorage.getItem('payment_cost') ? JSON.parse(localStorage.getItem('payment_cost')) : null
  if (cachedData) {
    const { data, ttl } = cachedData
    let ttlTimestamp = Number(ttl)
    let currentTimeStamp = moment().valueOf()
    if (ttlTimestamp > currentTimeStamp) {
      return data
    }
    return null
  }
  return null
}

const getAvailablePaymentType = () => {
  return localStorage.getItem('pos_available_payment_type') ? localStorage.getItem('pos_available_payment_type') : null
}

const setAvailablePaymentType = (data) => {
  return localStorage.setItem('pos_available_payment_type', data)
}

const removeAvailablePaymentType = () => {
  return localStorage.removeItem('pos_available_payment_type')
}

// remove item
const removeItemKey = (key) => {
  localStorage.removeItem(`${prefix}${key}`)
}
// remove items
const removeItemKeys = () => {
  localStorage.removeItem(`${prefix}iKen`)
  localStorage.removeItem(`${prefix}udi`)
  localStorage.removeItem(`${prefix}uelor`)
  localStorage.removeItem(`${prefix}utores`)
  localStorage.removeItem(`${prefix}cdi`)
  localStorage.removeItem(`${prefix}store`)
  localStorage.removeItem('sidebarColor')
  localStorage.removeItem('routeList')
  localStorage.removeItem('isInit')
  localStorage.removeItem('service_detail')
  localStorage.removeItem('cashier_trans')
  localStorage.removeItem('disPrece2')
  localStorage.removeItem('payShortcut')
  localStorage.removeItem('consignment')
  localStorage.removeItem('member')
  localStorage.removeItem('mechanic')
  localStorage.removeItem('memberUnit')
  localStorage.setItem('typePembelian', TYPE_PEMBELIAN_UMUM)
  localStorage.removeItem('lastMeter')
  localStorage.removeItem('woNumber')
  localStorage.removeItem('bundle_promo')
  localStorage.removeItem('workorder')
  localStorage.removeItem('payment_cost')
  localStorage.removeItem('payment_edc')
  localStorage.removeItem('paylabs_dynamic_qris_image')
  localStorage.removeItem('dynamic_qris_time_limit')
  localStorage.removeItem('qris_latest_transaction')
  localStorage.removeItem('qris_merchant_trade_number')
  localStorage.removeItem('invoice_time_limit')
  localStorage.removeItem('qris_payment_time_limit')
  localStorage.removeItem('customer_view_transaction_time_limit')
  localStorage.removeItem('dynamic_qris_pos_trans_id')
  localStorage.removeItem('pos_available_payment_type')
  localStorage.removeItem('current_payment_transaction_id')
}

const removeAllKey = () => {
  // to clear all local storage
  localStorage.clear()
}

// get value
// role
const getConsignmentId = () => { return getStorageKey('udi')[7] }
const getListUserRoles = () => { return getStorageKey('uelor')[1] }
const getCurrentUserRole = () => { return getStorageKey('udi')[2] }
// company
const getCompanyName = () => { return getStorageKey('udi')[4] }
// login time
const getLoginTimeDiff = () => { return getStorageKey('udi')[5] }
const getLoginTime = () => {
  return getStorageKey('udi')[5]
}
// session
const getSessionId = () => { return getStorageKey('udi')[6] }
// store
const getListUserStores = () => {
  const lsuTores = getStorageKey('utores')[1]
  let listUserStores
  if (lsuTores && lsuTores.length > 0) {
    listUserStores = JSON.parse(lsuTores)
  }
  return listUserStores
}
const getCurrentUserStore = () => { return parseInt(getStorageKey('udi')[3], 10) }
const getCurrentUserConsignment = () => { return getStorageKey('udi')[7] }
const getCurrentUserStoreName = () => {
  function valueStoreName (store) {
    if (store.value === this[0]) {
      return store
    }
  }
  const listUserStores = getListUserStores()
  const currentStore = getCurrentUserStore()
  let currentStoreName = ''
  if (listUserStores) {
    currentStoreName = listUserStores.find(valueStoreName, [currentStore])
    currentStoreName = currentStoreName ? currentStoreName.label : '>> No Store <<'
  }
  return currentStoreName
}
// current StoreCode 22/01/2017
const getCurrentUserStoreCode = () => {
  function valueStoreName (store) {
    if (store.value === this[0]) {
      return store
    }
  }
  const listUserStores = getListUserStores()
  const currentStore = getCurrentUserStore()
  let currentStoreName = ''
  if (listUserStores) {
    currentStoreName = listUserStores.find(valueStoreName, [currentStore])
    currentStoreName = currentStoreName ? currentStoreName.code : '>> No Store <<'
  }
  return currentStoreName
}

// current StoreCode 24/01/2017
const getCurrentUserStoreDetail = () => {
  function valueStoreName (store) {
    if (store.value === this[0]) {
      return store
    }
  }
  const listUserStores = getListUserStores()
  const currentStore = getCurrentUserStore()
  let currentStoreName = ''
  if (listUserStores) {
    currentStoreName = listUserStores.find(valueStoreName, [currentStore])
  }
  return currentStoreName
}

const getIdBE = () => { return getStorageKey('cdi')[1] }
const getDomainBE = () => { return getStorageKey('cdi')[2] }
const getPortBE = () => { return getStorageKey('cdi')[3] }
const getProtocolBE = () => { return getStorageKey('cdi')[4] }
const getDomainBEAlt = () => {
  if (!getStorageKey('cdi')[5]) {
    return getStorageKey('cdi')[2]
  }
  return getStorageKey('cdi')[5]
}

module.exports = {
  putStorageKey,
  getStorageKey,
  removeAllKey,
  removeItemKey,
  removeItemKeys,
  getListUserRoles,
  getCurrentUserRole,
  getCompanyName,
  getLoginTime,
  getLoginTimeDiff,
  getListUserStores,
  getCurrentUserStore,
  getCurrentUserConsignment,
  getCurrentUserStoreName,
  getCurrentUserStoreCode,
  getCurrentUserStoreDetail,
  getSessionId,
  getDomainBE,
  getPortBE,
  getProtocolBE,
  getDomainBEAlt,
  getIdBE,
  getCashierTrans,
  getConsignment,
  getServiceTrans,
  getBundleTrans,
  setCashierTrans,
  setConsignment,
  setServiceTrans,
  setBundleTrans,
  setItem,
  getItem,
  getPriceName,
  setPriceName,
  getPaymentShortcut,
  setPaymentShortcut,
  getPaymentShortcutSelected,
  setPaymentShortcutSelected,
  getQrisImage,
  setQrisImage,
  getDynamicQrisImage,
  setDynamicQrisImage,
  removeDynamicQrisImage,
  getDynamicQrisTimeLimit,
  setDynamicQrisTimeLimit,
  removeDynamicQrisTimeLimit,
  getQrisPaymentLastTransaction,
  setQrisPaymentLastTransaction,
  removeQrisPaymentLastTransaction,
  getDynamicQrisPosTransNo,
  setDynamicQrisPosTransNo,
  removeDynamicQrisPosTransNo,
  getVoucherList,
  setVoucherList,
  removeQrisImage,
  getPosReference,
  setPosReference,
  getConsignmentId,
  getGrabmartOrder,
  setGrabmartOrder,
  setEdc,
  getEdc,
  setCost,
  getCost,
  getQrisMerchantTradeNo,
  setQrisMerchantTradeNo,
  removeQrisMerchantTradeNo,
  getInvoiceTimeLimit,
  setInvoiceTimeLimit,
  removeInvoiceTimeLimit,
  getCustomerViewLastTransactionTimeLimit,
  setCustomerViewLastTransactionTimeLimit,
  removeCustomerViewLastTransactionTimeLimit,
  getQrisPaymentTimeLimit,
  setQrisPaymentTimeLimit,
  removeQrisPaymentTimeLimit,
  getDynamicQrisPosTransId,
  setDynamicQrisPosTransId,
  removeDynamicQrisPosTransId,
  getCurrentPaymentTransactionId,
  setCurrentPaymentTransactionId,
  removeCurrentPaymentTransactionId,
  getDynamicQrisImageTTL,
  getAvailablePaymentType,
  setAvailablePaymentType,
  removeAvailablePaymentType,
  getExpressOrder,
  setExpressOrder,
  getCachedSerialPort,
  setCachedSerialPort
}
