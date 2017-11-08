/**
 * Created by Veirry on 24/10/2017.
 */
import { request, config, crypt } from '../../utils'
const { fiforeport } = config.api

export async function queryFifo (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${fiforeport}/products`
  return request({
    url: url,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}

export async function queryFifoValue (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${fiforeport}/value`
  return request({
    url: url,
    method: 'get',
    data: params,
    headers: apiHeaderToken,
  })
}