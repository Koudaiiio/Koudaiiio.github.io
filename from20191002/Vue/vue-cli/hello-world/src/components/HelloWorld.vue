<template>
  <div class="hello">
    <div class="navbar">
    </div>
    <div class="main">
      <div class="header">
        <router-link to='/tab=all'>全部</router-link>
        <router-link to='/tab=good'>精华</router-link>
        <router-link to='/tab=share'>分享</router-link>
        <router-link to='/tab=ask'>问答</router-link>
        <router-link to='/tab=job'>招聘</router-link>
      </div>
      <div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>


<script>
  // readFile('https://cnodejs.org/api/v1/topics')

  var tem = `
    <div>
      <div v-if="done == null">Loading...</div>
      <ul v-else class="topicList">
        <li v-for="(topic, idx) in topics" :key="idx" class="cell">
          <img :src="topic.author.avatar_url">
          <span>{{topic.reply_count}}/{{topic.visit_count}}</span>
          <span style="backgroundColor: gray;">{{topic.tab}}</span>
          <span>{{topic.title}}</span>
          <span>{{topic.last_reply_at}}</span>
        </li>
      </ul>
    </div>
  `

  const List = {
    template: tem,
    data() {
      return {
        topics: null,
        path: 'https://cnodejs.org/api/v1/topics?page=1&limit=10&',
        done: null,
      }
    },
    created() {
      this.getTopics()
    },
    watch: {
      '$route': 'getTopics'
    },
    methods: {
      getTopics() {
        // debugger;
        var path = this.path + this.$route.fullPath.slice(1)
        console.log(path)
        console.log(this.$route)
        console.log(this.$router)
        console.log(Date.now())
        var xhr = new XMLHttpRequest()
        xhr.open('GET', path)
        xhr.onload = () => {
          this.topics = JSON.parse(xhr.response).data
          console.log(this.topics)
          this.done = true
        }
        xhr.send()
      }
    }
  }

  const ListGood = {
    template: tem,
    data() {
      return {
        topics: null,
        done: null,
      }
    },
    created() {
      this.getTopics()
    },
    watch: {
      '$route': 'getTopics'
    },
    methods: {
      getTopics() {
        debugger;
        console.log(1)
        var xhr = new XMLHttpRequest()
        xhr.open('GET', 'https://cnodejs.org/api/v1/topics')
        xhr.onload = () => {
          debugger;
          this.topics = JSON.parse(xhr.response).data.filter(it => it.good).slice(0, 10)
          console.log(this.topics)
          this.done = true
        }
        xhr.send()
      }
    }
  }
  // const Ask = {
  //   template: tem,
    
  // }
  // const Share = {
  //   template: tem,
    
  // }
  // const Job = {
  //   template: tem,
    
  // }
  // const Good = {
  //   template: tem,
    
  // }

  const NotFound = {
    template:`
      <div>40000000</div>
    `
  }

  const router = new VueRouter({
    // base: '/',
    routes: [
      // { path: '*', component: NotFound},
      { path: '/', redirect: '/tab=all'},
      { path: '/tab=all', component: List},
      { path: '/tab=ask', component: List},
      { path: '/tab=share', component: List},
      { path: '/tab=job', component: List},
      { path: '/tab=good', component: ListGood},
    ]
  })

  var app = new Vue({
    router,
    el: '#app'
  })

</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.navbar {
  background-color: #fff;
}
</style>
