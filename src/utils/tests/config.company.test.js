import { idCompany, companyName, rest } from '../config.company'

const APICOMPANYPROTOCOL = 'http' // 'localhost'
const APICOMPANYHOST = 'localhost' // 'localhost'
const APICOMPANYPORT = 6402
const APIVERSION = '/api/v1'
const APICOMPANYURL = `http://${APICOMPANYHOST}:${APICOMPANYPORT}${APIVERSION}`

it('Should render API Id Company', () =>
  expect(idCompany).toEqual('SMI')
)

it('Should render API companyName', () =>
  expect(companyName).toEqual('Smartech Indo')
)

it('Should render API companyName', () =>
  expect(rest).toEqual({
    apiCompanyHost: APICOMPANYHOST,
    apiCompanyProtocol: APICOMPANYPROTOCOL,
    apiCompanyPort: APICOMPANYPORT,
    apiCompanyURL: APICOMPANYURL,
    apiCompanyURI: APICOMPANYURL,
    apiUserCompany: `${APICOMPANYURL}/users/company`
  })
)
