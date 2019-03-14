<template>
    <section>
        <van-nav-bar
            title="公告详情"
            left-arrow
            fixed
            @click-left="$back()"
        />
        <div class="content">
            <h4>{{paramsData.title}}</h4>
            <div class="newsCon" v-html="paramsData.content"></div>
        </div>
    </section>
</template>

<script>
    export default {
        name: "detail",
        data() {
            return {
                paramsData: {},
            }
        },
        created() {
            if(this.$route.params.paramsData) {
                window.localStorage.setItem('insDet',JSON.stringify(this.$route.params.paramsData));
            }

            if(window.localStorage.getItem("insDet")) {
                this.paramsData = JSON.parse(window.localStorage.getItem("insDet"))
            }
        },
        beforeDestroy() {
            window.localStorage.removeItem('insDet')
        }
    }
</script>

<style scoped>
    .content {
        background: #fff;
    }
    h4 {
        padding: 0 0.85rem;
        height: 3rem;
        font-size: 1rem;
        text-align: center;
    }
    div.newsCon {
        padding: 0 0.85rem;
        text-align: left;
        line-height: 1.8rem;
        font-size: 0.9rem;
    }
</style>
