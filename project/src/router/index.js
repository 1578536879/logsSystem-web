import Vue from 'vue'
import Router from 'vue-router'
import login from "../../pages/login"
import register from '../../pages/register'
import menu from '../../components/menu'
import applicationList from '../../pages/homepage/applicationList'
import person from '../../pages/homepage/person'
import addApplication from '../../pages/homepage/addApplication'
import applicationInfo from '../../pages/application/information'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/login',
      name: 'login',
      component: login
    },{
      path: '/register',
      name: 'register',
      component: register
    },{
      path: '/menu',
      name: 'menu',
      component: menu
    },{
      path: '/homepage/applicationList',
      name: 'applicationList',
      component: applicationList
    },{
      path: '/homepage/person',
      name: 'person',
      component: person
    },{
      path: '/homepage/addApplication',
      name: 'addApplication',
      component: addApplication
    },{
      path: '/application/information',
      name: 'applicationInfo',
      component: applicationInfo
    },
  ]
})
