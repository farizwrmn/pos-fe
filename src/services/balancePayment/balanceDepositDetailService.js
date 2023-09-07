import { message } from 'antd'
import { request, config, crypt } from '../../utils'

const { balanceDepositDetail } = config.api

export const queryDetail = (params) => {
  const apiHeaderToken = crypt.apiheader()
  const { transId } = params
  if (!transId) {
    message.error('Trans ID needed to complete this action')
    return
  }
  return request({
    url: `${balanceDepositDetail}/detail/${transId}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
