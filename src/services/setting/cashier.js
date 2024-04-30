import moment from 'moment'
import { request, config, crypt, lstorage } from '../../utils'

const { apiCashierUsers, apiCashRegister } = config.rest
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

export async function queryCurrentOpenCashRegister (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${apiCashierUsers}/${params.cashierId}/periods/store/${lstorage.getCurrentUserStore()}/status/O`
  return request({
    url,
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function queryCashRegisterByStore (params) {
  const apiHeaderToken = crypt.apiheader()
  let url
  let paramCashierId = 0
  let paramStoreId = 0
  let paramStatus
  let periods = []
  let paramPeriods = []
  if (params) {
    if (params.hasOwnProperty('cashierId')) paramCashierId = params.cashierId
    if (params.hasOwnProperty('storeId')) paramStoreId = params.storeId
    if (params.hasOwnProperty('status')) paramStatus = params.status
    if (params.hasOwnProperty('periods')) periods = params.periods
  }

  if (paramStatus) {
    url = `${apiCashierUsers}/${paramCashierId}/periods/store/${paramStoreId}/status/${paramStatus}`
  } else {
    url = `${apiCashierUsers}/${paramCashierId}/periods/store/${paramStoreId}`
  }
  if (periods && periods.length) {
    paramPeriods[0] = moment(periods[0]).format('YYYY-MM-DD')
    paramPeriods[1] = moment(periods[1]).format('YYYY-MM-DD')
    url = `${url}?period=${paramPeriods}&`
  } else {
    url = `${url}?`
  }

  const orderBy = 'order=period-,shiftid,counterId'
  url = `${url}${orderBy}`

  return request({
    url,
    method: 'get',
    headers: apiHeaderToken
  })
}

// export async function queryCashierTransSource (params) {
//   const apiHeaderToken = crypt.apiheader()
//   const url = `${apiCashierUsers}/${params.cashierId}/transactions/?id=${params.id}`
//   return request({
//     url,
//     method: 'get',
//     headers: apiHeaderToken
//   })
// }
// export async function queryCashierTransSourceDetail (params) {
//   const apiHeaderToken = crypt.apiheader()
//   const url = `${apiCashierUsers}/${params.cashierId}/transactions/?id=${params.id}&transType=${params.transType}`
//   return request({
//     url,
//     method: 'get',
//     headers: apiHeaderToken
//   })
// }
export async function queryCloseRegister (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${apiCashRegister}/${params.id}?status=C`
  return request({
    url,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}

export async function cashRegister (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  params.status = 'O'

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

export async function getClosedCashRegister (params) {
  const apiHeaderToken = crypt.apiheader()
  const user = lstorage.getStorageKey('udi')[1]
  return request({
    url: `${apiCashRegister}?cashierId=${user}&status=C`,
    method: 'GET',
    data: params,
    headers: apiHeaderToken
  })
}

export async function getRequestedCashRegister (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiCashRegister}?status=R`,
    method: 'GET',
    data: params,
    headers: apiHeaderToken
  })
}

export async function sendRequestOpenCashRegister (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiCashRegister}/${params.id}?status=R`,
    method: 'PUT',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function approveRequestOpenCashRegister (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiCashRegister}/${params.id}?status=A`,
    method: 'PUT',
    data: params,
    headers: apiHeaderToken
  })
}

export async function getCashRegisterDetails (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiCashRegister}/${params.id}/details`,
    method: 'GET',
    headers: apiHeaderToken
  })
}
