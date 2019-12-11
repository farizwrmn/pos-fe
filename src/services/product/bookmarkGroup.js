import { request, config, crypt } from '../../utils'

const { bookmarkGroup } = config.api

export async function queryById (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${bookmarkGroup}/${params.id}`,
    method: 'get',
    data: {
      relationship: 1
    },
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: bookmarkGroup,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: bookmarkGroup,
    method: 'post',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${bookmarkGroup}/${params.id}`
  return request({
    url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${bookmarkGroup}/${params.id}`
  return request({
    url,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken
  })
}
