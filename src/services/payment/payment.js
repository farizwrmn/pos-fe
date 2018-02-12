import { request, config, crypt } from 'utils'

const { paymentOpts } = config.api

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentOpts}`,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function addSome (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentOpts}/some`,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}
