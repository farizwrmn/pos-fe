import { request, lstorage, config, crypt } from '../../utils'

const { cashier } = config.api

export async function queryId (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${cashier}/bankentry/${params.id}`,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryById (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${cashier}/bankentry/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  params.order = 'typeCode'
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${cashier}/bankentry`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${cashier}/bankentry`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function transfer (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${cashier}/bankentry/transfer`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryBankRecon (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/accounting/bank-recon',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryEntryList (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/accounting/ledger-entry',
    alt: true,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function updateBankRecon (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/accounting/bank-recon',
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${cashier}/bankentry/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${cashier}/bankentry/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

