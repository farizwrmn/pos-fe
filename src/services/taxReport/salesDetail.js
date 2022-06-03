import { request, crypt } from 'utils'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/tax-report/pos-detail',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryRestore (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/tax-report/pos-detail-restore',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function restoreDetail (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/tax-report/pos-detail-restore',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/tax-report/pos-detail',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/tax-report/pos-detail',
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/tax-report/pos-detail/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
