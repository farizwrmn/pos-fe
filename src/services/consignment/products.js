import { request, crypt, lstorage } from 'utils'
import { rest } from 'utils/config.company'

export async function queryProductByCode (params) {
  const apiHeaderToken = crypt.apiheader()
  params.outlet_id = lstorage.getCurrentUserConsignment()
  if (params && params.outlet_id) {
    return request({
      fullUrl: `${rest.apiConsignmentURL}/product-code`,
      method: 'get',
      data: params,
      headers: apiHeaderToken
    })
  }
  return ({
    success: false,
    message: 'Missing outlet_id'
  })
}
