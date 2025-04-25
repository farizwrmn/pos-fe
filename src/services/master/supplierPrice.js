
import { request, crypt, config } from '../../utils'

const { supplierPrice } = config.api


export async function querySupplierPrice (params) {
  return request('/api/suppliers', {
    method: 'GET',
    params
  })
}

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
