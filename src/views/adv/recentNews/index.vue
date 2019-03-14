<template>
    <section>
        <van-nav-bar
            title="最新动态"
            left-arrow
            fixed
            @click-left="$back()"
        />
        <div class="content">
            <ul>
                <li v-for="(item, index) in tradingList" v-if="tradingList.length != 0" :key="index">
                    <p><span>{{item.stockName }}</span><span>{{item.stockCode }}</span></p>
                    <p><span>{{item.buyPoint }}</span><span>{{item.type == 0?'普通策略': '牛人策略'}}</span></p>
                    <p><span>{{item.chnName  }}</span><span>{{item.buyTime }}</span></p>
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
            this.getTradingList();
        },
        methods: {
            getTradingList() {//新闻资讯
                this.$axios({
                    method: 'post',
                    url: '/api/home/trade/deals',
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
                this.getTradingList();
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
        padding: .3rem .85rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .content > ul > li > p {
        display: flex;
        flex-direction: column;
        font-size: 0.7rem;
        color: #000;
        margin: 0;
        flex: 1;
    }
    .content > ul > li > p:nth-child(2) {
        text-align: center;
    }
    .content > ul > li > p:nth-child(3) {
        text-align: right;
    }
    .content .data-empty {
        width: 100%;
        text-align: center;
        padding: .3rem 0;
    }

</style>