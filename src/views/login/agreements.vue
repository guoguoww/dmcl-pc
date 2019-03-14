<template>
    <section>
        <van-nav-bar
            title="注册协议"
            left-arrow
            fixed
            @click-left="$back()"
        />
        <div class="content">
            <div class="details">内容暂时为空</div>
        </div>

    </section>
</template>

<script>
    export default {
        name: "agreement",
        data() {
            return {
                agreement: { //协议
                    title: '',
                    content: '',
                },
            }
        },
        created() {
        },
        methods: {

        }
    }
</script>

<style scoped>
    .details {
        background: #fff;
        padding: 0 1rem;
        text-align: left;
    }
</style>
