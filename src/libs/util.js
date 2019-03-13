import log from './util.log.js'
import cookies from './util.cookies.js'
import { validatenull } from './validate'
import { parse } from 'matchit'

let util = {
  cookies,
  log
}
/**
 * @description 更新标题
 * @param {String} title 标题
 */
util.title = function (titleText) {
  const processTitle = process.env.VUE_APP_TITLE || 'D2Admin'
  window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`
}
/**
 * @description 打开新页面
 * @param {String} url 地址
 */
util.open = function (url) {
  var a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'd2admin-menu-link')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById('d2admin-menu-link'))
}
/**
 * @description 处理接口
 * @param {Array} interfaces 接口
 */
util.formatInterfaces = function (interfaces) {
  let i = {}
  i["GET"] = interfaces.filter(s => s.method.toUpperCase() === "GET").map(s => parse(s.path))
  i["POST"] = interfaces.filter(s => s.method.toUpperCase() === "POST").map(s => parse(s.path))
  i["PUT"] = interfaces.filter(s => s.method.toUpperCase() === "PUT").map(s => parse(s.path))
  i["DELETE"] = interfaces.filter(s => s.method.toUpperCase() === "DELETE").map(s => parse(s.path))
  return i
}

util.formatMenus = function (aMenu, parentPath) {
  if (validatenull(aMenu)) {
    return []
  }
  const menus = []
  aMenu.forEach(oMenu => {
    const {
      path,
      name,
      icon,
      children
    } = oMenu
    const menu = {
      path: parentPath ? parentPath + '/' + path : path,
      title: name,
      icon: icon
    }
    if (children && children.length > 0) {
      menu.children = validatenull(children) ? [] : util.formatMenus(children, path)
    }
    menus.push(menu)
  })
  return menus
}

/**
 * 通过用户菜单生成路由信息
 *
 * @param {用户菜单} aMenu
 */
util.formatRoutes = function (aMenu, parentPath) {
  if (validatenull(aMenu)) {
    return []
  }
  const aRouter = []
  aMenu.forEach(oMenu => {
    const {
      path,
      component,
      name,
      children
    } = oMenu

    if (!validatenull(component)) {
      const oRouter = {
        path: parentPath ? parentPath + '/' + path : path,
        component(resolve) {
          let componentPath = ''
          if (component === 'Layout') {
            require(['@/layout/header-aside'], resolve)
            return
          } else {
            componentPath = component
          }
          require([`@/${componentPath}.vue`], resolve)
        },
        name: name,
        meta: {
          cache: true,
          title: name
        }
      }
      if (!validatenull(children)) {
        oRouter.children = util.formatRoutes(children, path)
      }
      aRouter.push(oRouter)
    }
  })
  return aRouter
}

export default util
