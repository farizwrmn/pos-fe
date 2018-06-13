import { request, config, crypt } from '../../utils'

const { apiStores } = config.rest

export async function getAllStores () {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: apiStores,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function showStore (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiStores}/id/${params.id}`,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function updateStore (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiStores}/${params.id}`,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken
  })
}
