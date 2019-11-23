<template>
  <div class="createPage">
    <div class="createCenter">
      <h1>创建投票</h1>
      <div class="title"><a-input type='text' v-model="voteInfo.title" placeholder="标题" /></div>
      <div class="title"><a-input type='text' v-model="voteInfo.desc" placeholder="补充描述(选填)" /></div>
      <div class="options">
        <div v-for="(option, idx) of voteInfo.options" :key="idx">
          <a-input-search type="text" allowClear v-model="voteInfo.options[idx]" :placeholder="'选项' + (idx + 1)" @search="voteInfo.options.splice(idx, 1)">
            <a-button slot="enterButton" @click="voteInfo.options.splice(idx, 1)"><a-icon style="color:red;" theme="twoTone" twoToneColor="red" type="minus-circle" /></a-button>
          </a-input-search>
        </div>
      </div>
      <div class="addOption"><a-button @click="voteInfo.options.push('')">添加选项</a-button></div>
      <div class="deadline">截止时间： <a-date-picker showTime :disabledDate="disabledDate" placeholder="Select Time" @ok="getDeadline" disable/></div>
      <div class="anonymous">
        <a-radio-group name="anonymous" v-model="voteInfo.anonymous">
          <a-radio :value="0"> 实名</a-radio>
          <a-radio :value="1"> 匿名</a-radio>
        </a-radio-group>
      </div>

      <div class="single">
        <a-select v-model="voteInfo.singleSelection" style="width: 100px">
          <a-select-option value="1">单选</a-select-option>
          <a-select-option value="0">多选</a-select-option>
        </a-select>
      </div>

      <div class="createButton">
        <a-button type="primary" @click="submit">点击创建</a-button>
      </div>
    </div>

  </div>
</template>

<style scoped>
  .createPage {
    overflow: hidden;
  }
  .createCenter {
    margin: auto;
    margin-top: 10vh;
    width: 90vw;
    max-width: 550px;
    /* max-height: 70vh; */
    border-radius: 4%;
    background-color: #fff6;
    padding: 4vw;
    position: relative;
  }
  ::-webkit-scrollbar {
    width: 6px;
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #5555;
  }
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
  }
  .createCenter > * {
    position: relative;
  }
  .title {
    margin-top: 2vh;
  }
  .options {
    margin-top: 3vh;
    overflow: auto;
    max-height: 25vh;
  }
  .options > div {
    margin-top: 1vh;
  }
  .deadline {
    font-size: 15px;
    margin-top: 1vh;
  }
  .addOption, .anonymous, .single {
    margin-top: 1vh;
  }
  .createButton {
    margin: auto;
    margin-top: 1vh;
    text-align: center;
  }
</style>

<script>
import api from '../api.js'
export default {
  data() {
    return {
      voteInfo: {
        title: '',
        desc: '',
        options: ['', ''],
        deadline: '',
        anonymous: '',
        singleSelection: ''
      }
    }
  },
  methods: {
    async submit() {
      if (this.voteInfo.deadline.length == 0) {
        alert('请选择截止日期！')
        return
      }
      //debugger;
      try {
        var response = await api.post('/vote', this.voteInfo)
        var id = response.data.id
        this.$router.push('/vote/' + id)
      } catch(e) {
        alert('请先登录！')
        this.$router.push('/')
      }
    }, 
    disabledDate(current) {
    // Can not select days before today and today
      return current && current < Date.now()
    },
    getDeadline(time) {
      this.voteInfo.deadline = time._d
    }
  }
}
</script>

<style scoped>

</style>