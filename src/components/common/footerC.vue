<template>
    <div class="footerWrap">
      <ul class="footerContainer">
        <li><router-link to="/" exact><i class="icon-home"></i><span>首页</span></router-link></li>
        <li><router-link to="/trade"><i class="icon-trade"></i><span>策略</span></router-link></li>
        <li><router-link to="/optional"><i class="icon-optional"></i><span>自选</span></router-link></li>
        <li><router-link to="/user"><i class="icon-user"></i><span>我的</span></router-link></li>
      </ul>
    </div>
</template>

<script>
    export default {
      name: "footerC",
      computed: {
        router() {
          return this.$route.path;
        }
      },
    }
</script>

<style scoped>
  a.router-link-active {
    color: #ff5e00 ;
  }
  .footerWrap {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: 600px;
    margin: auto;
    background: #f3f4fa;
    color: #999;
    font-size: .7rem;
    border-top: 1px solid #e0e0e0;
  }
  .footerWrap i {
    font-size: 1.1rem;
    line-height: 1;
  }
  .footerWrap span {
    display: inline-block;
    padding-top: .3rem;
  }
  .footerContainer {
    margin: auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .footerContainer a {
    display: inline-block;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: .5rem 0;
  }
</style>
