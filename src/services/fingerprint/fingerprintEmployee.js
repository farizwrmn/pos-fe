import { request, crypt } from '../../utils'

export async function registerEmployeeFingerprint (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/fingerprint-employee/register',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
