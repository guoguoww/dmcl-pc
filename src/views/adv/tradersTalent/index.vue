<template>
    <section>
        <van-nav-bar
            title="操盘达人"
            left-arrow
            fixed
            @click-left="$back()"
        />
        <div class="content">
            <ul>
                <li v-for="(item, index) in tradingList" v-if="tradingList.length != 0" :key="index">
                    <label>
                        <h4>{{item.chnName}}</h4>
                        <span >{{item.stockName}} {{item.stockCode}}</span>
                    </label>
                    <label>
                        <p class="red">{{item.stockNum}}</p>
                        <span >{{item.difMoney}}</span>
                    </label>
                    <router-link to="/strategy/aPointBuy">我要点买</router-link>
                </li>
                <li @click="loadingMore">
                    <div class="data-empty" v-if="tradingList.length == 0">暂无数据</div>
                    <div v-else class="data-empty">
                        <div class="data-empty" v-if="tradingList.length != total">加载更多</div>
                        <div class="data-empty" v-else>没有更多数据</div>
                    </div>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
    export default {
        name: "index",
        data(){
            return {
                page: {
                    start: 0,
                    rows: 10,
                },
                total: '',
                tradingList: [],
            }
        },
        mounted() {
            this.expertInfo();
        },
        methods: {
            expertInfo() {//操盘达人
                this.$axios({
                    method: 'post',
                    url: '/api/home/trader/expert',
                    params: this.page,
                }).then(res => {
                    if(res.data.errorCode === 0){
                        this.total = res.data.data.total;
                        this.tradingList = [...this.tradingList,...res.data.data.data];
                    }
                })
            },
            loadingMore(){
                if(this.tradingList.length == this.total) {
                    return
                }
                this.page.start += this.page.rows;
                this.expertInfo();
            },
        }
    }
</script>

<style scoped>
    .content ul {
        padding: 0 0.85rem;
        background: #fff;
    }
    .content ul li {
        border-bottom: 1px solid #f1f2f3;
        padding: 0.85rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .content ul li p {
        font-size: 0.7rem;
        color: #000;
        margin: 0;
    }
    .content ul li a {
        font-size: 0.7rem;
        height: 1.8em;
        line-height: 1.4rem;
        box-sizing: content-box;
        padding: 0 0.1rem;
        display: inline-block;
        width: 20%;
        background-color: transparent;
        border-radius: 0.3rem;
        text-align: center;
        outline: none;
        color: #ff5e00;
        border: 1px solid #ff5e00;
    }
    .content ul li label {
        width: 44%;
        text-align: left;
        font-size: 0.85rem;
    }
    .content ul li span {
        color: #7a7a7a;
    }
    .content .data-empty {
        width: 100%;
        text-align: center;
    }
</style>