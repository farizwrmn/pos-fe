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

export async function queryAll (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentValidationConflict}/all`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryDetail (params) {
  const { id } = params
  if (!id) {
    return {
      success: false,
      message: 'Id required'
    }
  }
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentValidationConflict}/${id}`,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryAdd (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentValidationConflict}`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryResolve (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentValidationConflict}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
