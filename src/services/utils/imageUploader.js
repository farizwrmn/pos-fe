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

export async function uploadVoucherImage (params) {
  const apiHeaderToken = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/x-www-form-urlencoded',
    ...crypt.apiheader()
  }
  return request({
    fullUrl: `${APIIMAGEURL}/image/upload/vouchers?compress=1`,
    method: 'post',
    data: params,
    headers: apiHeaderToken,
    usage: 'form'
  })
}

export async function uploadBookmarkImage (params) {
  const apiHeaderToken = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/x-www-form-urlencoded',
    ...crypt.apiheader()
  }
  return request({
    fullUrl: `${APIIMAGEURL}/image/upload/bookmarks?compress=1`,
    method: 'post',
    data: params,
    headers: apiHeaderToken,
    usage: 'form'
  })
}

export async function uploadAdvertisingImage (params) {
  const apiHeaderToken = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/x-www-form-urlencoded',
    ...crypt.apiheader()
  }
  return request({
    fullUrl: `${APIIMAGEURL}/image/upload/advertising?compress=1`,
    method: 'post',
    data: params,
    headers: apiHeaderToken,
    usage: 'form'
  })
}

export async function uploadRentImage (params) {
  const apiHeaderToken = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/x-www-form-urlencoded',
    ...crypt.apiheader()
  }
  return request({
    fullUrl: `${APIIMAGEURL}/image/upload/rentpayment?folder=consignment`,
    method: 'post',
    data: params,
    headers: apiHeaderToken,
    usage: 'form'
  })
}

export async function uploadConsignmentIdImage (params) {
  const apiHeaderToken = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/x-www-form-urlencoded',
    ...crypt.apiheader()
  }
  return request({
    fullUrl: `${APIIMAGEURL}/image/upload/rentpayment?folder=consignmentVendorIdImage`,
    method: 'post',
    data: params,
    headers: apiHeaderToken,
    usage: 'form'
  })
}

export async function uploadConsignmentTaxIdImage (params) {
  const apiHeaderToken = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/x-www-form-urlencoded',
    ...crypt.apiheader()
  }
  return request({
    fullUrl: `${APIIMAGEURL}/image/upload/rentpayment?folder=consignmentVendorTaxIdImage`,
    method: 'post',
    data: params,
    headers: apiHeaderToken,
    usage: 'form'
  })
}

export async function uploadBundleImage (params) {
  const apiHeaderToken = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/x-www-form-urlencoded',
    ...crypt.apiheader()
  }
  return request({
    fullUrl: `${APIIMAGEURL}/image/upload/bundles?compress=1`,
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

export async function uploadExpressCategoryImage (params) {
  const apiHeaderToken = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/x-www-form-urlencoded',
    ...crypt.apiheader()
  }
  return request({
    fullUrl: `${APIIMAGEURL}/image/upload/expresscategory?compress=1`,
    method: 'post',
    data: params,
    headers: apiHeaderToken,
    usage: 'form'
  })
}

export async function uploadExpressBrandImage (params) {
  const apiHeaderToken = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/x-www-form-urlencoded',
    ...crypt.apiheader()
  }
  return request({
    fullUrl: `${APIIMAGEURL}/image/upload/expressbrand?compress=1`,
    method: 'post',
    data: params,
    headers: apiHeaderToken,
    usage: 'form'
  })
}

export async function uploadExpressConsignmentImage (params) {
  const apiHeaderToken = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/x-www-form-urlencoded',
    ...crypt.apiheader()
  }
  return request({
    fullUrl: `${APIIMAGEURL}/image/upload/expressconsignment?compress=1`,
    method: 'post',
    data: params,
    headers: apiHeaderToken,
    usage: 'form'
  })
}
