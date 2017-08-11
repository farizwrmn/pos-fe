import { request, config, crypt } from '../utils'
// const { apiURL, apiPrefix, api } = config
// const { cashier } = api
const { pos } = config.api


export async function queryLastTransNo (params) {
  console.log('queryLastTransNo', params);
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: pos + '/last',
    method: 'get',
    headers: apiHeaderToken
  })
}

export async function create (params) {
  console.log('create', params);
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: pos+ '/code/' + params.transNo,
    method: 'post',
    data: JSON.stringify(params),
    body: JSON.stringify(params),
    headers: apiHeaderToken
  })
}
