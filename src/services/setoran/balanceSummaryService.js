import { request, config, crypt } from '../../utils'

const { balanceSummary } = config.api

export const queryClosedDetail = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: balanceSummary,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export const queryInvoice = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${balanceSummary}/invoice`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
