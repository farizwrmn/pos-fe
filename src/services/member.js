import { request, config, prefix } from 'utils'

const { apiURL, apiPrefix, api } = config
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
