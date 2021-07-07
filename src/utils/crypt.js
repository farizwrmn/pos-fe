/**
 * Created by boo on 7/14/17.
 */
import { prefix } from './config.main'
import { apiHeader } from './config.rest'

const crypto = require('crypto')

const algorithm = 'aes-256-ctr'
const password = 'k3mart'

const encrypt = (text, rdmtxt) => {
  const cipher = crypto.createCipher(algorithm, (rdmtxt || '') + password)
  let crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

const decrypt = (text, rdmtxt) => {
  try {
    const decipher = crypto.createDecipher(algorithm, (rdmtxt || '') + password)
    let dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8')
    return dec
  } catch (err) {
    return null
  }
}

const apiheader = () => {
  const idToken = localStorage.getItem(`${prefix}iKen`)
  apiHeader.Authorization = `JWT ${idToken}`
  return apiHeader
}

const generateId = (length) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

module.exports = {
  encrypt,
  decrypt,
  apiheader,
  generateId
}
