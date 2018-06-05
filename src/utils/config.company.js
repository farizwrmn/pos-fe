const APICOMPANYHOST = 'localhost' //'demopos.darkotech.id'
const APICOMPANYPORT = 6402
const APICOMPANYURL = `http://${APICOMPANYHOST}:${APICOMPANYPORT}`
const APIV1 = '/api/v1'

module.exports = {
  idCompany: 'DMI',
  companyName: 'Darkotech Mandiri Indonesia',
  rest: {
    apiCompanyHost: APICOMPANYHOST,
    apiCompanyPort: APICOMPANYPORT,
    apiCompanyURL: APICOMPANYURL,
    apiCompanyURI: `${APICOMPANYURL}${APIV1}`,
    apiUserCompany: `${APICOMPANYURL}${APIV1}/users/company`
  }
}
