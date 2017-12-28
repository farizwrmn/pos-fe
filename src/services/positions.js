import { request, config } from '../utils'
const { apiURL, apiPrefix, api, prefix } = config
const { position } = api
const idToken = localStorage.getItem(`${prefix}iKen`)

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
