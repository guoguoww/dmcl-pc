<template>
    <section>
        <van-nav-bar
            title="我的推广"
            left-arrow
            fixed
            @click-left="$back()"
        />
        <div class="content">
            <div class="bottom">
                <p >推荐朋友扫码，成为你的用户</p>
                <div style="width: 50%;margin-left: 50%;">
                    <div id="qrcode" style="margin-left: -50px"></div>
                </div>

            </div>
            <p>复制邀请码给朋友</p>
            <div class="top">
                <input readonly v-model="inviteCode">
                <button type="button"
                        v-clipboard:copy="inviteCode"
                        v-clipboard:success="onCopy"
                        v-clipboard:error="onError">复制
                </button>
            </div>
        </div>
        <div class="dataInfo">
            <ul>
                <li>
                    <span>总佣金：{{inviteData.returnMoneyTotal}}</span>
                    <span>我的用户：{{inviteData.myUser}}</span>
                    <span>交易用户：{{inviteData.dealUser}}</span>
                </li>
                <li>
                    <span>当前佣金：{{Number(inviteData.returnMoneyTotal-inviteData.returnMoney).toFixed(2)}}</span>
                    <span class="transfer" @click="transferAccount">转到账户</span>
                </li>
            </ul>
        </div>
        <van-dialog
            v-model="show"
            show-cancel-button
            :before-close="beforeClose"
        >
            <van-field
                v-model="transferMoney"
                label="转移金额"
                placeholder="请输入转移金额"
                type="number"
            />
        </van-dialog>

        <div class="recomList">
            <ul>
                <li>
                    <span>用户名</span>
                    <span>当前交易</span>
                    <span>时间</span>
                </li>
                <li v-if="recommendList.length != 0" v-for="(item, index) of recommendList" :key="index">
                    <span>{{item.chnName}}</span>
                    <span>{{item.dealCount}}</span>
                    <span>{{item.registerTime | getLocalTime}}</span>
                </li>
                <li class="empty" v-if="recommendList.length == 0">
                    <p>暂无数据</p>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
    import QRCode from 'qrcodejs2'

    export default {
        name: "intro",
        data (){
            return {
                inviteCode: '',
                inviteData: {},
                recommendList: [],
                show: false,
                transferMoney: '',
            }
        },
        mounted (){
            this.getUserInfo();
        },
        methods: {
            onCopy: function (e) {
                console.log(e.text)
                this.$toast.success('复制邀请码成功')
            },
            onError: function (e) {
                console.log(e)
                this.$toast.fail('复制失败，刷新后重新复制')
            },
            getUserInfo(){
                this.$axios.post('/api/user/myinvite')
                    .then(res => {
                        if(!res.data.errorCode){

                            this.inviteCode = res.data.data.inviteCode;
                            this.inviteData = res.data.data;
                            this.recommendList = res.data.data.data;

                            this.qrcode();
                        }
                    })
                    .catch(err => {
                        this.$toast.error(err)
                    })
            },
            qrcode () {

                let that = this;

                let qrcode = new QRCode('qrcode', {
                    width: 100,
                    height: 100, // 高度
                    text: `${location.origin}#/register?inviteCode=${that.inviteCode}`, // 二维码内容
                })

            },
            transferAccount(){//转移佣金
                this.show = true;
                this.transferMoney = '';
            },
            beforeClose(action, done) {
                if (action === 'confirm') {
                    this.gotoaccount();
                    setTimeout(done, 1000);
                } else {
                    done();
                }
            },
            gotoaccount(){
                if(!this.transferMoney) {
                    return
                }
                this.$axios.post('/api/user/gotoaccount',{money: this.transferMoney}).then(res => {
                    if(res.data.errorCode === 0) {
                        this.$toast.success('佣金转移成功');
                        this.transferMoney = '';
                        this.getUserInfo();
                    }
                })
            },
        },
        filters: {
            getLocalTime(nS){
                return new Date(parseInt(nS) ).toLocaleString().replace(/:\d{1,2}$/, ' ');
            },
        }
    }
</script>

<style scoped>

    .content {
        padding: 1rem;
        background: #fff;
        font-size: .7rem;
        text-align: center;
    }
    .top {

        position: relative;
        padding: 1rem 0;
    }
    .top input {
        width: 70%;
        color: #ff5e00;
        text-align: center;
        border: none;
    }
    .top button {
        color: #249fed;
        padding: 1rem;
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
        right: 0;
        background: none;
        outline: none;
        border: none;
    }
    .bottom {
        border-bottom: 1px solid #f1f2f3;
        padding-bottom: .5rem;
        margin-bottom: .5rem;
    }
    .bottom p {
        font-size: .8rem;
        padding: 1rem 0;
    }
    .bottom img {
        max-width: 50%;

    }
    .dataInfo {
        margin-top: .5rem;
        padding: 1rem;
        background: #fff;
        font-size: .8rem;
    }
    .dataInfo ul li {
        display: flex;
        justify-content: space-between;
    }
    .dataInfo ul li:nth-child(2) {
        justify-content: flex-start;
        padding-top: .5rem;
    }
    .dataInfo ul li:nth-child(2) span {
        padding-right: 2rem;
    }
    .transfer {
        color: #249fed;
        cursor: pointer;
    }
    .recomList {
        margin-top: .5rem;
        padding: 1rem;
        background: #fff;
        font-size: .8rem;
    }
    .recomList ul li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: .5rem 0;
        border-bottom: 1px solid #eee;
    }
    .recomList ul li span {
        flex: 1;
    }
    .recomList ul li span:nth-child(2) {
        text-align: center;
    }
    .recomList ul li span:last-child {
        text-align: right;
    }
    .recomList ul li.empty p {
        width: 100%;
        text-align: center;
        font-size: 1rem;
        padding-top: 1rem;
    }
</style>