import { request, config, crypt } from 'utils'

const { customers } = config.api
const { apiUserLogin } = config.rest

export async function getTempToken () {
  return request({
    url: `${apiUserLogin}/temp`,
    method: 'post'
  })
}

export async function getNPS (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${customers}/${params}/nps`,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function postNPS (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${customers}/${params.id}/nps`,
    method: 'post',
    data: params.data,
    headers: apiHeaderToken
  })
}
