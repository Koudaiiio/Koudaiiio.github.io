<template>
  <div class="registPage">
    <div class="registMid">
      <div style="display: inline-block" class="avatar">
        <label class="uploadAvatar" for="avatar"></label>
        <input name="avatar" id="avatar" type="file" accept="image/*" style="display: none;" @change="handleAvatar">
      </div>
      <div class="infoInput"><a-input v-model="userInfo.name" placeholder="用户名" @input="clear" /><span v-if="registInfo" style="color: red;">{{registInfo}}</span></div>
      <div class="infoInput"><a-input v-model="userInfo.email" placeholder="邮箱" /></div>
      <div class="infoInput"><a-input type="password" v-model="userInfo.password" placeholder="密码" /></div>
      <div class="registButton"><a-button @click="submit" type="primary" block>注册</a-button></div>
      <div class="back"><router-link to='/'>已有账号，直接登录></router-link></div>
    </div>
  </div>
</template>

<style scoped>

    .avatar {
      margin-top: 5%;
      margin-left: 50%;
      transform: translate(-50%);
    }
  
    .uploadAvatar {
      transition: .3s;
      color: transparent;
      overflow: hidden;
      display: block; 
      height: 100px; 
      width: 100px; 
      box-shadow: 0 0 5px black; 
      border-radius: 100%; 
      line-height: 100px; 
      text-align: center; 
      background-image: url('../assets/default.jpg');
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      cursor: pointer;
    }

    .uploadAvatar::before {
      opacity: 0;
      content: '上传头像';
      color: black;
      display: block;
      width: 100%;
      height: 100%;
      transition: .3s;
      background-color: rgba(255, 255, 255, 0.781);
    }

    .uploadAvatar:hover::before { 
      opacity: 1;
    }

    .registPage {
      height: 100%;
      width: 100%;
      overflow: hidden;
    }

    .eye {
      position: absolute;
      right: 0;
      cursor: pointer;
    }

    .registMid {
      max-width: 400px;
      width: 90vw;
      /* height: 300px; */
      border-radius: 10px;
      box-shadow: 0 0 3px black;
      background-color: #fff3;
      margin: auto;
      margin-top: 20vh;
      overflow: hidden;
      position: relative;
    }

    .registButton {
      width: 70%;
      margin: auto;
      margin-top: 8%;
      margin-bottom: 10%;
    }
    
    .infoInput {
      width: 70%;
      margin: auto;
      margin-top: 8%;
      position: relative;
    }

    .infoInput span {
      float: right;
    }

    .back {
      float: right;
      margin-right: 3%;
      margin-bottom: 1%;
    }

    .back a {
      color:rgba(255, 255, 255, 0.781);
    }
</style>

<script>
import api from '../api'
export default {
  data() {
    return {
      registInfo: null,
      userInfo: {
        avatar: '',
        name: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async submit() {
      // console.log(this.userInfo)
      let formData = new FormData()
      var userInfo = this.userInfo
      formData.append('avatar', userInfo.avatar)
      formData.append('name', userInfo.name)
      formData.append('email', userInfo.email)
      formData.append('password', userInfo.password)
      // userInfo.__proto__ = FormData.prototype
      try {
        await api.post('/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        alert('注册成功')
        this.$router.push('/')
      } catch(e) {
        // console.dir(e)
        this.registInfo = e.response.data.msg
      }
    },

    handleAvatar(e) {
      var input = e.target
      var file = input.files[0]
      input.previousElementSibling.style.backgroundImage = "url(" + URL.createObjectURL(file) + ")"
      this.userInfo.avatar = file
    },

    clear() {
      this.registInfo = ''
    }
  }
}
</script>