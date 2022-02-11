import { request, config, crypt } from '../../utils'

const { subaPiutangMarketing } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: subaPiutangMarketing,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: subaPiutangMarketing,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${subaPiutangMarketing}/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${subaPiutangMarketing}/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
