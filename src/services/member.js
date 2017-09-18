import { request, config } from '../utils'
const { apiURL, apiPrefix, api } = config
const { member } = api
const idToken = localStorage.getItem('id_token')

export async function queryByCode (params) {
  return request({
    url: apiURL + apiPrefix + member + '/' + encodeURIComponent(params),
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + idToken,
    },
  })
}
