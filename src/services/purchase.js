import { request, config, crypt } from '../utils'
const { purchase, purchaseDetail } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: purchase,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryLastTransNo (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = purchase + '/last'
  console.log(url)
  return request({
    url: url,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function create (params) {
  var transNo = params.id
  if (transNo.indexOf('SP') > -1) {
    transNo = transNo.substring(0, 2) + '/' + transNo.substring(2, 4) + '/' + transNo.substring(4, 8) + '/' + transNo.substring(8, 13)
  } else if (transNo.indexOf('FJ') > -1) {
    transNo = transNo.substring(0, 2) + '/' + transNo.substring(2, 6) + '/' + transNo.substring(6, 10)
  } else {
    transNo = params.id
  }
  let url = params.id ? purchase : null
  console.log(url)
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function createDetail (params) {
  let url = params.id ? `${purchaseDetail}/purchase` : null
  console.log('createDetail params:',params, url);
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  let url = params.transNo ? purchase : null
  console.log(url);
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'put',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  console.log('delete-params:',params);
  let url = params.transNo ? purchase : null
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}
