// polyfill
import 'babel-polyfill'
// Vue
import Vue from 'vue'
import App from './App'
// store
import store from '@/store/index'
// 模拟数据
// import '@/mock'
// 多国语
import i18n from './i18n'
// 核心插件
import d2Admin from '@/plugin/d2admin'

import SplitPane from 'vue-splitpane'

// import 'iview/dist/styles/iview.css'
// 路由
import router from './router'
// 全局filter
import * as filters from './filters'

import { online } from '@/api/keycabinet/keyCabinet'
// 核心插件
Vue.use(d2Admin, { store })

Vue.component('SplitPane', SplitPane)
// 全局filter
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  created () {
    setInterval(() => {
      online().then(response => {
        if (response.status === 'SUCCEED') {
          let result = response.result
          let keys = Object.keys(result)
          let msg = ''
          let show = false
          keys.forEach(key => {
            if (result[key] == null) {
              show = true
              msg += key + '离线<br/>'
            }
          })
          if (show) {
            let file = '/12146.mp3'
            let mp3 = new Audio(file)
            mp3.play()
            this.$notify({
              title: '警告',
              dangerouslyUseHTMLString: true,
              message: msg,
              type: 'warning'
            })
          }
        }
      })
    }, 120000)
  },
  mounted () {
    console.log('main mounted')
    // 展示系统信息
    this.$store.commit('d2admin/releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('d2admin/account/load')
    // 获取并记录用户 UA
    this.$store.commit('d2admin/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('d2admin/fullscreen/listen')
  },
  watch: {
    // '$route.matched'(val) {
    //   let fullAside = this.$store.state.d2admin.menu.fullAside
    //   const _side = fullAside.filter(menu => menu.path === val[0].path)
    //   this.$store.commit('d2admin/menu/asideSet', _side.length > 0 ? _side[0].children : [])
    // }y
  }
}).$mount('#app')
