import { request, config, crypt } from 'utils'

const { api, prefix } = config
const { user, users, userLogout, userLogin } = api

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
  console.log('changePw', params)
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

// export async function query (params) {
//   return request({
//     url: user.replace('/:id', ''),
//     method: 'get',
//     data: params,
//   })
// }

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  const localId = localStorage.getItem(`${prefix}uid`)
  let url
  if (localId && localId.indexOf("#") > -1) {
    const localIds = localId.split("#")
    const rdmText = crypt.encrypt(localIds[0])
    url = crypt.decrypt(localIds[1], rdmText) || ''
  } else {
    url = crypt.decrypt(localStorage.getItem(`${prefix}uid`)) || ''
  }

  if (apiHeaderToken) {
    return request({
      url: user.replace('/:id', '/' + url),
      method: 'get',
      headers: apiHeaderToken,
    })
  } else {
    return request({
      url: user.replace('/:id', ''),
      method: 'get',
      data: params,
    })
  }
}
