/**
 * Created by Veirry on 19/09/2017.
 */
import { request, config, crypt } from '../../utils'
const { adjustreport } = config.api

export async function queryIn (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${adjustreport}/in`
  return request({
    url: url,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function queryOut (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${adjustreport}/out`
  return request({
    url: url,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}
