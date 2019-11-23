import Vue from 'vue'

import Button from 'ant-design-vue/lib/button'
import 'ant-design-vue/lib/button/style/css'

import Icon from 'ant-design-vue/lib/icon'
import 'ant-design-vue/lib/icon/style/css'

import Input from 'ant-design-vue/lib/input'
import 'ant-design-vue/lib/input/style/css'

import Radio from 'ant-design-vue/lib/radio'
import 'ant-design-vue/lib/radio/style/css'

import Select from 'ant-design-vue/lib/select'
import 'ant-design-vue/lib/select/style/css'

import Avatar from 'ant-design-vue/lib/avatar'
import 'ant-design-vue/lib/avatar/style/css'

import DatePicker from 'ant-design-vue/lib/date-picker'
import 'ant-design-vue/lib/date-picker/style/css'

import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

Vue.use(Button)
Vue.use(Icon)
Vue.use(Input)
Vue.use(Radio)
Vue.use(Select)
Vue.use(Avatar)
Vue.use(DatePicker)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
