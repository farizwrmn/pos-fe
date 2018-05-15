import { request, config, crypt } from 'utils'

const { userrole } = config.api

export async function query () {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: userrole,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${userrole}/name/${params.id}`,
    method: 'post',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${userrole}/name/${params.id}`,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${userrole}/name/${params.id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

