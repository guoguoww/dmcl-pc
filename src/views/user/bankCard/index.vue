<template>
    <section>
        <van-nav-bar
            title="银行卡管理"
            left-arrow
            fixed
            @click-left="$back()"
        />
        <div class="content">
            <ul>
                <li>
                    <router-link to="/bankcardAdd"><i class="icon-bankcard"></i><p>添加银行卡</p></router-link>
                </li>

                <li>
                    <router-link to="/bankCardList"><i class="icon-bankcard"></i><p>查看银行卡列表</p></router-link>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
    export default {
        name: "index"
    }
</script>

<style scoped>
    ul {
        margin-top: 0.7rem;
    }
    ul li {
        padding-left: 1rem;
        background-color: #fff;
        border-bottom: 1px solid #f1f2f3;
    }
    ul li a {
        display: flex;
        align-items: center;
        flex-basis: 100%;
        padding: 1.4rem 0;
        position: relative;
    }
    ul li a:after {
        content: "\E930";
        font-family: icomoon;
        color: #e0e0e0;
        font-size: 0.9rem;
        text-align: right;
        padding-right: 1.8rem;
        position: absolute;
        right: 0;
    }
    ul li a i {
        color: #ff5e00;
        font-size: 1.2rem;
        width: 10%;
        display: inline-block;
    }
    ul li a p {
        font-size: 0.8rem;
        color: #212121;
        padding: 0;
        margin: 0;
    }
</style>
