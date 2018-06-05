import { request, config, crypt } from 'utils'

const { apiTools } = config.rest

export async function querySellpriceReport (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiTools}/report/sellprice`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function querySellPriceHistory (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiTools}/in`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
