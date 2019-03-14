<template>
    <section>
        <div id="user_header">
            <header>
                <div class="header_nav">
                    <!--<a class="left-btn" :href="'tel:' + serviceTel"><i class="icon-service"></i></a>-->
                    <span >{{userData.nickName}}</span>
                    <!--<a class="right-btn"><i class="icon-logout" @click="logout"></i></a>-->
                    <router-link to="/setting" class="right-btn">设置</router-link>
                </div>
            </header>
            <div class="main">
                <div class="detail">
                    <!--<p>账户余额</p>-->
                    <label>{{total || 0}}</label>
                    <p>抵用券：{{userData.couponMoney || 0}}元</p>
                    <div class="accountType">
                        <p>可用金额：<span>{{userData.money || 0}}</span></p>
                        <p>冻结金额：<span>{{userData.cashDeposit || 0}}</span></p>
                    </div>
                    <div class="btn-row">
                        <button class="btn" @click="routerLike('topUp')">充值</button>
                        <button class="btn" @click="routerLike('withdrawal')">提现</button>
                    </div>
                </div>
            </div>
        </div>
        <div id="menu_list">
            <ul>
                <li>
                    <router-link to="/intro" class="secondC"><div><i class="icon-money"></i><p>我的推广</p></div><div><p >已推广:{{inviteData.myUser || 0}}人</p><p class="promoted">收益:{{Number(inviteData.returnMoneyTotal-inviteData.returnMoney).toFixed(2) || 0}}元</p></div></router-link>
                </li>
                <li>
                    <router-link to="/financialDetails"><i class="icon-list"></i><p>资金记录</p></router-link>
                </li>
                <li>
                    <router-link to="/bankCard"><i class="icon-bankcard"></i><p>我的银行卡</p></router-link>
                </li>
                <!--<li>-->
                    <!--<router-link to="/security"><i class="icon-password"></i><p>账号安全</p></router-link>-->
                <!--</li>-->
                <li>
                    <router-link to="/feeAgreement"><i class="icon-wechat"></i><p>资费协议</p></router-link>
                </li>
                <li>
                    <router-link to="/coAgreement"><i class="icon-wechat"></i><p>合作协议</p></router-link>
                </li>
                <li>
                    <router-link to="/riskWarning"><i class="icon-question"></i><p>风险提示</p></router-link>
                </li>
                <li>
                    <router-link to="/help"><i class="icon-question"></i><p>帮助中心</p></router-link>
                </li>

            </ul>
        </div>

    </section>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                serviceTel: '', //客服电话
                userData: {}, //个人信息
                inviteData: {},
                total: '',
            }
        },
        mounted() {
            this.getUserData()
            this.getUserInfo();
        },
        methods: {
            getUserData() { //获取个人信息
                this.$axios.post('/api/user/query_user_msg').then(res => {
                    if (res.status === 200) {
                        this.userData = res.data.data;
                        this.total = (this.userData.money + this.userData.cashDeposit) || 0;
                    }
                })
            },
            routerLike(link) { //跳转
                this.$router.push('/' + link);
            },
            getUserInfo(){
                this.$axios.post('/api/user/myinvite')
                    .then(res => {
                        if(!res.data.errorCode){

                            this.inviteData = res.data.data;
                        }
                    })
                    .catch(err => {
                        this.$toast.error(err)
                    })
            },
        }
    }
</script>

<style scoped>
    /*头部*/
    #user_header {
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('../../assets/imgs/user_header.jpg');
        padding: 3rem 1.3rem 0;
        box-sizing: border-box;
        position: fixed;
        width: 100%;
        left: 0;
        top: 0;
        z-index: 2;
    }
    header {
        background-color: transparent;
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        height: 3rem;
        line-height: 3rem;
        color: #fff;
        z-index: 9;
        box-sizing: content-box;
    }
    header .header_nav {
        height: 3rem;
        position: relative;
    }
    header .header_nav a{
        padding: 0 1rem;
        color: #fff;
        display: inline-block;
    }
    header .header_nav a.left-btn {
        position: absolute;
        left: 0;
    }
    header .header_nav a.right-btn {
        position: absolute;
        right: 0;
    }
    header .header_nav i {
        font-size: 1.1rem;
        vertical-align: middle;
    }
    header .header_nav span {
        font-size: 1.1rem;
        text-align: center;
        position: absolute;
        left: 0;
        right: 0;
        width: 65%;
        margin: 0 auto;
    }
    /*账户信息*/
    .main {
        text-align: center;
    }
    #user_header .detail {
        padding: 0.3rem 0 1.3rem;
    }
    #user_header .detail .accountType {
        display: flex;
        justify-content: space-between;
        margin-top: .5rem;
    }
    #user_header .detail .accountType p {
        width: 50%;
    }
    #user_header .detail .accountType p span {
        display: inline-block;
        padding-top: .5rem;
    }
    #user_header .detail p {
        color: #fff;
        font-size: 0.9rem;
        line-height: 0.8rem;
    }
    #user_header .detail label {
        color: #fff;
        font-size: 2rem;
        margin: 0.75rem 0;
        display: block;
    }
    #user_header .btn-row {
        padding: 0 1.3rem;
        margin-top: 1.3rem;
        display: flex;
        justify-content: space-between;
    }
    #user_header button {
        height: 2.5rem;
        line-height: 2.5rem;
        font-size: 0.8rem;
        width: 44%;
        background-color: #ff5e00;
        border-radius: 0.3rem;
        color: #fff;
        padding: 0 0.5rem;
        text-align: center;
        outline: none;
        border: none;
        display: block;
    }
    /*菜单列表*/
    #menu_list {
        padding-top: 14rem;
        padding-bottom: 3.7rem;
    }
    ul {
        margin-top: 1.1rem;
    }
    ul li {
        padding-left: 1rem;
        background-color: #fff;
        border-bottom: 1px solid #f1f2f3;
    }
    ul li a {
        display: flex;
        align-items: center;
        flex-basis: 100%;
        padding: 0.9rem 0;
        position: relative;
    }
    ul li a:after {
        content: "\E930";
        font-family: icomoon;
        color: #e0e0e0;
        font-size: 0.9rem;
        text-align: right;
        padding-right: 1.8rem;
        position: absolute;
        right: 0;
    }
    ul li a i {
        color: #ff5e00;
        font-size: 0.97rem;
        width: 10%;
        display: inline-block;
    }
    ul li a p {
        font-size: 0.8rem;
        color: #212121;
        padding: 0;
        margin: 0;
    }
    .secondC {
        display: flex;
        justify-content: space-between;
    }
    .secondC > div:last-child {
        display: flex;
        width: 75%;
        justify-content: space-around;
    }
    .secondC > div:first-child {
        display: flex;
        width: 25%;
        justify-content: space-between;
    }
    .promoted {
        padding-right: 1rem;
    }

</style>
