import { request, crypt } from 'utils'

export async function approve (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `/return-sales/approve/${params.id}`
  return request({
    url,
    method: 'delete',
    data: params,
    headers: apiHeaderToken
  })
}
