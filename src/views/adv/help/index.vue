<template>
    <section>
        <van-nav-bar
            title="新手指引"
            left-arrow
            fixed
            @click-left="$back()"
        />
        <div class="content">
            <img src="../../../assets/imgs/guide.jpg" alt="">
            <div class="bottom-btn">
                <router-link class="btn" to="/buy/600036?simulate=1">立即点买</router-link>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        name: "index",
    }
</script>

<style scoped>
    .content img {
        margin-bottom: 5rem;
    }
    .bottom-btn {
        background-color: #fff;
        padding: 1rem 1.8rem;
        position: fixed;
        bottom: 0;
        width: 100%;
        border-top: 1px solid #f1f2f3;
        z-index: 1;
    }
    .btn {
        background-color: #ff5e00;
        border-radius: 0.3rem;
        color: #fff;
        height: 2.6rem;
        line-height: 2.6rem;
        padding: 0 0.5rem;
        font-size: 0.85rem;
        text-align: center;
        outline: none;
        display: block;
        width: 100%;
    }
</style>
