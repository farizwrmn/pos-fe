import { request, config, crypt } from 'utils'
const { sellprice } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: sellprice,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}
