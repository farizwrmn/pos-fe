import { APIIMAGEURL } from 'utils/config.company'
import { request, crypt } from 'utils'

export async function uploadProductImage (params) {
  const apiHeaderToken = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/x-www-form-urlencoded',
    ...crypt.apiheader()
  }
  return request({
    fullUrl: `${APIIMAGEURL}/image/upload/products?compress=1`,
    method: 'post',
    data: params,
    headers: apiHeaderToken,
    usage: 'form'
  })
}

export async function uploadCategoryImage (params) {
  const apiHeaderToken = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/x-www-form-urlencoded',
    ...crypt.apiheader()
  }
  return request({
    fullUrl: `${APIIMAGEURL}/image/upload/categories?compress=1`,
    method: 'post',
    data: params,
    headers: apiHeaderToken,
    usage: 'form'
  })
}
