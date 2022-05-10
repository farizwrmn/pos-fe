import { request, crypt } from 'utils'

export async function activeGrabCampaign (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/grabmart-campaign-active',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
