import request from '@/plugin/axios'

export function fetchList (query) {
  return request({
    url: '/admin/user/userPage',
    method: 'get',
    params: query,
    loading: {
      type: 'nprogress',
      interval: 500
    }
  })
}

export function addObj (obj) {
  return request({
    url: '/admin/user/',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: '/admin/user/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return request({
    url: '/admin/user/' + id,
    method: 'delete'
  })
}

export function putObj (obj) {
  return request({
    url: '/admin/user',
    method: 'put',
    data: obj
  })
}

export function userList () {
  return request({
    url: '/admin/user/userList',
    method: 'get'
  })
}
