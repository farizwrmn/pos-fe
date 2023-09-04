import { request, config, crypt } from '../../utils'

const { balanceDeposit } = config.api

export const queryAdd = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: balanceDeposit,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
