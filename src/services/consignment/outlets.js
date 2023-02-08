import { request, crypt } from 'utils'
import { rest } from 'utils/config.company'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  console.log('query outlet service')
  return request({
    fullUrl: `${rest.apiConsignmentURL}/outlet/get`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryEdit (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/outlet/edit`,
    method: 'put',
    data,
    headers: apiHeaderToken
  })
}

export async function queryAdd (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/outlet/add`,
    method: 'post',
    data,
    headers: apiHeaderToken
  })
}

export async function queryDestroy (data) {
  const apiHeaderToken = crypt.apiheader()
  const id = data.id
  return request({
    fullUrl: `${rest.apiConsignmentURL}/outlet/destroy/${id}`,
    method: 'delete',
    data,
    headers: apiHeaderToken
  })
}
