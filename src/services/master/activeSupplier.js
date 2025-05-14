
import { request, crypt, config } from '../../utils'

const { activeSuppliers } = config.api


export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: activeSuppliers,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function saveSupplierInfo (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: activeSuppliers,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${activeSuppliers}/:id` : activeSuppliers
  return request({
    url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${activeSuppliers}/${params.id}` : activeSuppliers
  return request({
    url,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken
  })
}
