<template>
    <section>
        <van-nav-bar
            title="资金明细"
            left-arrow
            fixed
            @click-left="$back()"
        />
        <div class="content">
            <div class="detail">
                <div>
                    <router-link to="/topUp" tag="span"  class="btn">充值</router-link>
                </div>
                <div>
                    <label>{{balance}}</label>
                    <p>账户余额(元)</p>
                </div>
                <div class="">
                    <router-link to="/withdrawal" tag="span" class="btn">提现</router-link>
                </div>
            </div>
            <div class="contentTit">
                <div>
                    <span :class="{active: tabActiveIndex == index}" v-for="(item, index) of tabTitle" @click="onClickTab(index,item.name)">{{item.name}}</span>
                </div>
            </div>


            <ul class="recordList" v-show="moneyItem">
                <li class="recordContent">
                    <span :class="{active: tabRecordIndex == index}" v-for="(item, index) of tabRecordList" @click="recordClickTab(index,item.val)">{{item.name}}</span>
                </li>
                <li id="listSecTit" class="">
                    <span>时间</span>
                    <span>订单号</span>
                    <span>类型</span>
                    <span>金额</span>
                </li>
                <li class="recordItem" v-for="(item,index) in capital.capitalList" :key="index">
                    <span>{{item.createTime }}</span>
                    <span>{{item.serialNo}}</span>
                    <span>{{item.type == 0?'充值':item.type == 1?'提现': item.type == 5?'转佣': '其他'}}</span>
                    <span>{{item.difMoney}}</span>
                </li>
                <!--暂无数据-->
                <div class="more" @click="loadmore">
                    <span v-if="capital.capitalList.length == 0">暂无数据</span>
                    <div v-else>
                        <span v-if="capital.capitalList.length != capital.total">加载更多</span>
                        <span v-else>没有更多数据</span>
                    </div>
                </div>
            </ul>

            <ul class="recordListDetail" v-show="!moneyItem">
                <li >
                    <span :class="{active: tabSecondIndex == index}" v-for="(item, index) of tabList" @click="onSecondClickTab(index,item.val)">{{item.name}}</span>
                </li>

                <li id="listTit" class="">
                    <span>时间</span>
                    <span>类型</span>
                    <span>金额</span>
                </li>
                <li class="listItem" v-for="(item,index) in capital.capitalList" :key="index">
                    <span>{{item.createTime }}</span>
                    <!--<span>{{item.serialNo}}</span>-->
                    <span>{{item.type == 0?'充值':item.type == 1?'提现': item.type == 3?'行权': item.type == 8?'递延费': item.type == 9?'保证金': item.type == 10?'建仓费':  item.type == 12?'管理费':  item.type == 14?'手续费': '其他' }}</span>
                    <span>{{item.difMoney}}</span>
                </li>
                <!--暂无数据-->
                <div class="more" @click="loadmore">
                    <span v-if="capital.capitalList.length == 0">暂无数据</span>
                    <div v-else>
                        <span v-if="capital.capitalList.length != capital.total">加载更多</span>
                        <span v-else>没有更多数据</span>
                    </div>
                </div>
            </ul>

        </div>
        <div  v-if="mloading" class="m">
            <van-loading class="loading" color="white" />
            <div class="mask"></div>
        </div>
    </section>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                moneyItem: true,
                tabTitle: [
                    {name: '资金记录',val: 0},
                    {name: '资金明细',val: 1},
                ],
                tabRecordList: [
                    {name: '充值',val: '0'},
                    {name: '提现',val: '1'},
                    {name: '转佣',val: '5'},
                ],
                tabList: [
                    {name: '全部',val: ''},
                    {name: '行权',val: '3'},
                    {name: '递延费',val: '8'},
                    {name: '保证金',val: '9'},
                    {name: '建仓费',val: '10'},
                    {name: '管理费',val: '12'},
                    {name: '手续费',val: '14'},
                ],
                tabActiveIndex: 0,
                tabSecondIndex: 0,
                tabRecordIndex: 0,
                moneyRecordList: {//资金记录

                },
                balance: '', //余额
                capitalData: { //提交获取资金流水信息
                    start: 0, //页码
                    rows: 10, //页容量
                    // type: '', //类型为空时，查询的是全部
                    type: '0', //类型为空时，查询的是全部
                },
                capital: { //资金明细流水列表
                    capitalList: [], //列表
                    total: 0, //总条数
                },
                mloading:false,//loading 是否显示
            }
        },
        mounted() {
            this.getUserCapital();
            this.getUserData();
        },
        methods: {
            getUserData() { //获取个人信息
                this.$axios.post('/api/user/query_user_msg').then(res => {
                    if (res.status === 200) {
                        this.balance = res.data.data.money;
                    }
                })
            },
            getUserCapital() { //获取用户资金流水
                this.$axios({
                    url: '/api/user/moneyinandout/count',
                    method: 'post',
                    params: this.capitalData,
                }).then(res => {
                    if(res.data.errorCode === 0) {
                        this.mloading=false;
                        this.capital.total = res.data.data.total;

                        this.capital.capitalList =  [...this.capital.capitalList , ...res.data.data.data];
                    }
                })
            },
            onClickTab(index,val){

                this.tabActiveIndex = index;

                if(val == '资金明细') {
                    this.moneyItem = false;
                    this.tabSecondIndex = 0;

                    this.capitalData.type = '';
                    this.capitalData.start = 0;
                    this.capital.capitalList= [];
                    this.getUserCapital();
                }
                if(val == '资金记录') {
                    this.moneyItem = true;
                    this.tabRecordIndex = 0;

                    this.capitalData.type = '0';
                    this.capitalData.start = 0;
                    this.capital.capitalList= [];
                    this.getUserCapital();
                }

            },
            onSecondClickTab(index,val){
                this.tabSecondIndex = index;
                this.capitalData.type = val;
                this.capitalData.start = 0;
                this.capital.capitalList= [];

                this.getUserCapital();
            },
            recordClickTab(index,val) {

                this.tabRecordIndex = index;
                this.capitalData.type = val;
                this.capitalData.start = 0;
                this.capital.capitalList= [];

                this.getUserCapital();

            },
            // 加载更多
            loadmore(){
                if (this.capital.total==this.capital.capitalList.length) {
                    return;
                }
                this.mloading=true;
                this.capitalData.start+=this.capitalData.rows;
                this.getUserCapital()
            }

        },
    }
