import request from '@/plugin/axios'

var basePath = '/storagecabinet'

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

export function syncByCabinet (obj) {
  return request({
    url: basePath + '/storageCabinet/syncByCabinet',
    method: 'post',
    data: obj
  })
}

export function getCabinetList () {
  return request({
    url: basePath + '/storageCabinet/list',
    method: 'get'
  })
}

export function syncFinger (obj) {
  return request({
    url: basePath + '/user/syncFinger',
    method: 'post',
    data: obj
  })
}

export function syncUserFinger (cabinetCode) {
  return request({
    url: basePath + '/storageCabinet/syncUserFinger/' + cabinetCode,
    method: 'post'
  })
}

export function syncUser (cabinetCode) {
  return request({
    url: basePath + '/storageCabinet/syncUser/' + cabinetCode,
    method: 'post'
  })
}
