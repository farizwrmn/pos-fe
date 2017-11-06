/**
 * Created by Veirry on 10/09/2017.
 */
import { request, config, crypt } from '../../utils'
const { posreport } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params ? `${posreport}?from=${params.from}&to=${params.to}` : `${posreport}`
  return request({
    url: url,
    method: 'get',
    headers: apiHeaderToken,
  })
}

export async function queryTrans (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params ? `${posreport}/trans?from=${params.from}&to=${params.to}` : `${posreport}/trans`
  return request({
    url: url,
    method: 'get',
    headers: apiHeaderToken,
  })
}

export async function queryAll (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${posreport}/all`
  return request({
    url: url,
    data: params,
    method: 'get',
    headers: apiHeaderToken,
  })
}