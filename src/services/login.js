import { request, config, crypt } from 'utils'

const { api, prefix } = config
const { userLogin, userPreLogin, userRole, userTotp } = api

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
  let userId
  if (!params.userId) {
    const localId = localStorage.getItem(`${prefix}uid`)
    let url = []
    if (localId && localId.indexOf("#") > -1) {
      const localIds = localId.split("#")
      const rdmText = crypt.encrypt(localIds[0])
      url[0] = crypt.decrypt(localIds[1], rdmText) || ''
    } else {
      url[0] = crypt.decrypt(localStorage.getItem(`${prefix}uid`)) || ''
    }
    userId = url[0]
  } else {
    userId = params.userId
  }
  const url = userRole.replace('/:id', '/' + userId) + ('?as=' + params.as || '')
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'get',
    headers: apiHeaderToken,
  })
}
