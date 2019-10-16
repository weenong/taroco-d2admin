import request from '@/plugin/axios'

var basePath = 'business'

export function fetchList (query) {
  return request({
    url: basePath + '/storageCabinet/page',
    method: 'get',
    params: query
  })
}

export function delObj (id) {
  return request({
    url: basePath + '/storageCabinet/' + id,
    method: 'delete'
  })
}

export function getObj (id) {
  return request({
    url: basePath + '/storageCabinet/' + id,
    method: 'get'
  })
}

export function putObj (obj) {
  return request({
    url: basePath + '/storageCabinet',
    method: 'put',
    data: obj
  })
}

export function addObj (obj) {
  return request({
    url: basePath + '/storageCabinet',
    method: 'post',
    data: obj
  })
}
