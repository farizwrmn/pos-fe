import { request, config, crypt } from 'utils'

const { paymentValidationConflict } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentValidationConflict}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
