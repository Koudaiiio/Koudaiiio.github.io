import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  component: Index,
}, {
  path: '/register',
  component: () => import('../views/Register.vue')
}, {
  path: '/forgot',
  component: () => import('../views/Forgot.vue')
}, {
  path: '/vote-create',
  component: () => import('../views/CreateVote.vue')
}, {
  path: '/vote/:id',
  component: () => import('../views/Vote.vue')
}, {
  path: '/myvotes',
  component: () => import('../views/MyVotes')
}]

const router = new VueRouter({
  routes
})

export default router
