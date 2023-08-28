import { request, config, crypt } from '../../utils'

const { paymentXenditBalanceImport } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: paymentXenditBalanceImport,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
