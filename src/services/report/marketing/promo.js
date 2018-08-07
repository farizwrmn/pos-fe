import { request, config, crypt } from '../../../utils'

const { bundlingReport } = config.api

export default async function queryPromoDetail (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${bundlingReport}?type=all`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

