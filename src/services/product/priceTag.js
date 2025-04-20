import { request, crypt } from 'utils'

export async function importPriceTag (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/price-tag/import',
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
