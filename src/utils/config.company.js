const production = process.env.NODE_ENV === 'production'
const APPNAME = production ? (process.env.APP_NAME || 'k3mart') : 'k3mart' // 'localhost'
const APICOMPANYPROTOCOL = production ? 'https' : 'http' // 'localhost'
const APICOMPANYHOST = production ? (process.env.API_ENDPOINT || 'pos.k3mart.id') : 'localhost' // 'localhost'
const COUCH_NAME = production ? (process.env.CLOUDANT_NAME || 'k3mart') : 'k3mart' // 'localhost'
const COUCH_URL = production ? (process.env.CLOUDANT_URL || 'http://k3mart:123456@localhost:5984/k3mart') : 'http://k3mart:123456@localhost:5984/k3mart' // 'localhost'
const APICOMPANYPORT = production ? 443 : 6402
const APIVERSION = production ? '/api/v1' : '/api/v1'
const APICOMPANYURL = `${APICOMPANYPROTOCOL}://${APICOMPANYHOST}:${APICOMPANYPORT}${APIVERSION}`
const APISOCKET = `${APICOMPANYPROTOCOL}://${APICOMPANYHOST}:${APICOMPANYPORT}`

const IMAGEURL = production ? 'https://graph.k3mart.id/image' : 'http://localhost:3100'
const APIIMAGECOMPANYPROTOCOL = production ? 'https' : 'http' // 'localhost'
const APIIMAGECOMPANYHOST = production ? ('graph.k3mart.id') : 'localhost' // 'localhost'
const APIIMAGEPROTOCOL = APIIMAGECOMPANYPROTOCOL
const APIIMAGEHOST = APIIMAGECOMPANYHOST
const APIIMAGEPORT = production ? 443 : 4000
const APIIMAGEVERSION = production ? '/api/image' : ''
const APIIMAGEURL = `${APIIMAGEPROTOCOL}://${APIIMAGEHOST}:${APIIMAGEPORT}${APIIMAGEVERSION}`

module.exports = {
  idCompany: 'SMI',
  companyName: 'Smartech Indo',
  APISOCKET,
  IMAGEURL,
  APIIMAGEURL,
  couchdb: {
    COUCH_URL,
    COUCH_NAME
  },
  APPNAME,
  rest: {
    apiCompanyProtocol: APICOMPANYPROTOCOL,
    apiCompanyHost: APICOMPANYHOST,
    apiCompanyPort: APICOMPANYPORT,
    apiCompanyURL: APICOMPANYURL,
    apiCompanyURI: APICOMPANYURL,
    apiUserCompany: `${APICOMPANYURL}/users/company`
  }
}
