import { request, config, crypt } from '../../utils'

const { balancePayment } = config.api

export const queryOpen = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${balancePayment}/open`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export const queryClose = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${balancePayment}/close`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
