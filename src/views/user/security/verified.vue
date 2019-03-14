<template>
    <section>
      <van-nav-bar
        title="实名认证"
        left-arrow
        fixed
        @click-left="$back()"
      />
      <div class="content">
        <div class="edit-guide" v-if="realNameStatus === 0 || realNameStatus === 3">
          <i class="icon-idcard"></i>
          <p>您还没有实名认证</p>
          <router-link class="btn" to="/verifiedEdit">立即实名认证</router-link>
        </div>
        <div class="info"  v-if="realNameStatus === 1 || realNameStatus === 2">
          <ul>
            <li>
              <i class="icon-verified"></i>
              <label>{{userData.chnName}}</label>
            </li>
            <li>
              <i class="icon-idcard"></i>
              <label>{{userData.idCard}}</label>
            </li>
          </ul>

          <a class="btn disabled" v-if="realNameStatus === 1" href="javascript: void (0);">正在审核</a>

        </div>

        <p class="noticeMsg">为了保障您的账户安全，身份信息绑定后不可修改</p>
      </div>
    </section>
</template>

<script>
  export default {
    name: "verified",
    data() {
      return {
        userData: {}, //个人信息
        realNameStatus: 0, //实名认证状态
      }
    },
    mounted() {
      this.getUserData();
    },
    methods: {
      getUserData() { //获取个人信息
        this.$axios.post('/api/user/query_user_msg').then(res => {
          if (res.data.errorCode === 0) {
            this.userData = res.data.data;
            this.realNameStatus = res.data.data.authStatus;
          }
        })
      },
    }
  }
</script>

<style scoped>
  /*未实名*/
  .edit-guide {
   text-align: center;
   padding: 0.6rem 1rem;
 }
  .edit-guide i {
    color: #e0e0e0;
    font-size: 14rem;
  }
  .edit-guide p {
    font-size: 1rem;
    margin-top: 0.2rem;
    color: #212121;
  }
  .edit-guide > span {
    display: block;
    text-align: center;
    font-size: 0.85rem;
    color: #adadad;
  }
  /*按钮*/
  a.btn {
    margin-top: 1.5rem;
    background-color: #ff5e00;
    border-radius: 0.3rem;
    color: #fff;
    height: 2.6rem;
    line-height: 2.6rem;
    padding: 0 0.5rem;
    font-size: 0.85rem;
    text-align: center;
    outline: none;
    border: none;
    display: block;
    width: 100%;
  }
  .disabled {
    background: #c7c7c7 !important;
    border: 1px solid #c7c7c7 !important;
    color: #fff !important;
  }
  /*已实名*/
  .info ul {
   margin-bottom: 1rem;
  }
  .info li {
    background-color: #fff;
    padding: 0 1.4rem;
    height: 3.4rem;
    border-bottom: 1px solid #f1f2f3;
    display: flex;
    align-items: center;
  }
  .info i {
    color: #ff5e00;
    font-size: 1.4rem;
    width: 12%;
  }
  .info label {
    font-size: 0.9rem;
  }
  .noticeMsg {
    color: #adadad;
    text-align: center;
    padding-top: 1rem;
    line-height: 2;
  }
</style>
