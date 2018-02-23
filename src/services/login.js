import { request, config, crypt, lstorage } from 'utils'

const { apiUserLogin, apiUserRoles, apiUserStore } = config.rest

const lsUserId = lstorage.getStorageKey('udi')[1]

export async function login (data) {
  return request({
    url: apiUserLogin,
    method: 'post',
    data
  })
}

export async function getUserRole (params) {
  const userId = (!params.userId) ? lsUserId : params.userId
  const url = apiUserRoles.replace('/:id', `/${userId}`) + (`?as=${params.as}` || '')
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
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
    method: 'get',
    headers: apiHeaderToken
  })
}
