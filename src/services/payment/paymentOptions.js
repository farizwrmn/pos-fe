import { request, config, crypt } from 'utils'

const { paymentOpts } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentOpts}/option`,
    method: 'get',
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentOpts}/option`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
