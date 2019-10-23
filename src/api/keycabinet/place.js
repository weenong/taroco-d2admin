import request from '@/plugin/axios'

var basePath = 'keycabinet'

export function fetchList (query) {
  return request({
    url: basePath + '/place/page',
    method: 'get',
    params: query
  })
}

export function delObj (id) {
  return request({
    url: basePath + '/place/' + id,
    method: 'delete'
  })
}

export function getObj (id) {
  return request({
    url: basePath + '/place/' + id,
    method: 'get'
  })
}

export function putObj (obj) {
  return request({
    url: basePath + '/place',
    method: 'put',
    data: obj
  })
}

export function addObj (obj) {
  return request({
    url: basePath + '/place',
    method: 'post',
    data: obj
  })
}

export function getplaceList () {
  return request({
    url: basePath + '/place/list',
    method: 'get'
  })
}
