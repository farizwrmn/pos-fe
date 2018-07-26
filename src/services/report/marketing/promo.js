import { request, config, crypt } from '../../../utils'

const { bundlingReport } = config.api

export async function queryPromoDetail (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: bundlingReport,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

