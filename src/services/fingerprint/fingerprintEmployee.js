import { request, crypt } from '../../utils'

export async function registerEmployeeFingerprint (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/fingerprint-employee/register',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
