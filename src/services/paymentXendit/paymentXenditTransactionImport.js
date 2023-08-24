import { request, config, crypt } from '../../utils'

const { paymentXenditTransactionImport } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: paymentXenditTransactionImport,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
