import { request, config, crypt, lstorage } from 'utils'

const { api } = config
const { userLogin, userPreLogin, userRole, userStore, userTotp } = api

const lsUserId = lstorage.getStorageKey('udi')[1]

export async function login (data) {
  return request({
    url: userLogin,
    method: 'post',
    data,
  })
}

export async function prelogin (data) {
  return request({
    url: userPreLogin,
    method: 'post',
    data,
  })
}

export async function verifyTOTP (data) {
  const apiHeaderToken = crypt.apiheader()
  const url = userTotp.replace('/:id', '/' + data.userid)
  return request({
    url: url,
    method: 'post',
    headers: apiHeaderToken,
    data,
  })
}

export async function getUserRole (params) {
  const userId = (!params.userId) ? lsUserId : params.userId
  const url = userRole.replace('/:id', '/' + userId) + ('?as=' + params.as || '')
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'get',
    headers: apiHeaderToken,
  })
}

export async function getUserStore (params) {
  const userId = (!params.userId) ? lsUserId : params.userId
  const url = userStore.replace('/:id', '/' + userId) + ('?mode=lov')
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'get',
    headers: apiHeaderToken,
  })
}
