<template>
    <section>
        <van-nav-bar
            title="设置"
            left-arrow
            fixed
            @click-left="$back()"
        />
        <div class="secondList">
            <ul>
                <!--<li>-->
                    <!--<p>头像</p>-->
                    <!--<p><span></span><i class="rightArrow"></i></p>-->
                <!--</li>-->
                <li @click="modifyNickName">
                    <p>昵称</p>
                    <p><span>{{userData.nickName}}</span><i class="rightArrow"></i></p>
                </li>
                <li>
                    <p>手机号码</p>
                    <p><span style="padding-right: 1rem">{{userData.mobile}}</span></p>
                </li>
                <li>
                    <p>登录密码</p>
                    <p><router-link to="/modifyPwd"><span>修改密码</span><i class="rightArrow"></i></router-link></p>
                </li>
                <li>
                    <p>实名认证</p>
                    <p><router-link to="/verified"><span>{{userData.authStatus == 0? '未认证': userData.authStatus == 1? '认证中': userData.authStatus == 2? '已认证': userData.authStatus == 3? '认证失败':'其他' }}</span><i class="rightArrow"></i></router-link></p>
                </li>
                <li>
                    <p><span @click="logout">退出系统</span></p>
                </li>
            </ul>
        </div>
        <van-dialog
            v-model="showContent"
            show-cancel-button
            :before-close="beforeClose"
        >
            <van-field
                v-model="nickName"
                label="昵称"
                placeholder="请输入昵称"
            />
        </van-dialog>
    </section>
</template>

<script>
    export default {
        name: "index",
        data () {
          return {
              userData: {}, //个人信息
              showContent: false,
              nickName: '',
          }
        },
        mounted() {
            this.getUserData()
        },
        methods: {
            getUserData() { //获取个人信息
                this.$axios.post('/api/user/query_user_msg').then(res => {
                    if (res.status === 200) {
                        this.userData = res.data.data;
                    }
                })
            },
            logout(){  //退出登录
                this.$dialog.confirm({
                    title: '退出登录',
                    message: '确认退出?'
                }).then(() => {
                    if(this.$cookie.get('_auth')){
                        this.$cookie.clear(); //清除cookie
                        this.$router.push('/login')//跳转登录页
                    }else{
                        this.$router.push('/login')
                    }
                })
            },
            modifyNickName(){//修改登录昵称

                this.showContent = true;
                this.nickName = '';
            },
            beforeClose(action, done) {

                if (action === 'confirm') {

                    this.updateNickName();
                    setTimeout(done, 1000);
                } else {
                    done();
                }
            },

            updateNickName(){

                if(!this.nickName) {
                    return
                }

                this.$axios.post('/api/user/update/nickname', {nickName: this.nickName}).then(res => {
                    if(res.data.errorCode === 0) {
                        this.$toast.success('更改昵称成功');
                        this.nickName = '';
                        this.getUserData();
                    }
                })
            },
        }
    }
</script>

<style scoped>
    .rightArrow {
        display: inline-block;
        width: .5rem;
        height: .5rem;
        border-top: 1px solid #ddd;
        border-right: 1px solid #ddd;
        transform: rotate(45deg);
        margin-left: .5rem;
    }
    .secondList {
        margin-top: 3.3rem;
        background: #fff;
    }
    .secondList > ul li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: .8rem;
        border-bottom: 1px solid #eee;
    }
    .secondList > ul li:last-child p {
        width: 100%;
        text-align: center;
        padding-top: 2rem;
    }
    .secondList > ul li:last-child p span {
        display: inline-block;
        width: 80%;
        background: #ff5e00;
        text-align: center;
        padding: .5rem;
        color: #fff;
        border-radius: .3rem;
    }
    .secondList > ul li p {
        font-size: .8rem;
    }
</style>