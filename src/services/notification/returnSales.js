import { request, crypt } from 'utils'

export async function approve (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `/return-sales/approve/${params.id}`
  return request({
    url,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
