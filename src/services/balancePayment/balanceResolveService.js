import { request, config, crypt } from '../../utils'

const { balanceResolve } = config.api

export const query = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: balanceResolve,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export const queryResolveOption = () => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${balanceResolve}/option`,
    method: 'get',
    headers: apiHeaderToken
  })
}
