import { request, crypt } from 'utils'

export async function queryAll (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/physical-money-deposit-all',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function getDataPaymentIdOnlyCash (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/physical-money-deposit-cash',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryPejabatToko (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/physical-money-deposit-user/${params.userId}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryByBalanceId (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/physical-money-deposit-balance/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryById (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/physical-money-deposit/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/physical-money-deposit',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

/*
send data like below schema:
{
  "total": 259800,
  "fingerEmployeeId": 1,
  "cashierUserId": 1,
  "detail": [
    {
      "detail": [
        {
           "transId": 1 ,
            "physicalMoneyId": 1,
            "amount": 1
        },
        {
           "transId": 1 ,
            "physicalMoneyId": 2,
            "amount": 1
        }
        ... to last coin
    }
  ]
}
 */
export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/physical-money-deposit',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/physical-money-deposit/${id}`,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `/physical-money-deposit/${params.id}`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}
