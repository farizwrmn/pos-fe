import { request, config, crypt, lstorage } from 'utils'

const { api } = config
const { user, users, userLogout, userLogin, userRole } = api

export async function login (params) {
  return request({
    url: userLogin,
    method: 'post',
    data: params,
  })
}

export async function logout (params) {
  return request({
    url: userLogout,
    method: 'post', // 'get',
    data: params,
    headers: crypt.apiheader(),
  })
}

export async function changePw (params) {
  const url = params.id ? users + '/' + params.id  : users
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
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
      return { "success": false, "message": "URL Mismatch" }
    } else {
      if (apiHeaderToken) {
        console.log('zz1',userRole.replace('/:id', '/' + url[1]).replace('/:role', '/' + url[2]))

        return request({
          url: userRole.replace('/:id', '/' + url[1]).replace('/:role', '/' + url[2]),
          method: 'get',
          headers: apiHeaderToken,
        })
      } else {
        console.log('zz6')
        return request({
          url: user.replace('/:id', ''),
          method: 'get',
          data: params,
        })
      }
    }
  } else {
    return { "success": false, "message": "No URL" }
  }
}
