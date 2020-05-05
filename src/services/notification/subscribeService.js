import { request, crypt } from 'utils'

export async function apiSubscribeNotification (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/notification/subscribe',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
