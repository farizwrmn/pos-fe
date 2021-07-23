import { request, config, crypt, lstorage } from '../../utils'

const { stock, fiforeport } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: stock,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryById (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${stock}/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryByBarcode (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${stock}/barcode/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function indexByBarcodeOffline ({ localDB }) {
  return localDB.createIndex({
    index: {
      fields: ['barCode01', 'table']
    },
    name: 'productBarcode-index',
    ddoc: 'productBarcode-index',
    type: 'json'
  })
}

export async function getListIndex ({ localDB }) {
  return localDB.getIndexes()
}

export async function queryByBarcodeOffline ({ localDB, barCode01 }) {
  return localDB.find({
    selector: {
      barCode01,
      table: 'tbl_stock'
    },
    use_index: 'productBarcode-index',
    limit: 1
  })
}

export async function indexByBarcodeBundleOffline ({ localDB }) {
  return localDB.createIndex({
    index: {
      fields: ['barcode01', 'table']
    },
    name: 'bundleBarcode-index',
    ddoc: 'bundleBarcode-index',
    type: 'json'
  })
}

export async function queryByBarcodeBundleOffline ({ localDB, barCode01 }) {
  return localDB.find({
    selector: {
      barcode01: barCode01,
      table: 'tbl_bundling'
    },
    use_index: 'bundleBarcode-index',
    limit: 1
  })
}

export async function queryProductStock ({ localDB, q }) {
  return localDB.find({
    selector: {
      productName: { $regex: q },
      table: 'tbl_stock'
    },
    use_index: 'bundleBarcode-index',
    limit: 20
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
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPOSproduct (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${fiforeport}/stock`,
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
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryProductByCode (params) {
  let url = `${stock}/${encodeURIComponent(params)}`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
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
