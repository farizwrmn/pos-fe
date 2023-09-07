// test suit
import {
  encrypt,
  decrypt,
  apiheader
} from '../crypt'


const crypto = require('crypto')

const algorithm = 'aes-256-ctr'
const password = 'k3mart'

const encryptTest = (text, rdmtxt) => {
  const cipher = crypto.createCipher(algorithm, (rdmtxt || '') + password)
  let crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

const decryptTest = (text, rdmtxt) => {
  try {
    const decipher = crypto.createDecipher(algorithm, (rdmtxt || '') + password)
    let dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8')
    return dec
  } catch (err) {
    return null
  }
}

it('Should render encrypt test', () =>
  expect(encrypt('test')).toEqual(encryptTest('test'))
)

it('Should render decrypt test', () =>
  expect(decrypt('test')).toEqual(decryptTest('test'))
)

it('Should render decrypt error', () =>
  expect(decrypt()).toEqual(null)
)

it('Should render apiheader test', () =>
  expect(apiheader()).toEqual({
    Accept: 'application/json',
    Authorization: 'JWT null',
    'Content-Type': 'application/json'
  })
)
