import { request, config, crypt } from 'utils'

const { city } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: city,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function add (params) {
  console.log('params:', params, city);
  const url = params.cityCode ? city + '/' + params.cityCode : null
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
  const url = params.cityCode ? `${city}/${params.cityCode}` : cityCode
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
  const url = params.id.groupCode ? `${city}/${params.id.groupCode}` : city
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'delete',
    data: params.data,
    headers: apiHeaderToken,
  })
}
