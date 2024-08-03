import { request, config, crypt } from 'utils'

const { menus } = config.api

export async function query () {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: menus,
    alt: true,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${menus}/${params.id}`,
    method: 'post',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${menus}/${params.id}`,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${menus}/${params.id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}
