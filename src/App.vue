<template>
  <div id="app">
<!--    <login></login>-->
    <router-view></router-view>
  </div>
</template>

<script>
import login from "./components/login";
import home from "./components/home";
export default {
  name: 'App',
  components: {
    login,
  }
}
</script>

<style>
*{
  margin: 0;
}
html,body{
height: 100%;
}
#app{
  height: 100%;
}
/*body{*/
/*  background-color: beige;*/
/*}*/
/*#app {*/
/*  font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
/*  -webkit-font-smoothing: antialiased;*/
/*  -moz-osx-font-smoothing: grayscale;*/
/*  text-align: center;*/
/*  color: #2c3e50;*/
/*  margin-top: 60px;*/
/*}*/
</style>
