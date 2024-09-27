import { request, config, crypt } from '../../utils'

const { apiPromo } = config.rest

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  // params.storeId = lstorage.getCurrentUserStore()
  // params.order = 'id'
  return request({
    url: `${apiPromo}/rules`,
    method: 'get',
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiPromo}/rules`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiPromo}/rules/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiPromo}/rules/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
