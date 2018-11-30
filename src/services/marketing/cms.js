import { request, config, crypt } from '../../utils'

const { apiCms, apiUpload } = config.rest

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  params.order = 'status, id'
  return request({
    url: apiCms,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function upload (params) {
  const apiHeaderToken = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/x-www-form-urlencoded',
    ...crypt.apiheader()
  }
  return request({
    url: apiUpload,
    method: 'post',
    data: params,
    headers: apiHeaderToken,
    usage: 'form'
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: apiCms,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiCms}/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiCms}/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
