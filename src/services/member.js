import { request, config } from '../utils'

const { apiURL, apiPrefix, api, prefix } = config
const { member } = api
const idToken = localStorage.getItem(`${prefix}iKen`)

export async function queryByCode (params) {
  return request({
    url: `${apiURL + apiPrefix + member}/${encodeURIComponent(params)}`,
    method: 'get',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `JWT ${idToken}`
    }
  })
}

export async function add (params) {
  return request({
    url: `${apiURL + apiPrefix + member}/${encodeURIComponent(params)}`,
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `JWT ${idToken}`
    }
  })
}
