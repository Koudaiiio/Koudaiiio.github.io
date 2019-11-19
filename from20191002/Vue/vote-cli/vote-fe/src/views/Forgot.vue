<template>
  <div class="container">
    <div class="center">
      <a-input-search v-model="email" size="large" placeholder="输入您的注册邮箱" @search="confirm" allowClear enterButton="确认"><a-icon slot="prefix" type="mail"></a-icon></a-input-search>
    </div>
  </div>
</template>

<style scoped>
  .container {
    position: absolute;
    left: 50%;
    top: 35%;
    transform: translate(-50%);
    width: 90vw;
    border-radius: 10px;
    background-color: #fff6;
    padding: 12px;
    position: relative;
  }
</style>

<script>
import api from '../api'
export default {
  data() {
    return {
      email: ''
    }
  },
  methods: {
    async confirm(email) {
      // var data = await api.post('/forgot', this.email)
      this.email = email
      try {
        await api.post('/forgot', this.email)
        alert('邮件已发送')
      } catch(e) {
        alert('该邮箱未注册')
      }
    }
  }
}

</script>