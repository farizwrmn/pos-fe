import { message } from 'antd'
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

export const queryResolve = (params) => {
  const apiHeaderToken = crypt.apiheader()
  const { transId } = params
  if (!transId) {
    message.error('Trans ID needed to compelete this action')
    return
  }
  return request({
    url: `${balanceDepositDetail}/resolve/${transId}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export const queryJournal = (params) => {
  const apiHeaderToken = crypt.apiheader()
  const { transId } = params
  if (!transId) {
    message.error('Trans ID needed to compelete this action')
    return
  }
  return request({
    url: `${balanceDepositDetail}/journal/${transId}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
