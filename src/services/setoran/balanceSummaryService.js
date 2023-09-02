import { request, config, crypt } from '../../utils'

const { balanceSummary } = config.api

export const query = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: balanceSummary,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export const queryBalance = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${balanceSummary}/balance`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export const queryClosedDetail = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${balanceSummary}/detail`,
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
