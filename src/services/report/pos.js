/**
 * Created by Veirry on 10/09/2017.
 */
import { request, config, crypt } from '../../utils'
const { posreport } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params ? `${posreport}?from=${params.from}&to=${params.to}` : `${posreport}`
  console.log(url)
  return request({
    url: url,
    method: 'get',
    headers: apiHeaderToken,
  })
}
