import { request, config, crypt, lstorage } from 'utils'

const { transfer } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeIdReceiver = lstorage.getCurrentUserStore()
  return request({
    url: `${transfer}/out`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryByTrans (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${transfer}/out/code`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryByTransReceive (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${transfer}/out/receive`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryDetail (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${transfer}/out/detail`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  let url = `${transfer}/out`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'post',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function queryTransferOut (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: params ? `${transfer}/out` : transfer,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function voidTrans (params) {
  let url = `${transfer}/out/cancel`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'put',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

// export async function edit (params) {
//   let url = params.id ? stock + '/' + encodeURIComponent(params.id) : stock
//   const apiHeaderToken = crypt.apiheader()
//   return request({
//     url: url,
//     method: 'put',
//     data: params.data,
//     body: params.data,
//     headers: apiHeaderToken
//   })
// }

// export async function remove (params) {
//   let url = params.id ? stock + '/' + encodeURIComponent(params.id) : stock
//   const apiHeaderToken = crypt.apiheader()
//   return request({
//     url: url,
//     method: 'delete',
//     data: params,
//     headers: apiHeaderToken
//   })
// }
