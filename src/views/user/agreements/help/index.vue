<template>
    <section>
        <van-nav-bar
            title="帮助中心"
            left-arrow
            fixed
            @click-left="$back()"
        />
        <div class="content">
            <ul class="rule-list">
                <li>
                    <router-link to="/rule"  class="arrow-link">交易规则</router-link>
                </li>
                <li>
                    <router-link to="/aboutUs" class="arrow-link">关于我们</router-link>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
    export default {
        name: "help",
        data(){
            return {

            }
        },
    }
</script>

<style scoped>
    .content {
        padding:0 .7rem .5rem;
        padding-top: .5rem;
        background: #fff;
    }
    .content .rule-list li {
        background-color: #fff;
        padding-left: .5rem;
        line-height: 2.5rem;
        height: 2.5rem;
    }
    .content .rule-list li a {
        border-bottom: 1px solid #f1f2f3;
        display: block;
        position: relative;
        font-size: .9rem;
        color: #212121;
    }
    .arrow-link {
        height: 2.5rem;
        line-height: 2.5rem;
    }
    .arrow-link:after {
        content: "\E930";
        font-family: icomoon;
        color: #e0e0e0;
        font-size: 1.1rem;
        width: 1.1rem;
        text-align: right;
        position: absolute;
        line-height: 2.5rem;
        padding-right: .5rem;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        display: -webkit-box;
        -webkit-box-orient: horizontal;
        -webkit-box-pack: center;
        -webkit-box-align: center;
        display: -moz-box;
        -moz-box-orient: horizontal;
        -moz-box-pack: center;
        -moz-box-align: center;
    }


</style>