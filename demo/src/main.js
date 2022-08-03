import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入全局的样式文件
import './assets/css/global.less'
// 引入全局的图标文件
import './assets/font/iconfont.css'

import axios from  'axios'

//将axios挂载到vue原型上
//在别的组件使用  this.$http即可
Vue.prototype.$http=axios

// 将全局的echarts对象挂载到vue原型上
// 在别的组件使用直接 this.$echarts
Vue.prototype.$echarts=window.echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
