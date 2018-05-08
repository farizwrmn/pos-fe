import { request, config, crypt, lstorage } from 'utils'

const { api } = config
const { dashboard, ipaddr, dashboards } = api

// export async function myCity (params) {
//   return request({
//     url: 'http://www.zuimeitianqi.com/zuimei/myCity',
//     data: params,
//   })
// }

// export async function queryWeather (params) {
//   return request({
//     url: 'http://www.zuimeitianqi.com/zuimei/queryWeather',
//     data: params,
//   })
// }

export async function query (params) {
  return request({
    url: dashboard,
    method: 'get',
    data: params
  })
}
export async function getIpAddr (params) {
  return request({
    url: ipaddr,
    method: 'get',
    data: params
  })
}

export async function getDashboards (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${dashboards}`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function getNotifications () {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${dashboards}/header`,
    method: 'post',
    data: { store: lstorage.getCurrentUserStore() },
    headers: apiHeaderToken
  })
}

export async function getListNotifications () {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${dashboards}/notification`,
    method: 'post',
    data: { store: lstorage.getCurrentUserStore() },
    headers: apiHeaderToken
  })
}

export async function refreshNotifications () {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${dashboards}/notification/refresh`,
    method: 'post',
    data: { store: lstorage.getCurrentUserStore() },
    headers: apiHeaderToken
  })
}
