import { request, config, crypt } from 'utils'

const { pos } = config.api

export const queryTimeLimit = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${pos}/invoice-time-limit`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
