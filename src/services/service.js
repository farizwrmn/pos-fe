import { request, config, crypt } from 'utils'

const { services } = config.api

export async function query (params) {
  console.log('query_params', params,services);
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: services,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function add (params) {
  console.log('params:', params, services);
  const url = params.serviceCode ? services + '/' + params.serviceCode : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url:url,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken,
  })
}

export async function edit (params) {
  console.log('edit-params:', params);
  const url = params.serviceCode ? `${services}/${params.serviceCode}` : serviceCode
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'put',
    data: params,
    body: params,
    headers: apiHeaderToken,
  })
}

export async function remove (params) {
  console.log('params', params);
  const url = params.id.serviceCode ? `${services}/${params.id.serviceCode}` : services
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'delete',
    data: params.data,
    headers: apiHeaderToken,
  })
}
