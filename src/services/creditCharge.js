import { request, config } from '../utils'
const { apiURL, apiPrefix, api } = config
const { creditCharge } = api
const idToken = localStorage.getItem('id_token')

export async function listCreditCharge (params) {
  return request({
    url: apiURL + apiPrefix + creditCharge,
    method: 'get',
    data: params,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + idToken
    }
  })
}

export async function getCreditCharge (params) {
  return request({
    url: apiURL + apiPrefix + creditCharge + '/' + params,
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + idToken
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
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + idToken
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
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + idToken
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
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + idToken
    }
  })
}
