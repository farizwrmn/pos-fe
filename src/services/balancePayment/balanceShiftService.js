import { message } from 'antd'
import { request, config, crypt } from '../../utils'

const { balanceShift } = config.api

export async function queryByStoreId (params) {
  const apiHeaderToken = crypt.apiheader()
  const { storeId } = params
  if (!storeId) {
    message.error('Store ID needed for this action!')
    return
  }
  return request({
    url: `${balanceShift}/store/${storeId}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
