import { request, config, crypt } from '../../utils'

const { balanceInput } = config.api

export const queryAvailablePaymentOption = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${balanceInput}/payment-option`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
