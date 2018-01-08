import { request, config, crypt } from 'utils'

const { userRole } = config.api

export async function save (params) {
  const url = userRole.replace('/:id', '/' + params.userId)
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'post',
    data: params.data,
    body: params.data,
    headers: apiHeaderToken
  })
}

export async function saveUserDefaultRole (params) {
  const url = userRole.replace('/:id', '/' + params.userId)
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken
  })
}