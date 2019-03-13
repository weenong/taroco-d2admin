import request from '@/plugin/axios'

var basePath = 'admin'

export function fetchList (query) {
  return request({
    url: basePath + '/product/page',
    method: 'get',
    params: query
  })
}

export function delObj (id) {
  return request({
    url: basePath + '/product/' + id,
    method: 'delete'
  })
}

export function getObj (id) {
  return request({
    url: basePath + '/product/' + id,
    method: 'get'
  })
}

export function putObj (obj) {
  return request({
    url: basePath + '/product',
    method: 'put',
    data: obj
  })
}

export function addObj (obj) {
  return request({
    url: basePath + '/product',
    method: 'post',
    data: obj
  })
}
