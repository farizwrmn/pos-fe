import { request, crypt } from 'utils'
import { rest } from 'utils/config.company'

export async function querySummary (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/journal/summary`,
    method: 'get',
    data,
    headers: apiHeaderToken
  })
}
