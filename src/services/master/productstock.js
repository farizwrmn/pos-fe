import { request, config, crypt, lstorage } from '../../utils'

const { stock, fiforeport } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: stock,
    method: 'get',
    data: params,
    alt: true,
    headers: apiHeaderToken
  })
}

export async function queryById (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${stock}/${params.id}`,
    method: 'get',
    data: params,
    alt: true,
    headers: apiHeaderToken
  })
}

export async function queryByBarcode (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${stock}/barcode/${params.id}`,
    method: 'get',
    data: params,
    alt: true,
    headers: apiHeaderToken
  })
}

export async function queryProductsBelowMinimum (params) {
  const apiHeaderToken = crypt.apiheader()
  params.store = lstorage.getCurrentUserStore()
  return request({
    url: `${stock}/alert`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPOSstock (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${fiforeport}/stock`,
    method: 'get',
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPOSproduct (params) {
  let product = []
  const apiHeaderToken = crypt.apiheader()
  if (!params.storeId) {
    params.storeId = lstorage.getCurrentUserStore()
  }
  if (params && params.product) {
    product = params.product.toString().split(',')
    if (product && product.length === 1) {
      return request({
        url: `${fiforeport}/new-saldo-stock`,
        alt: true,
        method: 'get',
        data: params,
        headers: apiHeaderToken
      })
    }
  }
  return request({
    url: `${fiforeport}/stock`,
    method: 'get',
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPOSProductSales (params) {
  let product = []
  const apiHeaderToken = crypt.apiheader()
  if (!params.storeId) {
    params.storeId = lstorage.getCurrentUserStore()
  }
  if (params && params.product) {
    product = params.product.toString().split(',')
    if (product && product.length === 1) {
      return request({
        url: `${fiforeport}/new-saldo-stock-sales`,
        method: 'get',
        alt: true,
        data: params,
        headers: apiHeaderToken
      })
    }
  }
  return request({
    url: `${fiforeport}/stock-sales`,
    alt: true,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPOSproductStore (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${fiforeport}/store-stock`,
    method: 'get',
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryProductByCode (params) {
  let url = `${stock}/${encodeURIComponent(params)}`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    alt: true,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${stock}/${encodeURIComponent(params.id)}` : stock
  return request({
    url,
    method: 'post',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function bulkInsert (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${stock}/bulk/insert`
  return request({
    url,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}


export async function remove (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${stock}/${encodeURIComponent(params.id)}` : stock
  return request({
    url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${stock}/code`
  return request({
    url,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
