import { request, crypt } from 'utils'
import { rest } from 'utils/config.company'

export async function setCutOffReadyForEmail (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/cut-off-detail/set-cut-off-ready`,
    method: 'put',
    data,
    headers: apiHeaderToken
  })
}
