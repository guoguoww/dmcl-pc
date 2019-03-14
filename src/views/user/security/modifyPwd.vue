<template>
    <section>
      <van-nav-bar
        title="修改密码"
        left-arrow
        fixed
        @click-left="$back()"
      />
      <div class="content">
        <ul class="form">
          <li>
            <span>旧密码</span>
            <input :type="oldPwdVisual? 'text': 'password'" placeholder="请输入密码" v-model="submitData.formerPwd">
            <i :class="oldPwdVisual? 'icon-visible' : 'icon-invisible'" @click="oldPwdVisual = !oldPwdVisual"></i>
          </li>
          <li>
            <span>新密码</span>
            <input :type="pwdVisual? 'text': 'password'" placeholder="请输入新密码" v-model="submitData.tradePassword">
            <i :class="pwdVisual? 'icon-visible' : 'icon-invisible'" @click="pwdVisual = !pwdVisual"></i>
          </li>
        </ul>
        <ul class="form">
          <li>
            <span>新密码确认</span>
            <input :type="confirmPwdVisual? 'text': 'password'" placeholder="请再次输入新密码" v-model="confirmPwd">
            <i :class="confirmPwdVisual? 'icon-visible' : 'icon-invisible'" @click="confirmPwdVisual = !confirmPwdVisual"></i>
          </li>
        </ul>
        <div class="submitBtn">
          <button class="forget_btn" @click="submitChangePwdData()">确定</button>
        </div>
      </div>
    </section>
</template>

<script>
  export default {
    name: "modifyPwd",
    data() {
      return {
        oldPwdVisual: false, //旧密码查看
        pwdVisual: false, //密码查看
        confirmPwdVisual: false, //确认密码查看
        submitData: { //提交信息
          formerPwd: '', //旧密码
          tradePassword: '', //新密码
        },
        confirmPwd: '', //用于确认密码
      }
    },
    methods: {
      submitChangePwdData() { //上传修改密码信息
        if(!this.submitData.formerPwd) {
          this.$toast.fail({
            duration: 1000,   // 持续展示 toast
            message: '请输入旧密码'
          });
          return
        }
        if(!this.submitData.tradePassword) {
          this.$toast.fail({
            duration: 1000,   // 持续展示 toast
            message: '请输入新密码'
          });
          return
        }
        if(this.confirmPwd !== this.submitData.tradePassword) {
          this.$toast.fail({
            duration: 1000,   // 持续展示 toast
            message: '确认密码与新密码不一致'
          });
          return
        }
        this.$axios({
          url: '/api/user/update/password',
          method: 'post',
          data: this.submitData
        }).then(res => {
          if(res.data.errorCode === 0) {
            this.$toast.success({
              duration: 2000,   // 持续展示 toast
              message: '修改成功 请前往登陆'
            });
            this.$cookie.clear(); //清除cookie
            this.$router.push('/login')//跳转登录页
          }
        })
      },
    }
  }
</script>

<style scoped>
  /*输入框*/
  .form {
    background-color: #fff;
    margin-bottom: 0.8rem;
  }
  .form li {
    display: flex;
    align-items: center;
    padding: 0 1.35rem;
    border-bottom: 1px solid #f1f2f3;
    font-size: 1rem;
    height: 3.3rem;
  }
  .form li span {
    display: inline-block;
    width: 30%;
    font-size: 0.9rem;
    text-align: left;
  }
  .form li input {
    width: 64%;
    font-size: 0.9rem;
    outline: none;
    border: none;
    padding: 0;
    border-radius: 0.3rem;
    box-sizing: border-box;
    line-height: 1;
  }
  .form li i {
    color: #ff5e00;
    font-size: 0.9rem;
  }
  /*提交按钮*/
  .submitBtn {
    padding: 1.3rem;
  }
  .submitBtn .forget_btn {
    background-color: #ff5e00;
    border-radius: 0.3rem;
    color: #fff;
    height: 2.6rem;
    line-height: 2.6rem;
    padding: 0 0.8rem;
    font-size: 0.9rem;
    text-align: center;
    outline: none;
    border: none;
    display: block;
    width: 100%;
  }
</style>
