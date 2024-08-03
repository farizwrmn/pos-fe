import { request, config, crypt } from 'utils'

const { paymentOpts } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentOpts}/master/option`,
    alt: true,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentOpts}/master/option`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentOpts}/master/option/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentOpts}/master/option/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}

export const queryAvailablePaymentType = () => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentOpts}-option/available-params`,
    alt: true,
    method: 'get',
    headers: apiHeaderToken
  })
}
