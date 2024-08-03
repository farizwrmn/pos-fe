import { request, config, crypt, lstorage } from 'utils'
import { rest as restC } from '../utils/config.company'
// import { rest } from '../utils/config.rest'

const { apiUserLogin, apiUserRoles, apiUserStore } = config.rest
const { apiUserCompany } = restC

const lsUserId = lstorage.getStorageKey('udi')[1]

export async function login (data) {
  return request({
    url: apiUserLogin,
    method: 'post',
    data,
    alt: true,
    headers: { 'x-api-key': '1497e7eb-0ba8-403e-a5c4-f2904837b3cf' }
  })
}

export async function getUserRole (params) {
  const userId = (!params.userId) ? lsUserId : params.userId
  const url = apiUserRoles.replace('/:id', `/${userId}`) + (`?as=${params.as}` || '')
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    alt: true,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function getUserStore (params) {
  const userId = (!params.userId) ? lsUserId : params.userId
  const url = `${apiUserStore.replace('/:id', `/${userId}`)}?mode=lov`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    alt: true,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function getUserCompany (params) {
  const url = apiUserCompany
  return request({
    url,
    method: 'post',
    data: params,
    usage: 'company'
  })
}
