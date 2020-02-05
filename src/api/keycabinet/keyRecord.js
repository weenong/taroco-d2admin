import request from '@/plugin/axios'

var basePath = 'keycabinet'

export function fetchList (query) {
  return request({
    url: basePath + '/keyRecord/page',
    method: 'get',
    params: query
  })
}

export function delObj (id) {
  return request({
    url: basePath + '/keyRecord/' + id,
    method: 'delete'
  })
}

export function getObj (id) {
  return request({
    url: basePath + '/keyRecord/' + id,
    method: 'get'
  })
}

export function putObj (obj) {
  return request({
    url: basePath + '/keyRecord',
    method: 'put',
    data: obj
  })
}

export function addObj (obj) {
  return request({
    url: basePath + '/keyRecord',
    method: 'post',
    data: obj
  })
}

export function newRecord (keyDetail) {
  return request({
    url: basePath + '/keyRecord/keyRecord?keyCabinetCode=' + keyDetail.keyCabinetCode + '&code=' + keyDetail.code,
    method: 'get'
  })
}

export function pageList (query) {
  return request({
    url: basePath + '/keyRecord/webrecord/pagelist',
    method: 'get',
    params: query
  })
}
