import { request, config, crypt } from '../../utils'

const { paymentXenditTransactionImportDetail } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: paymentXenditTransactionImportDetail,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
