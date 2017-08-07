import { request, config } from '../utils'
const { apiURL, apiPrefix, api } = config
const { service } = api
const idToken = localStorage.getItem('id_token')

export async function queryService (params) {
  return request({
    url: apiURL + apiPrefix + service,
    method: 'get',
    data: params,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + idToken
    }
  })
}

export async function queryServiceByCode (params) {
  return request({
    url: apiURL + apiPrefix + service + '/' + params,
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + idToken
    }
  })
}
