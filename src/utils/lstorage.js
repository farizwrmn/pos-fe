/**
 * Created by boo on 12/22/17.
 */
import moment from 'moment'
import { prefix } from './config.main'
import { encrypt, decrypt } from './crypt'

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
  return localStorage.getItem('disPrece') ? JSON.parse(localStorage.getItem('disPrece')) : []
}

const setPriceName = (priceList) => {
  return localStorage.getItem('disPrece', JSON.stringify(priceList || '[]'))
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
  localStorage.removeItem('consignment')
  localStorage.removeItem('member')
  localStorage.removeItem('mechanic')
  localStorage.removeItem('memberUnit')
  localStorage.removeItem('lastMeter')
  localStorage.removeItem('woNumber')
  localStorage.removeItem('bundle_promo')
  localStorage.removeItem('workorder')
}

const removeAllKey = () => {
  // to clear all local storage
  localStorage.clear()
}

// get value
// role
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
  getIdBE,
  getCashierTrans,
  getConsignment,
  getServiceTrans,
  getBundleTrans,
  setItem,
  getItem,
  getPriceName,
  setPriceName
}
