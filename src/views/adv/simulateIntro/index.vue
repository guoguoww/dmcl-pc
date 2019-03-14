<template>
    <section>
        <van-nav-bar
            title="点买体验"
            left-arrow
            fixed
            @click-left="$back()"
        />
        <div class="content">
            <img src="../../../assets/imgs/simulateInfo.jpg" alt="">
            <router-link to= "/buy/600036?simulate=2" tag="p" class="experience">
                <img src="../../../assets/imgs/btn.png" alt="">
            </router-link>
        </div>
    </section>
</template>

<script>
    export default {
        name: "index",
    }
</script>

<style scoped>
    .content {
        background: #fff;
        position: relative;
    }
    .content .experience {
        position: absolute;
        top: 54%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 40%;
    }
</style>