import { message } from 'antd'
import { request, config, crypt } from '../../../utils'

const { requestCancelPos } = config.api

export async function queryAdd (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: requestCancelPos,
    data: params,
    alt: true,
    method: 'post',
    headers: apiHeaderToken
  })
}

export async function queryPending (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${requestCancelPos}/pending`,
    data: params,
    alt: true,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryVerify (params) {
  const apiHeaderToken = crypt.apiheader()
  const { id, ...other } = params
  if (!id) {
    message.error('id needed to complete this action!')
    return
  }
  return request({
    url: `${requestCancelPos}/verify/${id}`,
    data: other,
    alt: true,
    method: 'put',
    headers: apiHeaderToken
  })
}
