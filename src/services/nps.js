import { request, config } from 'utils'

const { customers } = config.api
const { apiUserLogin } = config.rest

export async function getTempToken () {
  return request({
    url: `${apiUserLogin}/temp`,
    method: 'post'
  })
}

export async function getNPS (params) {
  return request({
    url: `${customers}/${params}/nps`,
    method: 'get'
  })
}

export async function postNPS (params) {
  return request({
    url: `${customers}/${params.id}/nps`,
    method: 'post',
    data: params.data
  })
}
