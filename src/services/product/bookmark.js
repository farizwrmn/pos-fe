import { request, config, crypt } from '../../utils'

const { bookmark } = config.api

export async function queryShortcut (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/stock/bookmark-shortcut',
    alt: true,
    method: 'get',
    data: params,
    headers: apiHeaderToken
  })
}

export async function queryShortcutGroup (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: '/stock/bookmark-group-shortcut',
    method: 'get',
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}

export async function query (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: bookmark,
    method: 'get',
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}

export async function add (params) {
  const apiHeaderToken = crypt.apiheader()
  return request({
    url: bookmark,
    method: 'post',
    data: params.data,
    alt: true,
    headers: apiHeaderToken
  })
}

export async function remove (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = `${bookmark}/${params.id}`
  return request({
    url,
    method: 'delete',
    data: params,
    alt: true,
    headers: apiHeaderToken
  })
}

export async function edit (params) {
  const apiHeaderToken = crypt.apiheader()
  const url = bookmark
  return request({
    url,
    method: 'put',
    alt: true,
    data: params,
    headers: apiHeaderToken
  })
}
