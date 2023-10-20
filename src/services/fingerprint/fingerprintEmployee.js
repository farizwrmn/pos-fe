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

export async function getDataEmployeeByUserId (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/fingerprint-employee/user/${params.userid}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function checkUserRole (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/fingerprint-employee/user-role',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
