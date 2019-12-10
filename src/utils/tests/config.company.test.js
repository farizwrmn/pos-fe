import { idCompany, companyName, rest } from '../config.company'

const APICOMPANYHOST = 'localhost' // 'localhost'
const APICOMPANYPORT = 6402
const APICOMPANYURL = `http://${APICOMPANYHOST}:${APICOMPANYPORT}`
const APIV1 = '/api/v1'

it('Should render API Id Company', () =>
  expect(idCompany).toEqual('SMI')
)

it('Should render API companyName', () =>
  expect(companyName).toEqual('Smartech Indo')
)

it('Should render API companyName', () =>
  expect(rest).toEqual({
    apiCompanyHost: APICOMPANYHOST,
    apiCompanyPort: APICOMPANYPORT,
    apiCompanyURL: APICOMPANYURL,
    apiCompanyURI: `${APICOMPANYURL}${APIV1}`,
    apiUserCompany: `${APICOMPANYURL}${APIV1}/users/company`
  })
)
