import { request, config, crypt } from '../utils'
// const { apiURL, apiPrefix, api } = config
// const { cashier } = api
const { pos, posdetail } = config.api


export async function queryLastTransNo (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: pos + '/last',
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function create (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: pos+ '/code/' + params.transNo,
    method: 'post',
    data: JSON.stringify(params),
    body: JSON.stringify(params),
    headers: apiHeaderToken
  })
}

export async function createDetail (params) {
  console.log('createDetail', params);
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: posdetail + '/' + params.transNo,
    method: 'post',
    data: params.data,
    body: params.data,
    headers: apiHeaderToken
  })
}
