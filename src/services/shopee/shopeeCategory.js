import { request, crypt } from 'utils'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/shopee/category',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryAttribute (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/shopee/attribute',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryLogistic (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/shopee/logistic',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryLogisticProduct (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/shopee/logistic-product',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryRecommend (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/shopee/category-recommend',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryBrand (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/shopee/brand',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
