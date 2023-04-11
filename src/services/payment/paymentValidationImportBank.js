import { request, config, crypt } from 'utils'

const { paymentValidationImportBank } = config.api

export const query = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentValidationImportBank}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export const edit = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentValidationImportBank}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}

export const add = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentValidationImportBank}`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
