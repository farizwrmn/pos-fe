/**
 * Created by Veirry on 22/09/2017.
 */
import { request, config, crypt, lstorage } from '../utils'

const { period } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = period
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryLastCode () {
  const apiHeaderToken = crypt.apiheader()
  const url = `${period}/code/last`
  return request({
    url,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryLastActive () {
  const apiHeaderToken = crypt.apiheader()
  const params = { storeId: lstorage.getCurrentUserStore() }
  const url = `${period}/code/last/active`
  return request({
    url,
    method: 'get',
    data: params,
    alt: true,
    headers: apiHeaderToken
  })
}

export async function queryCode (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${period}/${encodeURIComponent(params.id)}`
  return request({
    url,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function create (params) {
  const url = `${period}/${encodeURIComponent(params.id)}`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'post',
    data: JSON.stringify(params),
    body: JSON.stringify(params),
    headers: apiHeaderToken
  })
}

export async function update (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${period}/${encodeURIComponent(params.id)}`
  return request({
    url,
    method: 'put',
    data: JSON.stringify(params),
    body: JSON.stringify(params),
    headers: apiHeaderToken
  })
}
