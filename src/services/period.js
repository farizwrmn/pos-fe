/**
 * Created by Veirry on 22/09/2017.
 */
import { request, config, crypt } from '../utils'
const { period } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = period
  console.log(url)
  return request({
    url: url,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryLastCode () {
  const apiHeaderToken = crypt.apiheader()
  const url = `${period}/code/last`
  console.log(url)
  return request({
    url: url,
    method: 'get',
    headers: apiHeaderToken,
  })
}

export async function queryLastActive () {
  const apiHeaderToken = crypt.apiheader()
  const url = `${period}/code/last/active`
  console.log(url)
  return request({
    url: url,
    method: 'get',
    headers: apiHeaderToken,
  })
}

export async function queryCode (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${period}/${encodeURIComponent(params.id)}`
  console.log(url)
  return request({
    url: url,
    method: 'get',
    headers: apiHeaderToken,
  })
}

export async function create (params) {
  const url = `${period}/${encodeURIComponent(params.id)}`
  console.log(url)
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'post',
    data: JSON.stringify(params),
    body: JSON.stringify(params),
    headers: apiHeaderToken
  })
}

export async function update (params) {
  const url = `${period}/${encodeURIComponent(params.id)}`
  console.log(url)
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'put',
    data: JSON.stringify(params),
    body: JSON.stringify(params),
    headers: apiHeaderToken
  })
}
