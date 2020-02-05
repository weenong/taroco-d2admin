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

export function cabinetbyplace (placeCode) {
  return request({
    url: basePath + '/keyCabinet/listbyplace/' + placeCode,
    method: 'get'
  })
}

export function shouquanByCabinet (obj) {
  return request({
    url: basePath + '/keyCabinet/shouquanByCabinet',
    method: 'post',
    data: obj
  })
}

export function syncUserFinger (cabinetCode) {
  return request({
    url: basePath + '/keyCabinet/syncUserFinger/' + cabinetCode,
    method: 'post'
  })
}

export function syncUser (cabinetCode) {
  return request({
    url: basePath + '/keyCabinet/syncUser/' + cabinetCode,
    method: 'post'
  })
}

export function online () {
  return request({
    url: basePath + '/keyCabinet/online',
    method: 'get'
  })
}
