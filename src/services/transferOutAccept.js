import { request, config, crypt } from 'utils'

const { transfer } = config.api

export async function acceptTransOut (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${transfer}/out/accept`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function resetTransOut (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${transfer}/out/reset`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}
