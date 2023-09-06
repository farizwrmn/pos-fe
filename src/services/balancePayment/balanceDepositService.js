import { request, config, crypt } from '../../utils'

const { balanceDeposit } = config.api

export const query = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: balanceDeposit,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export const queryBalance = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${balanceDeposit}/balance`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export const queryAdd = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: balanceDeposit,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
