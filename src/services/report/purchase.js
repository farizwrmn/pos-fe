/**
 * Created by Veirry on 19/09/2017.
 */
import { request, config, crypt } from '../../utils'
const { purchasereport, adjustreport } = config.api

export async function queryTrans (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${purchasereport}/trans`
  return request({
    url: url,
    data: params,
    method: 'get',
    headers: apiHeaderToken,
  })
}

export async function queryReturn (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${adjustreport}/out/return`
  return request({
    url: url,
    data: params,
    method: 'get',
    headers: apiHeaderToken,
  })
}