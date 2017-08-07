import { request, config, crypt } from 'utils'
const { stockcategory } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: stockcategory,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  console.log('add-params: ', params);
  let url = params.id ? stockcategory + '/' + params.id : stockcategory
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'post',
    data: params.data,
    body: params.data,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  console.log('edit-params: ', params);
  let url = params.id ? stockcategory + '/' + params.id  : stockcategory
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'put',
    data: params.data,
    body: params.data,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
    console.log('remove-params: ', params);
  let url = params.id ? stockcategory + '/' + params.id  : stockcategory
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}
