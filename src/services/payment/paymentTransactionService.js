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
    alt: true,
    data: pos,
    headers: apiHeaderToken
  })
}

export const queryFailed = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentTransaction}/failed`,
    alt: true,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export const queryLatest = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentTransaction}/latest`,
    alt: true,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export const queryLatestNotValid = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentTransaction}/latest-not-valid`,
    alt: true,
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
    alt: true,
    method: 'get',
    headers: apiHeaderToken
  })
}

export const queryTimeLimit = () => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentTransaction}/time-limit`,
    alt: true,
    method: 'get',
    headers: apiHeaderToken
  })
}

export const queryCustomerViewTimeLimit = () => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentTransaction}/customer-view-time-limit`,
    alt: true,
    method: 'get',
    headers: apiHeaderToken
  })
}

export const queryCheckValidByPaymentReference = (params) => {
  const apiHeaderToken = crypt.apiheader()
  const { reference } = params
  return request({
    url: `${paymentTransaction}/check-valid/payment/${reference}`,
    alt: true,
    method: 'get',
    headers: apiHeaderToken
  })
}

export const queryCheckStatus = (params) => {
  const apiHeaderToken = crypt.apiheader()
  const { paymentTransactionId } = params
  return request({
    url: `${paymentTransaction}/check-status/${paymentTransactionId}`,
    method: 'get',
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}

export const queryCheckPaymentTransactionInvoice = (params) => {
  const apiHeaderToken = crypt.apiheader()
  const { paymentTransactionId } = params
  return request({
    url: `${paymentTransaction}/check-invoice-status/${paymentTransactionId}`,
    alt: true,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
