import { request, config, crypt } from 'utils'

const { apiMobile } = config.rest

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiMobile}/members/${params.id}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

// export async function activate (params) {
//   const apiHeaderToken = crypt.apiheader()
//   return request({
//     url: `${apiMobile}/members/${params.id}`,
//     method: 'put',
//     data: params,
//     headers: apiHeaderToken
//   })
// }


export async function srvGetMemberStatus (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiMobile}/members/${params.memberCardId}/status?detail=1`,
    method: 'get',
    headers: apiHeaderToken
  })
}
export async function srvActivateMember (params) {
  console.log('zzz3', params)
  let bodyData = {}
  bodyData.memberCode = params.memberCode
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiMobile}/members/${params.memberCardId}`,
    method: 'put',
    headers: apiHeaderToken,
    data: bodyData
  })
}