import request from '@/plugin/axios'

var basePath = 'storagecabinet'

export function fetchList (query) {
  return request({
    url: basePath + '/cabinetCell/page',
    method: 'get',
    params: query
  })
}

export function delObj (id) {
  return request({
    url: basePath + '/cabinetCell/' + id,
    method: 'delete'
  })
}

export function getObj (id) {
  return request({
    url: basePath + '/cabinetCell/' + id,
    method: 'get'
  })
}

export function putObj (obj) {
  return request({
    url: basePath + '/cabinetCell',
    method: 'put',
    data: obj
  })
}

export function addObj (obj) {
  return request({
    url: basePath + '/cabinetCell',
    method: 'post',
    data: obj
  })
}

export function cellList () {
  return request({
    url: basePath + '/cabinetCell/cellList',
    method: 'get'
  })
}

export function shouquanByCell (param) {
  return request({
    url: basePath + '/cabinetCell/shouquan',
    method: 'post',
    data: param
  })
}
