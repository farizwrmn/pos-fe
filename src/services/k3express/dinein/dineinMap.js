import { request, crypt, lstorage } from 'utils'

const dineinUrl = '/dinein-product'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  if (params && params.storeId) {
    return request({
      url: dineinUrl,
      alt: true,
      method: 'get',
      data: params,
      headers: apiHeaderToken
    })
  }
  return ({
    success: false,
    message: 'Missing storeId'
  })
}

export async function edit (params) {
  let url = params.id ? `${dineinUrl}/${encodeURIComponent(params.id)}` : dineinUrl
  const apiHeaderToken = crypt.apiheader()
  return request({
    url,
    method: 'put',
    alt: true,
    data: params,
    body: params,
    headers: apiHeaderToken
  })
}
