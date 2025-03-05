import { request, config, crypt } from 'utils'

const { paymentCost } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: paymentCost,
    alt: true,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryLov (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentCost}-all`,
    alt: true,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: paymentCost,
    alt: true,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (id) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentCost}/${id}`,
    alt: true,
    method: 'delete',
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${paymentCost}/${params.id}`,
    alt: true,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}

export const queryPosDirectPrinting = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/pos-direct-printing',
    alt: true,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export const directPrinting = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: 'http://localhost:8080/api/message?printerName=KASIR&paperWidth=58&source=POS',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
