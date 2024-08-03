import { request, config, crypt } from '../../utils'

const { apiMemberSocial } = config.rest

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: apiMemberSocial,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: apiMemberSocial,
    alt: true,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiMemberSocial}/${id}`,
    alt: true,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiMemberSocial}/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
