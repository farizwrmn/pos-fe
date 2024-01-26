import { request, config, crypt } from '../../utils'

const { deliveryOrder } = config.api

export async function printListDeliveryOrder (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${deliveryOrder}-print-list`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: deliveryOrder,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function getAutoReplenishRawId (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/auto-replenish-raw/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryDetail (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${deliveryOrder}/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryTransferOut (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/transfer/out',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function finish (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${deliveryOrder}-finish`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

// export async function add (params) {
//   const apiHeaderToken = crypt.apiheader()
//   return request({
//     url: deliveryOrder,
//     method: 'post',
//     data: params,
//     headers: apiHeaderToken
//   })
// }

// export async function edit (params) {
//   const apiHeaderToken = crypt.apiheader()
//   return request({
//     url: `${deliveryOrder}/${params.id}`,
//     method: 'put',
//     data: params,
//     headers: apiHeaderToken
//   })
// }

// export async function remove (id) {
//   const apiHeaderToken = crypt.apiheader()
//   return request({
//     url: `${deliveryOrder}/${id}`,
//     method: 'delete',
//     headers: apiHeaderToken
//   })
// }
