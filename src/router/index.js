import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import NewUser from '@/components/NewUser'
import Operations from '@/components/Operations'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Status from '@/components/Status'
import firebase from "firebase"

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        requresGuest: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        requresGuest: true
      }
    },
    {
      path: '/new',
      name: 'new-user',
      component: NewUser,
      meta: {
        requresAuth: true
      }
    },
    {
      path: '/status',
      name: 'status',
      component: Status,
      meta: {
        requresAuth: true
      }
    },
   
    {
      path: '/operations',
      name: 'operations',
      component: Operations,
      meta: {
        requresAuth: true
      }
    }
  ]
})

// Nav guards
router.beforeEach((to, from, next) => {
  // Check for requiredAuth guard
  if(to.matched.some(record => record.meta.requresAuth)){
    //Check if NOT logged in
    if(!firebase.auth().currentUser){
      //Got to login
      next({
        path: '/login',
        query:{
          redirect: to.fullPath
        }
      });
    }else{
      // Prooced to the route
      next();
    }
  }else if(to.matched.some(record => record.meta.requresGuest)){
    //Check if ogged in
    if(firebase.auth().currentUser){
      //Got to login
      next({
        path: '/',
        query:{
          redirect: to.fullPath
        }
      });
    }else{
      // Prooced to the route
      next();
    }
  }
})

export default router;