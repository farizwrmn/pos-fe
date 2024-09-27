import { request, config, crypt } from '../../utils'

const { customers, assets } = config.api

export async function queryUnitsAll (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${customers}unit`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryDefault (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${customers}/default/value`,
    method: 'get',
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: customers,
    alt: true,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryByPhone (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${customers}/phone/${params.id}`,
    method: 'get',
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryByCode (params) {
  const url = params.memberCode ? `${customers}/${encodeURIComponent(params.memberCode)}` : `${customers}/${encodeURIComponent(params.data.memberCode)}`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'get',
    alt: true,
    body: params,
    headers: apiHeaderToken
  })
}

export async function queryCashbackById (params) {
  const url = `${customers}/cashback/${params.memberId}`
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    alt: true,
    method: 'get',
    body: params,
    headers: apiHeaderToken
  })
}

export async function queryUnits (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params ? `${customers}/${params.memberCode}/units` : customers
  return request({
    url,
    method: 'get',
    // data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${customers}/${encodeURIComponent(params.id)}` : customers
  return request({
    url,
    method: 'post',
    alt: true,
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function addUnit (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${customers}/${params.memberCode}/units/${params.policeNo}`
  return request({
    url,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${customers}/${encodeURIComponent(params.id)}` : customers
  return request({
    url,
    alt: true,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}

export async function removeUnit (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${customers}/${params.memberCode}/units/${params.id}` : customers
  return request({
    url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${customers}/${params.id}` : customers
  return request({
    url,
    alt: true,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function editUnit (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params.id ? `${customers}/${params.code}/units/${params.id}` : customers
  return request({
    url,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryCarBrands () {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${assets}/cars/brands`,
    method: 'get',
    // data: params,
    headers: apiHeaderToken
  })
}

export async function queryCarModels (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${assets}/cars/brands/${params.code}/models`,
    method: 'get',
    // data: params,
    headers: apiHeaderToken
  })
}

export async function queryCarTypes (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${assets}/cars/models/${params.code}/types`,
    method: 'get',
    // data: params,
    headers: apiHeaderToken
  })
}

export async function querySearchByPlat (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${customers}/units/search`,
    method: 'get',
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}

