const production = process.env.NODE_ENV === 'production'
const APICOMPANYHOST = production ? 'localhost' : 'localhost' // 'localhost'
const APICOMPANYPORT = production ? 6402 : 6402
const APICOMPANYURL = `http://${APICOMPANYHOST}:${APICOMPANYPORT}`
const APIV1 = '/api/v1'

module.exports = {
  idCompany: 'SMI',
  companyName: 'Smartech Indo',
  rest: {
    apiCompanyHost: APICOMPANYHOST,
    apiCompanyPort: APICOMPANYPORT,
    apiCompanyURL: APICOMPANYURL,
    apiCompanyURI: `${APICOMPANYURL}${APIV1}`,
    apiUserCompany: `${APICOMPANYURL}${APIV1}/users/company`
  }
}
