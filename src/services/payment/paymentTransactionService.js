import { request, config, crypt } from 'utils'

const { paymentTransaction } = config.api

export const queryAdd = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentTransaction}`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export const queryCancel = (params) => {
  const apiHeaderToken = crypt.apiheader()
  const { paymentTransactionId, pos } = params
  return request({
    url: `${paymentTransaction}/${paymentTransactionId}`,
    method: 'put',
    data: pos,
    headers: apiHeaderToken
  })
}

export const queryFailed = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentTransaction}/failed`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export const queryLatest = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentTransaction}/latest`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export const queryById = (params) => {
  const apiHeaderToken = crypt.apiheader()
  const { paymentTransactionId } = params
  return request({
    url: `${paymentTransaction}/${paymentTransactionId}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export const queryCheckStoreAvailability = () => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentTransaction}/check-store`,
    method: 'get',
    headers: apiHeaderToken
  })
}

export const queryTimeLimit = () => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentTransaction}/time-limit`,
    method: 'get',
    headers: apiHeaderToken
  })
}

export const queryCustomerViewTimeLimit = () => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentTransaction}/customer-view-time-limit`,
    method: 'get',
    headers: apiHeaderToken
  })
}

export const queryCheckValidByPaymentReference = (params) => {
  const apiHeaderToken = crypt.apiheader()
  const { reference } = params
  return request({
    url: `${paymentTransaction}/check-valid/payment/${reference}`,
    method: 'get',
    headers: apiHeaderToken
  })
}
