import { request, config, crypt, lstorage } from '../../utils'

const { apiPromo } = config.rest

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  // params.order = 'id'
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${apiPromo}/reward`,
    alt: true,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiPromo}/reward`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiPromo}/reward/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiPromo}/reward/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
