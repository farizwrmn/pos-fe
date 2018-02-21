import { request, config, crypt } from 'utils'

const { apiUserRoles } = config.rest

export async function save (params) {
  const url = apiUserRoles.replace('/:id', `/${params.userId}`)
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'post',
    data: params.data,
    body: params.data,
    headers: apiHeaderToken
  })
}

export async function saveUserDefaultRole (params) {
  const url = apiUserRoles.replace('/:id', `/${params.userId}`)
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken
  })
}
