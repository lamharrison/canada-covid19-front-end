import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import home from './pages/home'
import store from './pages/store'
import storesingle from './pages/storesingle'
import storeup from './pages/storeup'
import fullchart from './pages/fullchart'


// Router, ready for multiple page

export default new VueRouter({
  mode: 'hash',
  base: "/",
  routes: [
    // Home
    { path:'/', name:'home', component: home },
    { path:'/index.html', name:'index', redirect: home },
    { path:'/index', name:'index', redirect: home },

  ]
})
