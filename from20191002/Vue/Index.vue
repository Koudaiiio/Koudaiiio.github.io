
<style lang="scss" scoped>
  .a {
    width: 300px;
  }
</style>

<template>
  <div :class="{a: true}">
    <Slider foo="bar" :baz="baa"></Slider>
  </div>
</template>

<script>
import { Slider } from './slider.vue'

export default {
  data() {
    return {

    }
  },
  computed: {

  },
  methods: {

  },
  watch: {

  }
}
</script>