import classnames from 'classnames'
import cloneDeep from 'lodash/cloneDeep'
import { message } from 'antd'
import moment from 'moment'
import configCompany from './config.company'
import config from './config.rest'
import request from './request'
import { color } from './theme'
import crypt from './crypt'
import lstorage from './lstorage'
import calendar from './calendar'
import ip from './ip'
import numberFormat from './numberFormat'
import compare from './compare'
import variables from './variables'
import total from './total'
import alertModal from './alertModal'

const { posTotal, posDiscount, selisihMember, formatNumbering } = total
// 连字符转驼峰 - hyphenToHump
String.prototype.hyphenToHump = function () {
  return this.replace(/-(\w)/g, (...args) => {
    return args[1].toUpperCase()
  })
}

// 驼峰转连字符 - humpToHyphen
String.prototype.humpToHyphen = function () {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 日期格式化 - Date formatting
Date.prototype.format = function (format) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds()
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length))
    }
  }
  return format
}


/**
 * @param   {String}
 * @return  {String}
 */

const queryURL = (name) => {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r !== null) return decodeURI(r[2])
  return null
}

/**
 * 数组内查询 - queryArray
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  const item = array.filter(_ => _[keyAlias] === key)
  if (item.length) {
    return item[0]
  }
  return null
}

/**
 * 数组格式转树状结构 - arrayToTree
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
  let data = cloneDeep(array)
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index]
  })

  data.forEach((item) => {
    let hashVP = hash[item[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}

const messageInfo = (info, type = 'info', duration = 3) => {
  switch (type) {
    case 'success':
      message.success(info, duration)
      break
    case 'warning':
      message.warning(info, duration)
      break
    default:
      message.info(info, duration)
  }
}

const formatDate = (text, format) => {
  if (text && format) return moment(text, format).format('DD-MMM-YYYY')
  if (text) return moment(text).format('DD-MMM-YYYY')
  if (text === null) return ''
  return moment().format('DD-MMM-YYYY')
}

const isEmptyObject = (obj) => {
  if (!obj) {
    return true
  }
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

function isElectron () {
  // Renderer process
  if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
    console.log('electron 1')
    return true
  }

  // Main process
  if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
    console.log('electron 2')
    return true
  }

  // Detect the user agent when the `nodeIntegration` option is set to true
  if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
    console.log('electron 3')
    return true
  }

  return false
}

module.exports = {
  isElectron,
  configCompany,
  config,
  request,
  color,
  classnames,
  queryURL,
  queryArray,
  arrayToTree,
  crypt,
  lstorage,
  ip,
  messageInfo,
  formatDate,
  isEmptyObject,
  numberFormat,
  posTotal,
  posDiscount,
  selisihMember,
  formatNumbering,
  calendar,
  compare,
  variables,
  total,
  alertModal
}
