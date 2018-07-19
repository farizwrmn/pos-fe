import { request, config, crypt } from '../../utils'

const { apiPromo } = config.rest

export async function queryActiveCount (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiPromo}/count`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryActive (params) {
  const apiHeaderToken = crypt.apiheader()
  params.order = 'endDate,startDate'
  return request({
    url: `${apiPromo}/main`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryComing (params) {
  const apiHeaderToken = crypt.apiheader()
  params.order = '-createdAt,startDate,endDate'
  return request({
    url: `${apiPromo}/main`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
