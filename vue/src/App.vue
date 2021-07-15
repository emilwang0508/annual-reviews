<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
const mixin = {
  data () {
    return {
      b:2,
      info: {
        name: 'Emil'
      }
    }
  },
  created () {
    console.log('mixin created')
  }
}
export default {
  name: 'App',
  components: {
    // HelloWorld
  },
  mixins: [mixin],
  data () {
    return {
      b:1,
      a:3,
      info: {
        age: 10,
        // name: 'bob'
      }
    }
  },
  created () {
    console.log('app created')
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
