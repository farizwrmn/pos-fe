import { request, config, crypt } from 'utils'

const { paymentTransaction } = config.api

export const queryAdd = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentTransaction}`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
