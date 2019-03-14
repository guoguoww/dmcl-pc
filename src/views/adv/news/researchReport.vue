<template>
    <section>
        <van-nav-bar
            title="研报"
            left-arrow
            fixed
            @click-left="$back()"
        />
        <div class="content">
            <ul>
                <li v-for="(item, index) in tradingList" v-if="tradingList.length != 0" :key="index" @click="insDetail(item)">
                    <p>{{item.title}}</p>
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
        name: "researchReport",
        data(){
            return {
                page: {
                    start: 0,
                    rows: 10,
                    type: 1,
                },
                total: '',
                tradingList: [],
            }
        },
        mounted() {
            this.newsInfo();
        },
        methods: {
            newsInfo() {//新闻资讯
                this.$axios({
                    method: 'post',
                    url: '/api/home/stock/news',
                    params: this.page,
                }).then(res => {
                    if(res.data.errorCode === 0){
                        this.total = res.data.data.total;
                        this.tradingList = [...this.tradingList,...res.data.data.data];
                    }
                })
            },
            insDetail(item){
                window.location.href = item.url;
                // window.open(item.url, "_blank");
            },
            loadingMore(){
                if(this.tradingList.length == this.total) {
                    return
                }
                this.page.start += this.page.rows;
                this.newsInfo();
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
    .content .data-empty {
        width: 100%;
        text-align: center;
    }
</style>