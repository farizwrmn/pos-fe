import { request, config, crypt } from 'utils'

const { maintenance } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${maintenance}/health-checkup`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
