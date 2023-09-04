import { request, config, crypt } from '../../utils'

const { balanceDepositDetail } = config.api

export const query = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: balanceDepositDetail,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
