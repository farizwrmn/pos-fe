import {
  request,
  config,
  crypt,
  lstorage
} from '../../utils'

const {
  importbcarecon
} = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: importbcarecon,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function updatePayment (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${importbcarecon}/payment`,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function queryFilename (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${importbcarecon}/filename`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPosPayment (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${importbcarecon}/payment`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryById (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${importbcarecon}/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryMerchantByStoreId (storeId) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${importbcarecon}/merchant/${storeId}`,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryByBarcode (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${importbcarecon}/barcode/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryProductsBelowMinimum (params) {
  const apiHeaderToken = crypt.apiheader()
  params.store = lstorage.getCurrentUserStore()
  return request({
    url: `${importbcarecon}/alert`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function submitBcaRecon (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${importbcarecon}/submit-recon`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function getDataPaymentMachine (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${importbcarecon}/payment-machine`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}


export async function queryProductByCode (params) {
  let url = `${importbcarecon}/${encodeURIComponent(params)}`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${importbcarecon}/${encodeURIComponent(params.id)}` : importbcarecon
  return request({
    url,
    method: 'post',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function bulkInsert (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${importbcarecon}/bulk/insert`
  return request({
    url,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${importbcarecon}/${encodeURIComponent(params.id)}` : importbcarecon
  return request({
    url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${importbcarecon}/code`
  return request({
    url,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
