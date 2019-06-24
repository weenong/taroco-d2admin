import request from '@/plugin/axios'

var basePath = 'vehicle'

export function fetchList (query) {
  return request({
    url: basePath + '/vehicle/page',
    method: 'get',
    params: query
  })
}

export function delObj (id) {
  return request({
    url: basePath + '/vehicle/' + id,
    method: 'delete'
  })
}

export function getObj (id) {
  return request({
    url: basePath + '/vehicle/' + id,
    method: 'get'
  })
}

export function putObj (obj) {
  return request({
    url: basePath + '/vehicle',
    method: 'put',
    data: obj
  })
}

export function addObj (obj) {
  return request({
    url: basePath + '/vehicle',
    method: 'post',
    data: obj
  })
}
