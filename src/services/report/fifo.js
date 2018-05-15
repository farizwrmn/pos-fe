/**
 * Created by Veirry on 24/10/2017.
 */
import { request, config, crypt, lstorage } from '../../utils'

const { fiforeport } = config.api

export async function queryFifo (params) {
  const apiHeaderToken = crypt.apiheader()
  params.store = lstorage.getCurrentUserStore()
  const url = `${fiforeport}/products`
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryFifoValue (params) {
  const apiHeaderToken = crypt.apiheader()
  params.store = lstorage.getCurrentUserStore()
  const url = `${fiforeport}/value`
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryFifoCard (params) {
  const apiHeaderToken = crypt.apiheader()
  params.store = lstorage.getCurrentUserStore()
  const url = `${fiforeport}/card`
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryFifoTransfer (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  const url = `${fiforeport}/transfer`
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
