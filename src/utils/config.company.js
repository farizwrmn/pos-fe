const production = process.env.NODE_ENV === 'production'
const APICOMPANYPROTOCOL = production ? 'https' : 'http' // 'localhost'
const APICOMPANYHOST = production ? (process.env.API_ENDPOINT || 'pos.k3mart.id') : 'localhost' // 'localhost'
const APICOMPANYPORT = production ? 443 : 6402
const APIVERSION = production ? '/api/v1' : '/api/v1'
const APICOMPANYURL = `${APICOMPANYPROTOCOL}://${APICOMPANYHOST}:${APICOMPANYPORT}${APIVERSION}`
const APISOCKET = `${APICOMPANYPROTOCOL}://${APICOMPANYHOST}:${APICOMPANYPORT}`

const IMAGEURL = production ? 'https://pos.k3mart.id/image' : 'http://localhost:3100'
const APIIMAGEPROTOCOL = APICOMPANYPROTOCOL
const APIIMAGEHOST = APICOMPANYHOST
const APIIMAGEPORT = production ? 443 : 4000
const APIIMAGEVERSION = production ? '/api/image' : ''
const APIIMAGEURL = `${APIIMAGEPROTOCOL}://${APIIMAGEHOST}:${APIIMAGEPORT}${APIIMAGEVERSION}`

module.exports = {
  idCompany: 'SMI',
  companyName: 'Smartech Indo',
  APISOCKET,
  IMAGEURL,
  APIIMAGEURL,
  rest: {
    apiCompanyProtocol: APICOMPANYPROTOCOL,
    apiCompanyHost: APICOMPANYHOST,
    apiCompanyPort: APICOMPANYPORT,
    apiCompanyURL: APICOMPANYURL,
    apiCompanyURI: APICOMPANYURL,
    apiUserCompany: `${APICOMPANYURL}/users/company`
  }
}
