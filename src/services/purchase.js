import { request, config, crypt } from 'utils'
const { stock } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: stock,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  console.log('add params:',params);
  let url = params.id ? stock + '/' + params.id : stock
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
  console.log('edit params: ',params);
  let url = params.id ? stock + '/' + params.id : stock
  console.log('editparams url:',url);
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
  console.log('delete-params:',params);
  let url = params.id ? stock + '/' + params.id : stock
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}
