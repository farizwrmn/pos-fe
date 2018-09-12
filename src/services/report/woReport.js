/**
 * Created by Veirry on 10/09/2017.
 */
import { request, config, crypt, lstorage } from '../../utils'

const { woReport } = config.api

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  const url = `${woReport}`
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryTrans (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  const url = `${woReport}`
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
