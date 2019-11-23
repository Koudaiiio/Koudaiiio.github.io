<template>
  <div v-if="Object.keys(vote.info).length">
    <div class="votePage">
      <div class="voteCenter">
        <div class="avatar"><a-avatar :size="88" style="boxShadow: 0 0 3px black;" :src="vote.info.avatar" /> <span class="userInfo"><strong>{{ vote.info.name }}</strong>  发起的投票</span></div>
        <div class="deadline">投票截止日期: {{ vote.info.deadline }}</div>
        <strong class="title">{{ vote.info.title }}</strong>
        
        <div class="options">
          <a-radio-group v-model="voteid"  style="display: block;">
            <div class="option" v-for="(option,idx) of vote.options" :key ="idx">
              <a-radio :value="option.id">  <span style="font-size: 20px;">{{ option.content }} - {{ summary[option.id].length }} 票 ({{ ratioSummary[option.id] * 100}}%)</span></a-radio>
              <div class="ratio" style="height: 5px; backgroundColor: blue; borderRadius: 5px; transition: .3s;" :style="{width: ratioSummary[option.id] * 90 + '%'}"></div>
            </div>
          </a-radio-group>
        </div>

        <div class="submit">
          <a-button type="primary" @click="voteup(voteid)">提交</a-button>
        </div>
        <div class="back">
          <a-button type="link" @click="back">返回首页<a-icon type="right"></a-icon></a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .votePage {
    overflow: hidden;
  }
  .voteCenter {
    margin: auto;
    margin-top: 15vh;
    width: 90vw;
    max-width: 550px;
    max-height: 70vh;
    border-radius: 4%;
    background-color: #fff6;
    padding: 4vw;
    position: relative;
  }
  .avatar {
    position: relative;
  }
  .userInfo {
    font-size: 20px;
    position: absolute;
    bottom: 0;
  }
  .userInfo strong {
    font-size: 30px;
  }
  .deadline {
    font-size: 15px;
  }
  .deadline::after {
    display: block;
    height: 1px;
    width: 100%;
    margin: auto;
    box-shadow: inset 0 0 2px;
    content: ''
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
  .title {
    font-size: 30px;
  }
  .ratio {
    margin-left: 25px;
  }
  .submit {
    margin-top: 20px;
  }
  .options {
    overflow-y: auto;
    max-height: 30vh;
  }
  .option {
    margin-top: 15px;
    margin-bottom: 5px;
    transition: .3s;
    padding: 5px;
  }
  .back {
    position: absolute;
    right: 0;
    bottom: 0;
  }
</style>

<script>
import io from 'socket.io-client'
import api from '../api.js'
import mapValues from 'lodash/mapValues'
import uniqBy from 'lodash/uniqBy'
import keyBy from 'lodash/keyBy'
import groupBy from 'lodash/groupBy'
export default {
  data() {
    return {
      voteid: '',
      vote: {
        userInfo: {},
        info: {},
        options: [],
        voteups: [],
      }
    }
  },
  watch: {
    '$route': 'init'
  },
  mounted() {
    //debugger;
    this.init()
  },
  methods: {
    async init() {
      var id = this.$route.params.id
      var request = await api.get('/vote/' + id)
      var data = request.data

      data.info.avatar = data.info.avatar ? data.info.avatar : '../assets/default.jpg'
      
      data.info.deadline = new Date(data.info.deadline).toLocaleString()
      this.vote = data
      
      this.vote.voteups = uniqBy(this.vote.voteups, 'userid')
      
      // debugger;
      var ary = this.vote.voteups.filter(it => {
        return it.name == this.vote.userInfo.name
      })

      if (ary.length) {
        this.voteid = ary[0].optionid
      }

      this.socket = io('/')
      this.socket.emit('select room', id)

      this.socket.on('new vote', data => {
        this.vote.voteups = this.vote.voteups.filter(it => it.userid != data.userid)
        this.vote.voteups.push(data)
      })

      this.$forceUpdate()
    },
    async voteup(optionid) {
      try {
        await api.post('/voteup', {
          optionid,
          voteid: this.vote.info.id
        })
      } catch(e) {
        alert(e.response.data.msg)
        if (e.response.data.code == -1) {
          this.$router.push('/')
        }
      }
    },
    back() {
      this.$router.push('/')
    }
  },
  computed: {
    summary() {
      var obj = mapValues(keyBy(this.vote.options, 'id'), () => [])

      return {
        ...obj,
        ...groupBy(this.vote.voteups, 'optionid')
      }
    },
    ratioSummary() {
      return mapValues(this.summary, (voteups) => {
        if (voteups.length == 0) {
          return 0
        }
        return Math.ceil((voteups.length / this.vote.voteups.length) * 1000) / 1000
      })
    }
  }
}
</script>