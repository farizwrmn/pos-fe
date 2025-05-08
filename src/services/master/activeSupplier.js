
import { request, crypt } from '../../utils'


export async function querySuppliers (params) {
  return request('/api/suppliers', {
    method: 'GET',
    params
  })
}

export async function saveSupplierInfo (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/mst-suppliers',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function saveProductDetail (data) {
  return request('/api/product-details', {
    method: 'POST',
    data
  })
}
