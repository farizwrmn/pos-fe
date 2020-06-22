import { request, crypt } from 'utils'

export async function generalLedger (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = '/report/accounting/general-ledger'
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
