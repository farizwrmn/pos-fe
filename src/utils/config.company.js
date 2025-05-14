/* eslint-disable no-constant-condition */
const production = process.env.NODE_ENV === 'production'
const APPVERSION = 'index-20241205'
const APPNAME = production ? (process.env.APP_NAME || 'k3mart') : 'k3mart'
const APICOMPANYPROTOCOL = production ? 'https' : 'http'
const MAIN_WEBSITE = production ? (process.env.MAIN_WEBSITE || 'k3mart.id') : 'k3mart.id'
const APICOMPANYHOST = production ? (process.env.API_ENDPOINT || 'pos.k3mart.id') : 'localhost'
const APIELECTRON = production ? (process.env.API_ELECTRON_ENDPOINT || 'electron.k3mart.id') : 'http://localhost:3300'
const APICOMPANYHOSTALT = production ? (process.env.API_ENDPOINT_ALT || 'api-pos.k3mart.id') : 'localhost'
const APICOMPANYPORT = production ? 443 : 6402
const APIVERSION = production ? '/api/v1' : '/api/v1'
const APICOMPANYURL = `${APICOMPANYPROTOCOL}://${APICOMPANYHOST}:${APICOMPANYPORT}${APIVERSION}`
const APISOCKET = `${APICOMPANYPROTOCOL}://${APICOMPANYHOST}:${APICOMPANYPORT}`
const APISOCKETALT = `${APICOMPANYPROTOCOL}://${APICOMPANYHOSTALT}:${APICOMPANYPORT}`

const APICONSIGNMENTPROTOCOL = production ? 'https' : 'http'
const APICONSIGNMENTHOST = production ? (process.env.API_CONSIGNMENT_ENDPOINT || 'consignment-api.k3mart.id') : 'localhost'
const APICONSIGNMENTPORT = production ? 443 : 3120
const APICONSIGNMENTVERSION = production ? '/api/v1' : ''
const APICONSIGNMENTURL = `${APICONSIGNMENTPROTOCOL}://${APICONSIGNMENTHOST}:${APICONSIGNMENTPORT}${APICONSIGNMENTVERSION}`
const CONSIGNMENTIMAGEURL = true ? 'https://consignment.k3mart.id/images/products' : '-'

const IMAGEURL = true ? 'https://graph.k3mart.id/image' : 'http://localhost:3100'
const S3URL = true ? 'https://graph.k3mart.id/s3' : 'http://localhost:3100'
const IMAGECONSIGNMENTURL = true ? 'https://consignment.k3mart.id/images/payment_proof' : 'http://localhost:3100'
const APIIMAGECOMPANYPROTOCOL = true ? 'https' : 'http'
const APIIMAGECOMPANYHOST = true ? ('graph.k3mart.id') : 'localhost'
const APIIMAGEPROTOCOL = APIIMAGECOMPANYPROTOCOL
const APIIMAGEHOST = APIIMAGECOMPANYHOST
const APIIMAGEPORT = true ? 443 : 4000
const APIIMAGEVERSION = true ? '/api/image' : ''
const APIIMAGEURL = `${APIIMAGEPROTOCOL}://${APIIMAGEHOST}:${APIIMAGEPORT}${APIIMAGEVERSION}`

module.exports = {
  idCompany: 'SMI',
  companyName: 'K3MART',
  APISOCKET,
  APISOCKETALT,
  APIELECTRON,
  IMAGEURL,
  S3URL,
  IMAGECONSIGNMENTURL,
  CONSIGNMENTIMAGEURL,
  MAIN_WEBSITE,
  APIIMAGEURL,
  APPNAME,
  APPVERSION,
  rest: {
    apiCompanyProtocol: APICOMPANYPROTOCOL,
    apiCompanyHostAlt: APICOMPANYHOSTALT,
    apiCompanyHost: APICOMPANYHOST,
    apiCompanyPort: APICOMPANYPORT,
    apiCompanyURL: APICOMPANYURL,
    apiCompanyURI: APICOMPANYURL,
    apiConsignmentURL: APICONSIGNMENTURL,
    apiUserCompany: `${APICOMPANYURL}/users/company`
  }
}
