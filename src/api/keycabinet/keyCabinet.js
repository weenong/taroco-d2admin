import request from '@/plugin/axios'

var basePath = 'keycabinet'

export function fetchList (query) {
  return request({
    url: basePath + '/keyCabinet/page',
    method: 'get',
    params: query
  })
}

export function delObj (id) {
  return request({
    url: basePath + '/keyCabinet/' + id,
    method: 'delete'
  })
}

export function getObj (id) {
  return request({
    url: basePath + '/keyCabinet/' + id,
    method: 'get'
  })
}

export function putObj (obj) {
  return request({
    url: basePath + '/keyCabinet',
    method: 'put',
    data: obj
  })
}

export function addObj (obj) {
  return request({
    url: basePath + '/keyCabinet',
    method: 'post',
    data: obj
  })
}
