import { request, config, crypt } from '../../utils'

const { paymentXenditBalanceImportDetail } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: paymentXenditBalanceImportDetail,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
