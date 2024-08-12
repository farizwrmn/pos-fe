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

export async function queryTransaction (params = {}) {
  params.storeId = lstorage.getCurrentUserStore()
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${importbcarecon}/transaction`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryImportLog (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${importbcarecon}/log`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryBalance (params = {}) {
  params.storeId = lstorage.getCurrentUserStore()
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${importbcarecon}/balance`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryErrorLog (params = {}) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${importbcarecon}/error-log`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryReconLog (params = {}) {
  params.storeId = lstorage.getCurrentUserStore()
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${importbcarecon}/recon-log`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryMappingStore (params = {}) {
  params.storeId = lstorage.getCurrentUserStore()
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${importbcarecon}/mapping-store`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function updateMatchPaymentAndRecon (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${importbcarecon}/match`,
    method: 'put',
    data: {
      transDate: params.transDate,
      storeId: params.storeId,
      csvData: params.csvData,
      accumulatedTransfer: params.accumulatedTransfer,
      paymentData: params.paymentData
    },
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

export async function deleteReconLog (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${importbcarecon}/recon-log`
  return request({
    url,
    method: 'put',
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