</script>

<style scoped>
    /*账户信息*/
    /*.van-nav-bar {*/
        /*z-index: 99999;*/
    /*}*/
    .detail {
        display: flex;
        justify-content: space-between;
        padding: 0.3rem 0 1.3rem;
        background: #fff;
        /*text-align: center;*/
        align-items: center;
    }
    .detail > div {
        flex: 1;
        text-align: center;
    }
    .detail p {
        color: #adadad;
        font-size: 0.8rem;
        line-height: 0.8rem;
    }
    .detail label {
        color: #212121;
        font-size: 1.2rem;
        margin: 0.75rem 0;
        display: block;
    }
    .detail .btn-row {
        padding: 0 1.3rem;
        margin-top: 1.3rem;
        display: flex;
        justify-content: space-between;
    }
    .detail span {
        height: 2.5rem;
        line-height: 2.5rem;
        font-size: 1rem;
        width: 44%;
        margin: auto;
        /*background-color: #ff5e00;*/
        border-radius: 0.3rem;
        color: #ff5e00;
        padding: 0 0.5rem;
        text-align: center;
        outline: none;
        border: none;
        display: block;

    }
    /*明细列表*/
    .recordList {
        padding: 3rem 0.7rem 0;
        background: #fff;
        margin-top: .5rem;
    }
    .recordListDetail {
        /*margin-top: 0;*/
        margin-top: .5rem;
        background: #fff;
        padding: 3rem .7rem 0;
    }

    .recordList li, .recordListDetail li {
        font-size: 0.8rem;
        padding: .5rem 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #eee;
    }

    .recordList li span {
        text-align: center;
        flex: 1;
    }
    .recordList .more, .recordListDetail .more {
        padding: 1rem;
        font-size: .8rem;
        margin-bottom: 1rem;
        width: 100%;
        text-align: center;
    }

    .content {
        position: relative;
    }
    .contentTit {
        position: absolute;
        top: 7rem;
        left: 0;
        width: 100%;
    }
    .contentTit > div {
        display: flex;
        justify-content: space-between;
        /*width: 260%;*/
        padding: 0 1rem;
        padding-bottom: .7rem;

    }
    .contentTit span {
        flex: 1;
        text-align: center;
        font-size: .9rem;
        font-weight: bold;
    }
    .contentTit span.active, .recordListDetail span.active, .recordContent > span.active {
        color: #ff5e00;
    }
    /*无数据*/
    .data-empty {
        text-align: center;
        font-size: 0.8rem;
        color: #bbb;
    }
    .van-tabs__line {
        background-color: #ff5e00 !important;
    }
    #listTit span {
        text-align: center;
    }
    #listTit span:first-child {
        width: 40%;
    }
    #listTit span:nth-child(2) {
        width: 30%;
    }
    #listTit span:last-child {
        width: 30%;
    }
    .recordListDetail li.listItem span:first-child {
        width: 40%;
    }
    .recordListDetail li.listItem span:nth-child(2) {
        width: 30%;
        text-align: center;
    }
    .recordListDetail li.listItem span:last-child {
        width: 30%;
        text-align: center;
    }
    .recordItem span {
        flex: 1;
        width: 25%;
        white-space: normal;
        word-break:break-all
    }

</style>
