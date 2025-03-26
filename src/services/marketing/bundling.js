import { request, config, crypt } from '../../utils'

const { apiPromo } = config.rest

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  params.order = '-createdAt,startDate,endDate'
  return request({
    url: `${apiPromo}/list`,
    alt: true,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryActive (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiPromo}/active`,
    alt: true,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiPromo}/list`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiPromo}/list/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiPromo}/list/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}

export async function cancel (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiPromo}/cancel/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
