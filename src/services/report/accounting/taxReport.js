import { request, crypt } from 'utils'

export async function queryTaxReport (params = {}) {
  // eslint-disable-next-line eqeqeq
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/report/accounting/tax-report',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
