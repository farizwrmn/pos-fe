import { request, config, crypt } from 'utils'

const { apicustomerbirthday } = config.rest

export async function queryTotalBirthdayInAMonth (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apicustomerbirthday}/month`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryTotalBirthdayPerDate (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apicustomerbirthday}/monthdate`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryShowCustomerBirthdayPerDate (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apicustomerbirthday}/monthdatelist`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryShowCustomerBirthdayPerMonth (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apicustomerbirthday}/monthlist`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
