import { request, crypt } from 'utils'

export async function queryTransferOut (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/return-transfer',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryTransferOutDetail (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/return-transfer-detail',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/return-to-dc',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
