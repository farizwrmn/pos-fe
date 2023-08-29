import { request, config, crypt } from '../utils'

const { errorLog } = config.api

export async function queryKey (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: errorLog,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryXenditRecon (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/xendit-recon-error-log',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
