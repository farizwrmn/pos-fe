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

export async function queryNotReconciled (params) {
  const apiHeaderToken = crypt.apiheader()
  if (!params.transId) {
    return
  }
  return request({
    url: `${paymentXenditTransactionImportDetail}/not-reconciled/${params.transId}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
