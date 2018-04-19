const APICOMPANYHOST = 'pos.darkosuite.com'
const APICOMPANYPORT = 9091
const APICOMPANYURL = `http://${APICOMPANYHOST}:${APICOMPANYPORT}`
const APIV1 = '/api/v1'

module.exports = {
  idCompany: 'DMI',
  rest: {
    apiCompanyHost: APICOMPANYHOST,
    apiCompanyPort: APICOMPANYPORT,
    apiCompanyURL: APICOMPANYURL,
    apiCompanyURI: `${APICOMPANYURL}${APIV1}`,
    apiUserCompany: `${APICOMPANYURL}${APIV1}/users/company`
  }
}
