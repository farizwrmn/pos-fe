import { request, crypt } from 'utils'

export async function queryDetail (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/delivery-order/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export const queryTransferOutDetail = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/delivery-order-history/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
