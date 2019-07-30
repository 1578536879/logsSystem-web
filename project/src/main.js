// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // components: { register },
  // render: h => h(menu),
  template: '<router-view></router-view>'
})
// Vue.component('home-menu',{
//   template: homeMenu
// })
