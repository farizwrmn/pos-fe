import { request, config } from 'utils'

const { api } = config
const { posts } = api

export async function query (params) {
  return request({
    url: posts,
    method: 'get',
    data: params
  })
}

export async function add (params) {
  return request({
    url: posts,
    method: 'post',
    data: params
  })
}
