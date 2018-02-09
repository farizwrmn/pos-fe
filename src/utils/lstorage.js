/**
 * Created by boo on 12/22/17.
 */
import moment from 'moment'
import { prefix } from './config'
import { encrypt, decrypt } from './crypt'

const putStorageKey = (key, value, norandom) => {
  // 'udi' { 1: userid, 2: role, 3: store, 4: usercompany, 5: userlogintime, 6: difftime_be-fe }
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
    cryptedValue += `${encrypt((index) ? index.toString() : '', rdmTextcryp)}#`
    if (key === 'udi' && counter === 5) {
      const diffDate = moment(new Date()).diff(moment(new Date(index)))
      cryptedValue += `${encrypt((diffDate) ? diffDate.toString() : '', rdmTextcryp)}#`
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
    pair[6] = decrypt(localIds[6], rdmText) || ''
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

// remove item or all
const removeItemKey = () => {
  localStorage.removeItem(`${prefix}iKen`)
  localStorage.removeItem(`${prefix}udi`)
  localStorage.removeItem(`${prefix}uelor`)
  localStorage.removeItem(`${prefix}utores`)
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
const getLoginTime = () => { return getStorageKey('udi')[5] }
const getLoginTimeDiff = () => { return getStorageKey('udi')[6] }
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

module.exports = {
  putStorageKey,
  getStorageKey,
  removeAllKey,
  removeItemKey,
  getListUserRoles,
  getCurrentUserRole,
  getCompanyName,
  getLoginTime,
  getLoginTimeDiff,
  getListUserStores,
  getCurrentUserStore,
  getCurrentUserStoreName,
  getCurrentUserStoreCode,
  getCurrentUserStoreDetail
}
