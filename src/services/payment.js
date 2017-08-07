import { request, config } from '../utils'
const { apiURL, apiPrefix, api } = config
const { cashier } = api
const idToken = localStorage.getItem('id_token')


export async function queryLastTransNo (params) {
  return request({
    url: apiURL + apiPrefix + cashier + '/lastTransNo/' + params,
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + idToken
    }
  })
}

export async function create (params) {
  return request({
    url: apiURL + apiPrefix + cashier,
    method: 'post',
    data: JSON.stringify(params),
    body: JSON.stringify(params),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + idToken
    }
  })
}
