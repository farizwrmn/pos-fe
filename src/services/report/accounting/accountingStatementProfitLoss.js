import { request, crypt } from 'utils'

export async function queryMainTotal (params = {}) {
  // eslint-disable-next-line eqeqeq
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/report/accounting-statement/profit-loss-main',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryChildTotal (params = {}) {
  // eslint-disable-next-line eqeqeq
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/report/accounting-statement/profit-loss-child',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
