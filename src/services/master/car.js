import { request, config, crypt } from '../../utils'

const { assets } = config.api

export async function queryBrandsOfCars (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${assets}/cars/brands`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function addBrandOfCars (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${assets}/cars/brands`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function updateBrandOfCars (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${assets}/cars/brands/:id`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}

export async function deleteBrandOfCars (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${assets}/cars/brands/:id`,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryModelsOfCars (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${assets}/cars/models`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function addModelOfCars (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${assets}/cars/models`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function updateModelOfCars (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${assets}/cars/models/:id`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}

export async function deleteModelOfCars (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${assets}/cars/models/:id`,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryTypesOfCars (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${assets}/cars/type`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function addTypeOfCars (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${assets}/cars/type`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function updateTypeOfCars (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${assets}/cars/type/:id`,
    method: 'put',
    data: params,
    headers: apiHeaderToken
  })
}

export async function deleteTypeOfCars (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${assets}/cars/type/:id`,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}
