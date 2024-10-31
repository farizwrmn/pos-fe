import { request, crypt } from 'utils'


export const getSerialPort = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: 'http://localhost:8080/api/serial',
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export const postSerialPort = (params) => {
  const apiHeaderToken = crypt.apiheader()
  return request({
    fullUrl: 'http://localhost:8080/api/serial',
    method: 'post',
    data: params,
    timeout: 600000,
    headers: apiHeaderToken
  })
}
