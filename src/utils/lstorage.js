/**
 * Created by boo on 12/22/17.
 */
import { prefix } from './config'
import { encrypt, decrypt} from './crypt'

const putStorageKey = (key, value, norandom) => {
  let rdmText
  if (norandom) {
    rdmText = norandom
  } else {
    rdmText = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8)
  }
  const rdmTextcryp = encrypt(rdmText)
  let cryptedValue = ''
  for (let index of value) {
    cryptedValue += encrypt((index) ? index.toString() : '', rdmTextcryp) + '#'
  }
  localStorage.setItem(`${prefix}` + key, rdmText + '#' + cryptedValue.slice(0,-1))
}

const getStorageKey = (key) => {
  const localId = localStorage.getItem(`${prefix}` + key)
  let pair = []
  if (localId && localId.indexOf("#") > -1) {
    const localIds = localId.split("#")
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
  } else {
    pair[1] = decrypt(localStorage.getItem(`${prefix}` + key)) || ''
    pair[2] = pair[3] = '---'
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
// store
const getListUserStores = () => {
  const lsuTores = getStorageKey('utores')[1]
  let listUserStores
  if (lsuTores && lsuTores.length > 0) {
    listUserStores = JSON.parse(lsuTores)
  }
  return listUserStores
}
const getCurrentUserStore = () => { return parseInt(getStorageKey('udi')[3]) }
const getCurrentUserStoreName = () => {
  function valueStoreName(store) {
    if (store.value === this[0]) {
      return store;
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

module.exports = {
  putStorageKey,
  getStorageKey,
  removeAllKey,
  removeItemKey,
  getListUserRoles,
  getCurrentUserRole,
  getListUserStores,
  getCurrentUserStore,
  getCurrentUserStoreName,
}
