<template>
    <section>
        <van-nav-bar
            title="银行卡列表"
            left-arrow
            fixed
            @click-left="$back()"
        />
        <div class="content">
            <div class="edit-guide" v-if="!bankCardInfoModify">
                <i class="icon-bankcard"></i>
                <p>您还没有绑定银行卡</p>
                <div v-if="realNameStatus === 0 || realNameStatus === 3">
                    <span>请先实名认证再进行绑定银行卡</span>
                    <router-link class="btn" to="/verifiedEdit">前往实名认证</router-link>
                </div>
                <div v-if="realNameStatus === 1">
                    <span>实名认证后再进行绑定银行卡</span>
                    <a class="btn disabled" href="javascript:void (0);" >实名审核中</a>
                </div>
                <router-link class="btn" v-if="realNameStatus === 2" to="/bankcardAdd">立即绑定银行卡</router-link>
            </div>
            <div class="info" v-if="bankCardInfoModify">
                <div class="cardList" v-for="(item, index) of cardListInfo">
                    <div class="card">
                        <div>
                            <label>
                                <span>{{item.bankName}}</span>
                            </label>
                            <span>储蓄卡</span>
                        </div>
                        <p>{{item.bankAccount | stars}}</p>
                        <b>{{item.chnName}}</b>
                    </div>
                    <span @click="delBankCard(item.id)">解绑</span>
                </div>
                <!--<router-link class="btn" to="/bankcardAdd">修改</router-link>-->
            </div>
            <p>为了保障您的资金安全，请确认银行卡信息</p>
            <!--<p>如有疑问，请 <a href="tel:4008762722">联系客服</a> </p>-->
        </div>
    </section>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                userData: {}, //个人信息
                realNameStatus: 0, //实名认证状态
                cardListInfo: [], //银行卡信息
                bankCardInfoModify: true, //是否存在银行卡
            }
        },
        mounted() {
            this.getUserData();
            this.getBankCardInfo();
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
            getBankCardInfo() { //获取绑定银行卡信息
                this.$axios.post('/api/user/query/bankcard').then(res => {
                    if (res.data.errorCode === 0) {
                        this.cardListInfo = res.data.data;

                        if(this.cardListInfo.length === 0){
                            this.bankCardInfoModify = false;
                        }else {
                            this.bankCardInfoModify = true;
                        }
                    }
                })
            },
            delBankCard(curId){
                this.$dialog.confirm({
                    title: '解绑银行卡',
                    message: '确认解绑?'
                }).then(() => {
                    this.$axios.post('/api/user/del/bankcard',{id:curId}).then(res => {
                        if (res.data.errorCode === 0) {
                            this.getBankCardInfo();
                        }
                    })
                })
            },
        },
        filters: {
            stars(val) {
                let reg = /^(\d{4})\d+(\d{4})$/;
                return val.replace(reg, "$1 **** **** $2")
            }
        }
    }
</script>

<style scoped>
    /*未绑定银行卡*/
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
    .edit-guide > div span {
        display: block;
        text-align: center;
        font-size: 0.85rem;
        color: #adadad;
    }
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
    /*已绑定*/
    .info {
        /*padding: 0.7rem 1.6rem;*/
    }
    .cardList {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 1.6rem;
        background: #fff;
        margin-bottom: .5rem;
    }
    .cardList > .card {
        width: 80%;
    }
    .cardList > span {
        /*background: #1989fa;*/
        color: #1989fa;
        border-radius: .2rem;
        padding: .1rem .3rem;
        cursor: pointer;
        font-size: .8rem;

    }
    .card {
        background: -webkit-linear-gradient(0, #f97384, #fe5359);
        border-radius: .5rem;
        color: #fff;
        font-size: 0.9rem;
        padding: .5rem 1rem;
        position: relative;
        overflow: hidden;
    }
    .card > div {
        border-bottom: 1px solid #fff;
        padding-bottom: .3rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .card > div label {
        width: 80%;
        text-align: left;
        font-size: 0.9rem;
    }
    .card p {
        color: #fff !important;
        font-size: 1rem !important;
        padding: .3rem 0;
    }
    .card b {
        display: block;
        text-align: right;
    }
    .info p {
        color: #adadad;
        text-align: left;
        font-size: 0.7rem;
        line-height: 1;
    }
    .info p a {
        color: #249fed;
    }

    .content > p {
        color: #adadad;
        text-align: center;
        font-size: 0.7rem;
        line-height: 1;
    }
    .content > p a {
        color: #249fed;
    }

    .disabled {
        background: #c7c7c7 !important;
        border: 1px solid #c7c7c7 !important;
        color: #fff !important;
    }
</style>
