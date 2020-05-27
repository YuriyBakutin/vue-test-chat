import Vue from 'vue'
import Router from 'vue-router'

Vue.use( Router )

const router = new Router( {
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import( /* webpackChunkName: "about" */ './views/Login.vue' ),
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import( /* webpackChunkName: "about" */ './views/Chat.vue' ),
    },
  ],
} )

router.beforeEach( ( to, from, next ) => {
  if ( to.path != '/chat' && to.path != '/login' ) {
    next( { path: '/login' } )
  } else {
    next()
  }
} )

export default router
