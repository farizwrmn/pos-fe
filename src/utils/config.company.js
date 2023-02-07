/* eslint-disable no-constant-condition */
const production = process.env.NODE_ENV === 'production'
const APPNAME = production ? (process.env.APP_NAME || 'k3mart') : 'k3mart' // 'localhost'
const APICOMPANYPROTOCOL = production ? 'https' : 'http' // 'localhost'
const MAIN_WEBSITE = production ? (process.env.MAIN_WEBSITE || 'k3mart.id') : 'k3mart.id'
const APICOMPANYHOST = production ? (process.env.API_ENDPOINT || 'pos.k3mart.id') : 'localhost' // 'localhost'
const COUCH_NAME = production ? (process.env.CLOUDANT_NAME || 'k3mart') : 'k3mart' // 'localhost'
const COUCH_URL = production ? (process.env.CLOUDANT_URL || 'http://k3mart:123456@localhost:5984/k3mart') : 'http://k3mart:123456@localhost:5984/k3mart' // 'localhost'
const APICOMPANYPORT = production ? 443 : 6402
const APIVERSION = production ? '/api/v1' : '/api/v1'
const APICOMPANYURL = `${APICOMPANYPROTOCOL}://${APICOMPANYHOST}:${APICOMPANYPORT}${APIVERSION}`
const APISOCKET = `${APICOMPANYPROTOCOL}://${APICOMPANYHOST}:${APICOMPANYPORT}`

const APICONSIGNMENTPROTOCOL = production ? 'https' : 'http' // 'localhost'
const APICONSIGNMENTHOST = production ? (process.env.API_CONSIGNMENT_ENDPOINT || 'consignment-api.k3mart.id') : 'localhost' // 'localhost'
const APICONSIGNMENTPORT = production ? 443 : 6503
const APICONSIGNMENTVERSION = production ? '/api/v1' : ''
const APICONSIGNMENTURL = `${APICONSIGNMENTPROTOCOL}://${APICONSIGNMENTHOST}:${APICONSIGNMENTPORT}${APICONSIGNMENTVERSION}`

const IMAGEURL = true ? 'https://graph.k3mart.id/image' : 'http://localhost:3100'
const S3URL = true ? 'https://graph.k3mart.id/s3' : 'http://localhost:3100'
const IMAGECONSIGNMENTURL = true ? 'https://consignment.k3mart.id/images/payment_proof' : 'http://localhost:3100'
const APIIMAGECOMPANYPROTOCOL = true ? 'https' : 'http' // 'localhost'
const APIIMAGECOMPANYHOST = true ? ('graph.k3mart.id') : 'localhost' // 'localhost'
const APIIMAGEPROTOCOL = APIIMAGECOMPANYPROTOCOL
const APIIMAGEHOST = APIIMAGECOMPANYHOST
const APIIMAGEPORT = true ? 443 : 4000
const APIIMAGEVERSION = true ? '/api/image' : ''
const APIIMAGEURL = `${APIIMAGEPROTOCOL}://${APIIMAGEHOST}:${APIIMAGEPORT}${APIIMAGEVERSION}`

module.exports = {
  idCompany: 'SMI',
  companyName: 'Smartech Indo',
  APISOCKET,
  IMAGEURL,
  S3URL,
  IMAGECONSIGNMENTURL,
  MAIN_WEBSITE,
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
    apiConsignmentURL: APICONSIGNMENTURL,
    apiUserCompany: `${APICOMPANYURL}/users/company`
  }
}
