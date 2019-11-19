import request from '@/plugin/axios'

var basePath = 'storagecabinet'

export function fetchList (query) {
  return request({
    url: basePath + '/devtDetail/pageList',
    method: 'get',
    params: query
  })
}

export function delObj (id) {
  return request({
    url: basePath + '/devtDetail/' + id,
    method: 'delete'
  })
}

export function getObj (id) {
  return request({
    url: basePath + '/devtDetail/' + id,
    method: 'get'
  })
}

export function putObj (obj) {
  return request({
    url: basePath + '/devtDetail',
    method: 'put',
    data: obj
  })
}

export function addObj (obj) {
  return request({
    url: basePath + '/devtDetail',
    method: 'post',
    data: obj
  })
}

export function devtList () {
  return request({
    url: basePath + '/devt/list',
    method: 'get'
  })
}
