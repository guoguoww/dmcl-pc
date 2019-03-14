<template>
  <section>
    <van-nav-bar
        title="免费注册"
        left-arrow
        fixed
        @click-left="$back()"
    />
    <div class="content">
      <ul id="form">
        <li>
          <span>手机号</span>
          <input type="text" placeholder="请输入您的手机号" v-model="submitData.mobile">
        </li>
        <li>
          <span>密码</span>
          <input :type="pwdVisual? 'text': 'password'" placeholder="请输入您的密码" v-model="submitData.tradePassword">
          <i :class="pwdVisual? 'icon-visible' : 'icon-invisible'" @click="pwdVisual = !pwdVisual"></i>
        </li>
        <li>
          <span>确认密码</span>
          <input :type="confirmPwdVisual? 'text': 'password'" placeholder="请再次输入您的密码" v-model="confirmPwd">
          <i :class="confirmPwdVisual? 'icon-visible' : 'icon-invisible'" @click="confirmPwdVisual = !confirmPwdVisual"></i>
        </li>
        <li>
          <span>验证码</span>
          <input type="text" placeholder="请输入短信验证码" class="code" v-model="submitData.validCode">
          <button class="border-btn code-btn" :class="!codedisable? '':'disabled'"  :disabled='codedisable' @click="getPhoneCode()">{{isNaN(codetext) ? codetext : codetext + '秒'}}</button>
        </li>
        <li>
          <span>用户邀请码</span>
          <input type="text" placeholder="请输入邀请码" v-model="submitData.inviteCode">
        </li>
      </ul>
      <div class="reg_btns">
        <p class="read">
          <i class="icon-tick" :class="readAgr? 'active': ''" @click="readAgr = !readAgr"></i>我已阅读并同意<router-link to="/agreement">点金策略服务协议</router-link>
        </p>
        <button class="reg_btn" @click="reg()">注册</button>
        <p>如收不到验证码，请拨打 <a href="#">客服热线</a></p>
      </div>
    </div>
  </section>
</template>

<script>
    export default {
        name: "register",
        data() {
            return {
                pwdVisual: false, //密码显示
                confirmPwdVisual: false, //确认密码显示
                readAgr: true, //是否阅读服务协议
                submitData: {
                    mobile: '', //手机号
                    tradePassword: '', //密码
                    validCode: '', //手机验证码
                    inviteCode: '', //邀请码
                    terminal: '', //设备类型
                },
                confirmPwd: '', //用于确认密码
                timer: null, //短信验证码定时器
                codetext: '获取验证码', //短信验证码文字信息
                codedisable: false ,//验证码按钮禁用
            }
        },
        mounted() {
            this.getterminal();
            if (this.$route.query.inviteCode) {
                this.submitData.inviteCode=this.$route.query.inviteCode
            }
        },
        methods: {
            //获取设备类型
            getterminal() {
                var u = navigator.userAgent;
                if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
                    //安卓手机
                    this.submitData.terminal = 1;
                } else if (u.indexOf("iPhone") > -1) {
                    //苹果手机
                    this.submitData.terminal = 2;
                } else {
                    //wap
                    this.submitData.terminal = 3;
                }
            },
            getPhoneCode() { //获取短信验证码
                if(!this.submitData.mobile) {
                    this.$toast('手机号不能为空');
                    return
                }
                if(!/^[1][3,4,5,6,7,8][0-9]{9}$/.test(this.submitData.mobile)) {
                    this.$toast('手机号码格式不正确');
                    return
                }
                this.$axios({//短信验证码注册接口
                    url: "/api/sms/validate_code",
                    method: "post",
                    params: {
                        mobile: this.submitData.mobile,
                        type: 'reg',
                    }
                }).then(res=> {
                    if (res.data.errorCode === 0) {
                        this.$toast('发送成功');
                        this.codedisable = true;
                        this.codetext = 60;
                        this.timer = setInterval(() => {
                            if (this.codetext > 0 && this.codetext <= 60) {
                                this.codetext--
                            } else {
                                this.codedisable = false;
                                this.codetext = '重新获取';
                                clearInterval(this.timer);
                                this.timer = null
                            }
                        }, 1000)
                    }
                })
            },
            reg() { //注册
                if(!this.submitData.mobile) {
                    this.$toast('手机号不能为空');
                    return
                }
                if(!/^[1][3,4,5,6,7,8][0-9]{9}$/.test(this.submitData.mobile)) {
                    this.$toast('手机号码格式不正确');
                    return
                }
                if(!this.submitData.tradePassword) {
                    this.$toast('密码不能为空');
                    return
                }
                if(this.confirmPwd !== this.submitData.tradePassword) {
                    this.$toast('两次密码输入不同');
                    return
                }
                if(!this.submitData.validCode) {
                    this.$toast('手机验证码不能为空');
                    return
                }
                if(!this.readAgr) {
                    this.$toast('请先阅读点金策略服务协议');
                    return
                }
                this.$axios({
                    url: '/api/index/reg',
                    method: 'post',
                    params: this.submitData,
                }).then(res => {
                    if(!res.data.errorCode) {
                        if(!res.data.data.error){
                            this.$toast.success({
                                duration: 1000,   // 持续展示 toast
                                message: '注册成功'
                            });
                            this.$router.push('/login')
                        }
                    }
                })
            },
        },
    }
</script>

<style scoped>
  /*输入框*/
  #form {
    background-color: #fff;
  }
  #form li {
    display: flex;
    align-items: center;
    padding: 0 1.35rem;
    border-bottom: 1px solid #f1f2f3;
    font-size: 1rem;
    height: 3.3rem;
  }
  #form li span {
    display: inline-block;
    width: 24%;
    font-size: 0.9rem;
    text-align: left;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  #form li input {
    width: 73%;
    font-size: 0.9rem;
    outline: none;
    border: none;
    padding: 0;
    border-radius: 0.3rem;
    box-sizing: border-box;
    line-height: 1;
  }
  /*获取验证码列的input*/
  #form li input.code {
    width: 50%;
  }
  #form li i {
    color: #ff5e00;
    font-size: 0.9rem;
  }
  #form li img {
    width: 26%;
    height: 70%;
  }
  /*获取验证码按钮*/
  #form li .code-btn{
    border-radius: 100px;
    width: 27%;
    font-size: 0.6rem;
    height: 2rem;
    line-height: 2rem;
    background-color: transparent;
    padding: 0 0.5rem;
    text-align: center;
    outline: none;
    color: #ff5e00;
    border: 1px solid #ff5e00;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  /*注册按钮区*/
  .reg_btns {
    padding: 0 1.2rem;
  }
  .reg_btns p {
    color: #7a7a7a;
    display: block;
    margin: 1.5rem 0;
    font-size: 0.7rem;
  }
  .reg_btns p.read {
    text-align: left;
  }
  .reg_btns p i {
    background-color: #fff;
    border-radius: 0.3rem;
    color: #adadad;
    font-size: 0.8rem;
    margin-right: 0.4rem;
    padding: 0.1rem;
  }
  .reg_btns p i.active {
    color: #ff5e00;
  }
  .reg_btns p a {
    color: #249fed;
    margin-left: 0.4rem;
  }
  .reg_btns .reg_btn {
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
  .disabled {
    background: #c7c7c7 !important;
    border: 1px solid #c7c7c7 !important;
    color: #fff !important;
  }

</style>

