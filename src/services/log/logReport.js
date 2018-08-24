import { request, config, crypt } from '../../utils'

const { apiLog } = config.rest

export default async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiLog}/report`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
