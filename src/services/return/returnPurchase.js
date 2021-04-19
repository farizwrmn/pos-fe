import { request, lstorage, crypt } from 'utils'

export async function queryById (params) {
  params.storeId = lstorage.getCurrentUserStore()
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/return-purchase/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  params.storeId = lstorage.getCurrentUserStore()
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/return-purchase',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/return-purchase',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/return-purchase/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function approve (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/return-purchase/approve/${params.id}`,
    method: 'post',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/return-purchase/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
