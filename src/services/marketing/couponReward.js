import { request, config, crypt } from '../../utils'

const { apiCouponProduct } = config.rest

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  // params.order = 'id'
  return request({
    url: `${apiCouponProduct}/${params}`,
    method: 'get',
    headers: apiHeaderToken
  })
}
