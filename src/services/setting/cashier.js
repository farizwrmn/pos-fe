import { request, config, crypt, lstorage } from '../../utils'
const { apiCashierUsers } = config.rest
const { cashier } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: apiCashierUsers,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: apiCashierUsers,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiCashierUsers}/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiCashierUsers}/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryInformation (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${apiCashierUsers}/${params}/periods/store/${lstorage.getCurrentUserStore()}/status/O`
  return request({
    url,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function cashRegister (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  params.status = "O"
  console.log('zzz5', params)
  return request({
    url: `${cashier}/cashregisters`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function srvGetActiveCashier (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiCashierUsers}?active=1&employee=1`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}