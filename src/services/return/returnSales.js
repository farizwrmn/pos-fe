import { request, lstorage, crypt } from 'utils'

export async function query (params) {
  params.storeId = lstorage.getCurrentUserStore()
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/return-sales',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/return-sales',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/return-sales/${params.id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function approve (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/return-sales/approve/${params.id}`,
    method: 'post',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/return-sales/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
