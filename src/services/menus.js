import { request, config, crypt } from 'utils'


const { menus } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: menus,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}