import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import Register from '../views/Register.vue'
import Forgot from '../views/Forgot.vue'
import CreateVote from '../views/CreateVote.vue'
import Vote from '../views/Vote.vue'
import MyVotes from '../views/MyVotes'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  component: Index,
}, {
  path: '/register',
  component: Register
}, {
  path: '/forgot',
  component: Forgot
}, {
  path: '/vote-create',
  component: CreateVote
}, {
  path: '/vote/:id',
  component: Vote
}, {
  path: '/myvotes',
  component: MyVotes
}]

const router = new VueRouter({
  routes
})

export default router
