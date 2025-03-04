import { request, crypt, lstorage } from 'utils'
import { rest } from 'utils/config.company'

export async function queryProductByCode (params) {
  const apiHeaderToken = crypt.apiheader()
  params.outlet_id = lstorage.getCurrentUserConsignment()
  if (params && params.outlet_id) {
    return request({
      fullUrl: `${rest.apiConsignmentURL}/product-code`,
      alt: true,
      method: 'get',
      data: params,
      headers: apiHeaderToken
    })
  }
  return ({
    success: false,
    message: 'Missing outlet_id'
  })
}
export async function queryById (params) {
  const apiHeaderToken = crypt.apiheader()
  params.outlet_id = lstorage.getCurrentUserConsignment()
  if (params && params.outlet_id) {
    return request({
      fullUrl: `${rest.apiConsignmentURL}/products/get-by-id`,
      method: 'get',
      data: params,
      headers: apiHeaderToken
    })
  }
  return ({
    success: false,
    message: 'Missing outlet_id'
  })
}

export async function queryProductBarcode (params) {
  const apiHeaderToken = crypt.apiheader()
  params.outlet_id = lstorage.getCurrentUserConsignment()
  if (params && params.outlet_id) {
    return request({
      fullUrl: `${rest.apiConsignmentURL}/product-barcode`,
      method: 'get',
      alt: true,
      data: params,
      headers: apiHeaderToken
    })
  }
  return ({
    success: false,
    message: 'Missing outlet_id'
  })
}

export async function queryByVendorId (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/products/get-by-vendor`,
    method: 'get',
    data,
    headers: apiHeaderToken
  })
}

export async function query (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/products/get`,
    method: 'get',
    data,
    headers: apiHeaderToken
  })
}

export async function queryAdd (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/products/add`,
    method: 'post',
    data,
    headers: apiHeaderToken
  })
}

export async function queryEdit (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/products/edit`,
    method: 'put',
    data,
    headers: apiHeaderToken
  })
}

export async function queryDelete (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/products/delete/${data.id}`,
    method: 'put',
    headers: apiHeaderToken
  })
}

export async function queryDestroy (data) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: `${rest.apiConsignmentURL}/products/destroy/${data.id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}
