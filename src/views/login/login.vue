<template>
    <section>
        <div id="login">
            <div id="logo">
                <img src="../../assets/imgs/logo.png" alt="">
            </div>
            <div id="form">
                <div class="input_box">
                    <i class="icon-account"></i>
                    <input class="username" type="text" placeholder="请输入用户名/手机号" v-model="submitData.mobile">
                </div>
                <div class="input_box">
                    <i class="icon-lock"></i>
                    <input class="password" :type="pwdVisual? 'text': 'password'" placeholder="请输入您的密码" v-model="submitData.password">
                    <i :class="pwdVisual? 'icon-visible' : 'icon-invisible'" @click="pwdVisual = !pwdVisual"></i>
                </div>
                <button class="login_btn" @click="login">登录</button>
                <router-link class="reg" to="/register">立即注册</router-link>
                <router-link class="forget" to="/forget">忘记密码？</router-link>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        name: "login",
        data() {
            return {
                pwdVisual: false, //密码可视
                submitData: {
                    mobile: '', //用户名或者手机号
                    password: '', //密码
                    terminal: '', //设备类型
                },
            }
        },
        mounted() {
            this.getterminal();
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
            login() { //登录
                this.$axios({
                    url: '/api/index/login',
                    method: 'post',
                    params: this.submitData,
                }).then(res => {
                    if(res.data.errorCode === 0) {
                        if(res.data.data.cookie){
                            this.$cookie.set('_auth',res.data.data.cookie)
                            this.$toast.success({
                                duration: 1000,   // 持续展示 toast
                                message: '登录成功'
                            });
                            this.$router.push('/');

                        }else if(res.data.data.errorMsg) {
                            this.$toast(res.data.data.errorMsg.error);
                        }else if(res.data.data.loginError) {
                            this.$toast(res.data.data.loginError);
                        }
                    }
                })
            },
        },
    }
</script>

<style scoped>
    #login {
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('../../assets/imgs/login_bg.jpg');
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 2rem 1.9rem;
    }
    /*logo*/
    #logo {
        text-align: center;
        display: block;
        margin: 3rem 0 0;
    }
    #logo img {
        max-width: 40%;
        max-height: 35%;
        display: inline-block;
    }
    /*输入框*/
    #form {
        color: #fff;
        margin-top: 2.5rem;
    }
    #form .input_box {
        display: block;
        border: 1px solid #fff;
        border-radius: 100px;
        height: 3.5rem;
        margin-bottom: 1.3em;
        box-sizing: border-box;
    }
    #form .input_box i {
        font-size: 1.25rem;
        width: 15%;
        text-align: center;
    }
    #form .input_box input {
        font-size: 0.9em;
        height: 100%;
        width: 83%;
        border-radius: 0 100px 100px 0;
        background-color: transparent;
        color: #fff;
        box-sizing: border-box;
        border: none;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        -webkit-appearance: none;
        outline: none;
    }
    #form .input_box img {
        width: 25%;
        margin-right: 5%;
        height: 70%;
    }
    #form .input_box input.password {
        width: 65%
    }
    #form .input_box input.code {
        width: 50%
    }
    .input_box > * {
        display: inline-block;
        font-size: 1rem;
        vertical-align: middle;
    }
    /*按钮*/
    .login_btn {
        background-color: #fff;
        color: #ff5e00;
        border-radius: 100px;
        margin-top: 2.2rem;
        font-size: 1.2rem;
        height: 3.5rem;
        line-height: 3.5rem;
        padding: 0 0.5rem;
        text-align: center;
        outline: none;
        border: none;
        display: block;
        width: 100%;
    }
    .reg {
        position: relative;
        display: block;
        text-align: center;
        height: 3.75rem;
        line-height: 3.75rem;
        font-size: 1rem;
        color: #fff;
    }
    .reg:before {
        height: 1px;
        content: "";
        display: block;
        width: 40%;
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
        left: 0;
        background-image: -webkit-linear-gradient(0, transparent 0%, #fff 100%);
    }
    .reg:after {
        height: 1px;
        content: "";
        display: block;
        width: 40%;
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
        right: 0;
        background-image: -webkit-linear-gradient(180deg, transparent 0%, #fff 100%);
    }
    .forget {
        display: block;
        text-align: right;
        color: #fff;
        font-size: 0.9rem;
        margin-top: 1.8rem;
    }
</style>
