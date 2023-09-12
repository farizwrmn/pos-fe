import { request, config, crypt } from '../../utils'

const { requestCancelPos } = config.api

export async function queryAdd (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: requestCancelPos,
    data: params,
    method: 'post',
    headers: apiHeaderToken
  })
}

export async function queryPending (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${requestCancelPos}/pending`,
    data: params,
    method: 'get',
    headers: apiHeaderToken
  })
}
