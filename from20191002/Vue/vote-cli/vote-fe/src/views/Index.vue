<template>
  <div v-if="isLogin" class="userPage">
    <div class="userCenter">
      <!-- <div class="user-avatar"><a-avatar :size="80" style="box-shadow: 0 0 2px black;" :src="'http://localhost:443/' + userInfo.avatar" /></div> -->

      <div style="display: inline-block" class="avatar">
        <label class="uploadAvatar" :style="{backgroundImage: 'url(/' + userInfo.avatar + ')'}" for="avatar"></label>
        <input name="avatar" id="avatar" type="file" accept="image/*" style="display: none;" @change="handleAvatar">
      </div>

      <div class="user-name">{{ userInfo.name }}</div>
      <div class="choseBar">
        <div><a-button type="primary" block><router-link to="/vote-create">创建投票</router-link></a-button></div>
        <div><a-button block><router-link to="/myvotes">我的投票</router-link></a-button></div>
        <div><a-button type="danger" block @click="logout">登出</a-button></div>
      </div>
    </div>
  </div>
  <div v-else class="loginPage">
    <span class="title">Vote</span>
    <div class="loginMid">
      <div class="infoInput">
        <a-input type="text" v-model="userInfo.name" placeholder="用户名">
          <a-icon slot="prefix" type="user"></a-icon>
        </a-input>
      </div>
      <div class="infoInput">
        <a-input type="password" v-model="userInfo.password" placeholder="密码">
          <a-icon slot="prefix" type="lock"></a-icon>
        </a-input>
      </div>
      <div class="captcha">
        <a-input type="text" v-model="userInfo.captcha" placeholder="验证码">
          <a-icon slot="prefix" type="key"></a-icon>
        </a-input>
        <img class="captchapic" src="/captcha" alt="验证码" @click="refresh">
      </div>
      <span class="forgot"><router-link to="/forgot">忘记密码？</router-link></span>
      <div class="login"><a-button @click="login" type="primary" style="width: 100%; height: 100%;">登陆</a-button></div>
      <div class="regist"><a-button style="width: 100%; height: 100%;"><router-link to="/register">注册</router-link></a-button></div>
    </div>
  </div>
</template>

<style scoped>
    .avatar {
      left: 50%;
      top: 0;
      transform: translate(-50%, -40%);
      position: absolute;
    }
  
    .uploadAvatar {
      transition: .3s;
      color: transparent;
      overflow: hidden;
      display: block; 
      height: 90px; 
      width: 90px; 
      box-shadow: 0 0 5px black; 
      border-radius: 100%; 
      line-height: 90px; 
      text-align: center;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      cursor: pointer;
    }

    .uploadAvatar::before {
      opacity: 0;
      content: '更改头像';
      color: black;
      display: block;
      width: 100%;
      height: 100%;
      transition: .3s linear;
      background-color: rgba(255, 255, 255, 0.781);
    }

    .uploadAvatar:hover::before {
      opacity: 1;
    }
</style>

<style scoped>
  .userPage {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;
  }
  .userCenter {
    margin: auto;
    margin-top: 20vh;
    width: 90vw;
    max-width: 400px;
    height: 350px;
    background-color: #fff4;
    border-radius: 5%;
    position: relative;
    box-shadow: 0 0 3px black;
  }
  .user-avatar {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    top: -30px;
  }
  .user-name {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    top: 15%;
    font-size: 33px;
  }
  .choseBar {
    position: absolute;
    bottom: 15%;
    width: 100%;
  }
  .choseBar > div {
    margin: auto;
    width: 80%;
    /* height: 6vh; */
    margin-top: 33px;
  }
</style>

<style scoped>
  .main {
    text-align: center;
  }
  .loginPage {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .title {
    font-size: 60px;
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    top: 7vh;
    color: #eeea;
  }
  .loginMid {
    max-width: 400px;
    width: 90vw;
    height: 300px;
    border-radius: 5%;
    box-shadow: 0 0 3px black;
    background-color: #fff3;
    margin: auto;
    margin-top: 20vh;
    overflow: hidden;
    position: relative;
  }
  .infoInput {
    width: 80%;
    margin: auto;
    margin-top: 35px;
  }
  .captcha {
    width: 35%;
    margin-left: 10%;
    margin-top: 35px;
    position: relative;
  }
  .captchapic {
    position: absolute;
    left: 100%;
    top: -9px;
    cursor: pointer;
  }
  .forgot a {
    position: absolute;
    right: 10%;
    top: 48%;
    color: #111;
  }
  .forgot a:hover {
    color: white;
  }
  .login {
    position: absolute;
    top: 78%;
    left: 11%;
    width: 33%;
    height: 13%;
  }
  .regist {
    position: absolute;
    top: 78%;
    right: 11%;
    width: 33%;
    height: 13%;
  }
</style>

<script>
import api from '../api'
export default {
  data() {
    return {
      isLogin: null,
      captchaSvg: '',
      userInfo: {
        name: '',
        password: '',
        avatar: '',
        captcha: '',
      }
    }
  },
  methods: {
    refresh(e) {
      e.target.src="/captcha"
    },
    async login() {
      try {
        var response = await api.post('/login', this.userInfo)
        if (response.data.code == -1) {
          alert('验证码错误')
          document.querySelector('.captchapic').click()
          return
        }
        // console.log(response)
        this.userInfo = response.data
        this.userInfo.avatar = this.userInfo.avatar ? this.userInfo.avatar : './default.jpg'
        this.isLogin = true
      } catch(e) {
        alert(e.response.data.msg)
      }
    },
    async logout() {
      await api.get('/logout')
      this.isLogin = null
      this.userInfo = {
        name: '',
        password: ''
      }
    },
    async handleAvatar(e) {
      var input = e.target
      var file = input.files[0]
      let formData = new FormData()
      formData.append('avatar', file)
      try {
        var response = await api.post('/change-avatar', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        })
        // debugger;
        this.userInfo.avatar = response.data.avatar
        // input.previousElementSibling.style.backgroundImage = "url(" + URL.createObjectURL(file) + ")"
        alert('头像更改成功！')
      } catch(e) {
        alert('上传失败')
      }
    }
  },

  async mounted() {
    // debugger;
    try {
      var response = await api.get('/userinfo')
      // console.log(response)
      this.userInfo = response.data
      // console.log(this.userInfo)
      this.userInfo.avatar = this.userInfo.avatar ? this.userInfo.avatar : '../assets/default.jpg'
      this.isLogin = true
    } catch(e) {
      return
    }
  }
}
</script>