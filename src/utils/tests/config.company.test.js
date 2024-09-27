import { idCompany, companyName, rest } from '../config.company'

const APICOMPANYPROTOCOL = 'http'
const APICOMPANYHOST = 'localhost'
const APICOMPANYPORT = 6402
const APIVERSION = '/api/v1'
const APICOMPANYURL = `http://${APICOMPANYHOST}:${APICOMPANYPORT}${APIVERSION}`

const APICONSIGNMENTPROTOCOL = 'http'
const APICONSIGNMENTHOST = 'localhost'
const APICONSIGNMENTPORT = 3120
const APICONSIGNMENTVERSION = ''
const APICONSIGNMENTURL = `${APICONSIGNMENTPROTOCOL}://${APICONSIGNMENTHOST}:${APICONSIGNMENTPORT}${APICONSIGNMENTVERSION}`

it('Should render API Id Company', () =>
  expect(idCompany).toEqual('SMI')
)

it('Should render API companyName', () =>
  expect(companyName).toEqual('K3MART')
)

it('Should render API companyName', () =>
  expect(rest).toEqual({
    apiCompanyProtocol: APICOMPANYPROTOCOL,
    apiCompanyHostAlt: 'localhost',
    apiCompanyHost: APICOMPANYHOST,
    apiCompanyPort: APICOMPANYPORT,
    apiCompanyURL: APICOMPANYURL,
    apiCompanyURI: APICOMPANYURL,
    apiConsignmentURL: APICONSIGNMENTURL,
    apiUserCompany: `${APICOMPANYURL}/users/company`
  })
)
