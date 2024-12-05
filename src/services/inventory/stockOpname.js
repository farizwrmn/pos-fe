import { request, crypt, lstorage } from 'utils'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/stock-opname',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryReportOpname (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/stock-opname-report/finish',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryDetailReportOpname (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/stock-opname-detail-report/finish',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryListEmployeeOnCharge (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/stock-opname-user',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryListEmployeePhaseTwo (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/stock-opname-user-phase-two',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function insertEmployee (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/stock-opname-user',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function updateFinishBatch2 (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/stock-opname-finish',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryListDetail (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/stock-opname-detail',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryListDetailHistory (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/stock-opname-detail-history',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryById (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `/stock-opname/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function updateFinishLine (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/stock-opname-detail-finish/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}

export async function addBatch (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/stock-opname-batch',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryActive (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/stock-opname-active',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  params.storeId = lstorage.getCurrentUserStore()
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/stock-opname',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/stock-opname/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/stock-opname/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
