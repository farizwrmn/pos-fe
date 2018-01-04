import { request, config, crypt } from 'utils'

const { store } = config.api

export async function query (params) {
  const url = store
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: url,
    method: 'get',
    // data: params,
    headers: apiHeaderToken,
  })
}