/**
 * Created by Veirry on 10/09/2017.
 */
import { request, config, crypt, lstorage } from '../../utils'

const { apiFollowUp, apiReportMarketing } = config.rest

export async function queryHourly (params) {
  const apiHeaderToken = crypt.apiheader()
  // params.storeId = lstorage.getCurrentUserStore()
  params.field = 'lastCall,memberName,mobileNumber,transNo,transDate,productCode,productName,customerSatisfaction,postService,acceptOfferingReason,denyOfferingReason'
  const url = `${apiFollowUp}/detail`
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryHour (params) {
  const apiHeaderToken = crypt.apiheader()
  // params.storeId = lstorage.getCurrentUserStore()
  const url = `${apiFollowUp}/hour`
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryTarget (params) {
  const apiHeaderToken = crypt.apiheader()
  params.storeId = lstorage.getCurrentUserStore()
  const url = `${apiReportMarketing}/target`
  params.type = 'all'
  return request({
    url,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}
