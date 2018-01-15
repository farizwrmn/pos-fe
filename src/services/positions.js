import { request, config } from '../utils'
const { apiURL, apiPrefix, api } = config
const { position } = api
const idToken = localStorage.getItem('id_token')

export async function query (params) {
  return request({
    url: apiURL + apiPrefix + position,
    method: 'get',
    data: params,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + idToken
    }
  })
}
