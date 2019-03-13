import request from '@/plugin/axios'

export function fetchList (query) {
  return request({
    url: '/admin/gencode/tables',
    method: 'get',
    params: query
  })
}

export const exportCodeZip = (param) => {
  return request({
    url: '/admin/gencode/code',
    method: 'post',
    data: param,
    responseType: 'blob'
  })
}

export function getConfig () {
  return request({
    url: '/admin/gencode/configinfo',
    method: 'get'
  })
}
