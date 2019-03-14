<template>
  <div id="app">
    <router-view/>
    <commFooter v-if="!$route.meta.hideFooter"></commFooter>
  </div>
</template>

<script>
  import commFooter from './components/common/footerC'
  export default ({
      components: {
          commFooter,
      }
  })
</script>

<style lang="less">
// #app {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
// }
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.content {
  margin-top: 3.3rem;
}
</style>
