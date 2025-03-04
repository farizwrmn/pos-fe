import { request, config, crypt } from 'utils'

const { apiTime } = config.rest

export async function getDateTime (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${apiTime}/${params.id}`
  return request({
    alt: true,
    url,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function getDateTimeFormat (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = apiTime + params.id
  return request({
    url,
    method: 'get',
    headers: apiHeaderToken
  })
}
