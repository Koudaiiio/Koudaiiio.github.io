<template>
  <div class="myVotes">
    <div class="voteList">
      <div class="back"><a-button type="link" @click="back"><a-icon type="left"></a-icon>返回</a-button></div>
      <div class="List">
        <div class="ListItems" v-for="item of myVotes" :key="item.id" @click="jump(item.id)">
          <strong>{{ item.title }}</strong> <br/>
          <span class="desc">{{ item.desc }}</span><span class="nums">{{ item.nums }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .myVotes {
    overflow: hidden;
  }
  .voteList {
    margin: auto;
    margin-top: 15vh;
    width: 90vw;
    max-width: 400px;
    background-color: #fff6;
    border-radius: 4%;
    position: relative;
    box-shadow: 0 0 3px black;
    padding-bottom: 32px;
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
  .back button {
    color: #111a;
    font-size: 15px;
  }
  .back button:hover {
    color: #fffb;
  }
  .List {
    height: 60vh;
    overflow-y: auto;
    border-top: 1px solid;
    border-bottom: 1px solid;
  }
  .ListItems {
    /* border: 1px solid; */
    position: relative;
    padding: 3%;
    cursor: pointer;
    height: 74px;
    transition: .3s;
  }
  .ListItems:hover {
    box-shadow: inset 0 0 6px black;
  }
  .ListItems::after {
    display: block;
    height: 1px;
    width: 96%;
    margin: auto;
    /* background-color: #3336; */
    box-shadow: inset 0 0 2px #111a;
    content: '';
    position: absolute;
    top: 100%;
  }
  strong {
    font-size: 20px;
  }
  .desc {
    font-size: 15px;
  }
  .blank {
    line-height: 15px;
  }
  .nums {
    float: right;
    /* border: 1px solid; */
    line-height: 15px;
    padding: 3px;
    border-radius: 30%;
    font-size: 15px;
    background-color: rgb(24,143,227);
    color: #ddd;
  }
</style>

<script>
import api from '../api'
export default {
  data() {
    return {
      myVotes: [],
    }
  },
  async mounted() {
    try {
      var response = await api.get('/created-votes')
      this.myVotes = response.data
    } catch(e) {
      return
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    jump(id) {
      this.$router.push('/vote/' + id)
    }
  }
}
</script>