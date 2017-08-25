import { request, config, crypt } from 'utils'
const { servicestype } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: servicestype,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}
