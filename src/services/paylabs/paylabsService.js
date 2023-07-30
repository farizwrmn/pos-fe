import { request, config, crypt } from 'utils'

const { paylabs } = config.api

export const checkOrderStatusInquiry = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paylabs}/qris/status-inquiry`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
