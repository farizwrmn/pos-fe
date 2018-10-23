import { request, config, crypt } from '../../utils'

const { apiReportCashback } = config.rest

export async function queryReportCashback (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = apiReportCashback
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryReportCashbackTotal (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = apiReportCashback
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
