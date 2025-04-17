
import { request, crypt } from '../../utils'


export async function querySupplierPrice (params) {
  return request('/api/suppliers', {
    method: 'GET',
    params
  })
}

export async function saveSupplierPriceInfo (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/mst-suppliers-price',
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
