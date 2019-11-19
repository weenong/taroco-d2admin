import request from '@/plugin/axios'

var basePath = 'keycabinet'

export function fetchList (query) {
  return request({
    url: basePath + '/keyDetail/page',
    method: 'get',
    params: query
  })
}

export function delObj (id) {
  return request({
    url: basePath + '/keyDetail/' + id,
    method: 'delete'
  })
}

export function getObj (id) {
  return request({
    url: basePath + '/keyDetail/' + id,
    method: 'get'
  })
}

export function putObj (obj) {
  return request({
    url: basePath + '/keyDetail',
    method: 'put',
    data: obj
  })
}

export function addObj (obj) {
  return request({
    url: basePath + '/keyDetail',
    method: 'post',
    data: obj
  })
}

export function listKey (cabinetCode) {
  return request({
    url: basePath + '/keyDetail/keylist/' + cabinetCode,
    method: 'get'
  })
}

export function syncByCabinet (cabinetCode) {
  return request({
    url: basePath + '/keyDetail/sync/' + cabinetCode,
    method: 'get'
  })
}

export function queryuserbykey (keyCode,cabinetCode) {
  return request({
    url: basePath + '/keyDetail/queryuserbykey/' + keyCode + '/' + cabinetCode,
    method: 'get'
  })
}

export function shouquanByKeyDetail (obj) {
  return request({
    url: basePath + '/keyDetail/shouquanByKeyDetail',
    method: 'post',
    data: obj
  })
}
