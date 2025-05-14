
import { request, crypt, config } from '../../utils'

const { supplierPrice } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: supplierPrice,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function saveSupplierPriceInfo (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: supplierPrice,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${supplierPrice}/:id` : supplierPrice
  return request({
    url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${supplierPrice}/${params.id}` : supplierPrice
  return request({
    url,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken
  })
}
