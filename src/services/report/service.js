/**
 * Created by Veirry on 18/09/2017.
 */
import { request, config, crypt } from '../../utils'
const { servicereport } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params ? `${servicereport}/trans?from=${params.from}&to=${params.to}` : `${servicereport}/trans`
  return request({
    url: url,
    method: 'get',
    headers: apiHeaderToken,
  })
}

export async function queryMechanic (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${servicereport}/mechanic`
  return request({
    url: url,
    method: 'get',
    headers: apiHeaderToken,
  })
}
