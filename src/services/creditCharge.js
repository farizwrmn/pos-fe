import { request, config } from 'utils'
import { prefix } from 'utils/config.main'

const { apiURL, apiPrefix } = config.rest
const { creditCharge } = config.api
const idToken = localStorage.getItem(`${prefix}iKen`)

export async function listCreditCharge (params) {
  return request({
    url: apiURL + apiPrefix + creditCharge,
    method: 'get',
    alt: true,
    data: params,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `JWT ${idToken}`
    }
  })
}

export async function getCreditCharge (params) {
  return request({
    url: `${apiURL + apiPrefix + creditCharge}/${params}`,
    method: 'get',
    alt: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `JWT ${idToken}`
    }
  })
}

export async function createCreditCharge (params) {
  return request({
    url: apiURL + apiPrefix + creditCharge,
    method: 'post',
    data: params,
    body: params,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `JWT ${idToken}`
    }
  })
}

export async function removeCreditCharge (params) {
  return request({
    url: apiURL + apiPrefix + creditCharge,
    method: 'delete',
    data: params,
    body: params,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `JWT ${idToken}`
    }
  })
}

export async function updateCreditCharge (params) {
  return request({
    url: apiURL + apiPrefix + creditCharge,
    method: 'put',
    data: params,
    body: params,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `JWT ${idToken}`
    }
  })
}
