import { request, config, crypt, lstorage } from '../../utils'

const { stock, fiforeport } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: stock,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function queryPOSstock (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${fiforeport}/balance`,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function queryProductByCode (params) {
  let url = `${stock}/${encodeURIComponent(params)}`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'get',
    headers: apiHeaderToken,
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? stock + '/' + encodeURIComponent(params.id) : stock
  return request({
    url: url,
    method: 'post',
    data: params.data,
    headers: apiHeaderToken,
  })
}

export async function remove (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? stock + '/' + encodeURIComponent(params.id) : stock
  return request({
    url: url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = stock + '/code'
  return request({
    url: url,
    method: 'put',
    data: params,
    headers: apiHeaderToken,
  })
}
