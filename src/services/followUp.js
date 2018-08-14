import { request, config, crypt, lstorage } from 'utils'

const { apiFollowUp } = config.rest
const { posdetail } = config.api

export async function queryTransactionDetail (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${posdetail}/${encodeURIComponent(params.id)}`
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryHeader (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  return request({
    url: `${apiFollowUp}/header?order=-createdAt`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryHeaderById (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiFollowUp}/header/:id`,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function updateStatusToZero (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiFollowUp}/main/view`,
    method: 'post',
    data: params,
    headers: apiHeaderToken
  })
}

export async function updateStatusToTwo (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiFollowUp}/main/view/${params.id}`,
    method: 'put',
    headers: apiHeaderToken
  })
}

export async function updateNextServiceAndCustomerSatisfaction (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiFollowUp}/main/call/${params.id}`,
    method: 'post',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function updatePending (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiFollowUp}/main/pending/${params.id}`,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function updateAcceptOffering (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiFollowUp}/main/offering/accept/${params.id}`,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken
  })
}

export async function updateDenyOffering (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: `${apiFollowUp}/main/offering/deny/${params.id}`,
    method: 'put',
    data: params.data,
    headers: apiHeaderToken
  })
}
