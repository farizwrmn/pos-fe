import { request, crypt } from 'utils'

export async function generalLedger (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = '/tax-report-accounting/general-ledger'
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function trialBalance (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = '/tax-report-accounting/trial-balance'
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
