/**
 * Created by Veirry on 19/09/2017.
 */
import { request, config, crypt } from '../../utils'
const { purchasereport } = config.api

export async function queryTrans (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = params ? `${purchasereport}/trans?from=${params.from}&to=${params.to}` : `${purchasereport}/trans`
  console.log(url)
  return request({
    url: url,
    method: 'get',
    headers: apiHeaderToken,
  })
}
