import { request, config, crypt } from 'utils'

const { apiMemberBirthday } = config.rest

export async function queryTotalBirthdayInAMonth (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiMemberBirthday}/month`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryTotalBirthdayPerDate (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiMemberBirthday}/monthdate`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryShowCustomerBirthdayPerDate (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiMemberBirthday}/monthdatelist`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryShowCustomerBirthdayPerMonth (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiMemberBirthday}/monthlist`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
