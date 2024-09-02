import { request, config, crypt, lstorage } from 'utils'
// import { rest } from '../utils/config.rest'

const { apiUser, apiUsers, apiUserLogout, apiUserRole } = config.rest

export async function logout (params) {
  return request({
    url: apiUserLogout,
    method: 'post',
    data: params,
    headers: crypt.apiheader()
  })
}

export async function changePw (params) {
  const url = params.id ? `${apiUsers}/${params.id}` : apiUsers
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'put',
    data: params.data,
    body: params.data,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = lstorage.getStorageKey('udi')
  if (url[1].length > 0) {
    const ascii = /^[a-z0-9]+$/i
    if (!ascii.test(url[1])) {
      lstorage.removeItemKey()
      return { success: false, message: 'URL Mismatch' }
    }
    if (apiHeaderToken) {
      return request({
        url: apiUserRole.replace('/:id', `/${url[1]}`).replace('/:role', `/${url[2]}`),
        method: 'get',
        alt: true,
        headers: apiHeaderToken
      })
    }
    return request({
      url: apiUser.replace('/:id', ''),
      method: 'get',
      alt: true,
      data: params
    })
  }
  return { success: false, message: 'No URL' }
}
