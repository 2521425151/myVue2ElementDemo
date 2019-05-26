<template>
  <div id="app">
    <Header v-if="isShow" />
    <Menu v-if="isShow" />
    <keep-alive :include="includes">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
  import Header from './components/Header'
  import Menu from './components/Menu'

export default {
  name: 'app',
  components: {
    Header,
    Menu
  },
  data(){
    return{
      isShow:true,
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
