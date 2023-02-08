import { request, crypt } from 'utils'
import { rest } from 'utils/config.company'

export async function queryByOutletId (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/payment-method/get-by-outlet`,
    method: 'get',
    data,
    headers: apiHeaderToken
  })
}

export async function queryAdd (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/payment-method/add`,
    method: 'post',
    data,
    headers: apiHeaderToken
  })
}

export async function queryEdit (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/payment-method/edit`,
    method: 'put',
    data,
    headers: apiHeaderToken
  })
}

export async function queryDestroy (data) {
  const apiHeaderToken = crypt.apiheader()
  const id = data.id
  return request({
    fullUrl: `${rest.apiConsignmentURL}/payment-method/destroy/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}
