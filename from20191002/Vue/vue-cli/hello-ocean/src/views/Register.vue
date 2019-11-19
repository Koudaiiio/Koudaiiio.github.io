<template>
  <form action="/register" method="post">
    用户名：<input type="text" @input="getname" name="name" /> <br>
    邮箱：<input type="text" @input="getemail" name="email" /> <br>
    密码：<input type="text" @input="getpassword" name="password" /> <br>
    <button @click.prevent="post">提交</button>
  </form>
</template>

<script>
export default {
  name: 'register',
  data: {
    username: String,
    email: String,
    password: String,
  },
  methods: {
    post() {
      debugger;
      console.log(this.data)
    },
    getname() {
      this.username = event.target.value
    },
    getemail() {
      this.useremail = event.target.value
    },
    getpassword() {
      this.userpassword = event.target.value
    },
  },

};
</script>
