import { request, config, crypt } from 'utils'

const { sequence } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: sequence,
    method: 'get',
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}

export async function increase (params) {
  const url = `${sequence}/increase?seqCode=${params.seqCode}&type=${params.type}`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'put',
    headers: apiHeaderToken
  })
}
