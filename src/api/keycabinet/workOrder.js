import request from '@/plugin/axios'

var basePath = 'keycabinet'

export function fetchList (query) {
  return request({
    url: basePath + '/workOrder/page',
    method: 'get',
    params: query
  })
}

export function delObj (id) {
  return request({
    url: basePath + '/workOrder/' + id,
    method: 'delete'
  })
}

export function getObj (id) {
  return request({
    url: basePath + '/workOrder/' + id,
    method: 'get'
  })
}

export function putObj (obj) {
  return request({
    url: basePath + '/workOrder',
    method: 'put',
    data: obj
  })
}

export function addObj (obj) {
  return request({
    url: basePath + '/workOrder',
    method: 'post',
    data: obj
  })
}

export function jobUser (jobId) {
  return request({
    url: basePath + '/workOrder/jobUser/' + jobId,
    method: 'get'
  })
}

export function shouquanByJob (jobCode) {
  return request({
    url: basePath + '/workOrder/shouquanByJob/' + jobCode,
    method: 'get'
  })
}
