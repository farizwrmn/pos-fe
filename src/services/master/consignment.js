import { request, crypt, lstorage } from '../../utils'

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  params.outlet_id = lstorage.getCurrentUserConsignment()
  if (params && params.outlet_id) {
    return request({
      url: '/consignment-api/stock',
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
