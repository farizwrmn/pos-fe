import { request, config, crypt } from 'utils'

const { paymentValidationImport } = config.api

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentValidationImport}`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function autoRecon (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentValidationImport}/auto-recon`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
