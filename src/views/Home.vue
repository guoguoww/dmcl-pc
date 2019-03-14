<template>
  <section>
    <header>
      <div class="header_nav">
        <a class="left-btn"><i class="icon-service"></i></a>
        <span>点金策略</span>
        <a class="right-btn"><i class="icon-question"></i></a>
      </div>
    </header>
    <div id="lunbo">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(item, index) in images" :key="index">
          <router-link :to="index === 0? '/intro': `/buy/${randomCode}?simulate=2`"> <img :src="item.url" /></router-link>
        </van-swipe-item>
      </van-swipe>
    </div>
    <!--公告-->
    <div class="noticeContent" v-if="announce.title">
        <div>
          <p @click="$router.push({name: 'announceDetail',params: {paramsData: announce}})">公告: {{announce.title}}</p>
          <span class="moreInfo" @click="$router.push('/announcement')">更多</span>
        </div>
    </div>
    <div class="noticeContent" v-else>
      <div>
        公告:<p style="text-align: center">暂无公告</p>
      </div>
    </div>
    <div class="optionalWrap">
      <ul>
        <li v-for="(i,index) in big_market" :key="index">
          <p class="title">{{i.name}}</p>
          <p class="mainInfo"><i :class="i.am<0?'arrowDown':'arrowUp'"></i> <span :class="i.am<0?'green':'red'">{{i.price}}</span></p>
          <p><span :class="i.am<0?'green':'red'">{{i.am}} {{i.amr}}%</span></p>
        </li>
      </ul>
    </div>
    <div class="indexLink">
      <a @click.stop.prevent="$router.push(`/simulateIntro`)">
        <img src="../assets/imgs/banner-exp.jpg">
      </a>
      <ul class="nav">
        <li><router-link to="/trade"><i class="icon-stock"></i><p>发布策略</p></router-link></li>
        <li><a @click.stop.prevent="$router.push(`/buy/${randomCode}?simulate=2`)"><i class="icon-chart"></i><p>点买体验</p></a></li>
        <!--<li><router-link to="/topUp"><i class="icon-purse "></i><p>充值中心</p></router-link></li>-->
        <li><a @click.stop.prevent="$router.push('/newGuide')"><i class="icon-news"></i><p>新手指引</p></a></li>
        <li><a @click.stop.prevent="$router.push('/intro')"><i class="icon-purse"></i><p>推广赚钱</p></a></li>
      </ul>
    </div>
    <div class="list">
      <div class="titleTab clearfix">
        <ul class="tab">
          <li :class="{active: tabActive == index}" v-for="(item, index) of tabLists" @click="switchTab(index,item.val)">
            <span>{{item.name}}</span>
          </li>
        </ul>
        <p class="more" @click="moreLink(tabActive)">更多</p>
      </div>
      <ul class="listCon dynamic" v-if="tradingList.length !== 0">
        <li class="latestDt" v-for="(item, index) in tradingList" v-if="index < 3 && tabActive == 0" >
          <p><span>{{item.stockName }}</span><span>{{item.stockCode }}</span></p>
          <p><span>{{item.buyPoint }}</span><span>{{item.type == 0?'普通策略': '牛人策略'}}</span></p>
          <p><span>{{item.chnName }}</span><span>{{item.buyTime }}</span></p>
          <a @click.stop.prevent="$router.push(`/buy/${item.stockCode}?simulate=1`)">点击点买</a>
        </li>
        <li v-for="(list, index) in tradingList" v-if="index < 3 && tabActive == 1">
          <label><h4>{{list.chnName}}</h4><span >{{list.stockName}} {{list.stockCode}}</span></label>
          <label><p class="red">盈率</p><span>{{Number((parseFloat(list.sellPoint)-parseFloat(list.buyPoint))/parseFloat(list.buyPoint)).toFixed(2)}}%</span></label>
          <a @click.stop.prevent="$router.push(`/buy/${list.stockCode}?simulate=1`)">点击点买</a>
        </li>
      </ul>
      <div v-else>
        <p class="data-empty">暂无数据</p>
      </div>
    </div>

    <div class="zxInfoList">
      <div class="typeNewsTit">
        <div>
          <span v-for="(item, index) of newsType" :key="index" :class="{active: typeNewsIndex == index}" @click="newsTypeClick(index,item.name)">{{item.name}}</span>
        </div>
        <span class="more" @click="moreClick(typeNewsIndex)">更多</span>
      </div>
      <ul v-if="zxLists.length != 0">
        <li v-for="(item, index) of zxLists" :key="index">
          <p @click="insDetail(item)">{{item.title}}</p>
          <div><span>来源：{{item.from}}</span> <span>{{item.createTime}}</span></div>
        </li>
      </ul>
      <div v-else>
        <p class="data-empty">暂无数据</p>
      </div>
    </div>
  </section>
</template>

<script>
    import socket from "@/assets/js/ws";
    export default {
        name: 'home',
        data () {
            return {
                serviceTel: '', //客服电话
                images: [
                    // {
                    //     id: "0",
                    //     url: require('../assets/imgs/banner1.png'),
                    // },
                    // {
                    //     id: "1",
                    //     url: require('../assets/imgs/banner2.png'),
                    // },
                ], //轮播图片
                tabLists: [
                    {name: '最新动态',val: 0},
                    {name: '盈利排名',val: 1},
                ],
                tabActive: 0, //tab选中
                typeNewsIndex: 0, //首页最下面的新闻类
                tradingList: [], //交易动态
                announce: [],//公告
                proInsList: [], //专业机构列表
                newsList: [], //公司新闻
                zxLists: [],//新闻资讯数据
                page: { //分页数据
                    start: 0,
                    rows: 10,
                },
                newsRequestPar: {
                   start: 0,
                   rows: 10,
                   type: 0,
                },
                newsType: [
                    {name: '资讯', i: 0},
                    {name: '研报', i: 1},
                    {name: '要闻', i: 2},
                ],
                announceTimer: null,
                big_ws:null,//大盘的websocket
                big_market:[],//大盘的行情
                randomCode: '',//随机代码
            }
        },
        created(){
            this.setannounceTimer();
            this.get_big_market();
        },
        mounted() {

            this.slideShow();
            this.getTradingList();
            this.newsInfo();

        },
        destroyed() {
            if (this.big_ws) {
                this.big_ws.socket.close()
            };
            //页面销毁时关闭定时器
            clearInterval(this.announceTimer);
            this.announceTimer=null;
        },
        methods: {

            slideShow(){//获取首页轮播图接口
                this.$axios.post('/api/home/slide/show',{type: 0,}).then(res => {
                    if(res.data.errorCode === 0) {
                      // this.images = [...this.images, ...res.data.data];
                      this.images = res.data.data;
                    }
                })
            },
            switchTab(type,val) { //列表切换
                this.tabActive = type;

                this.page.start = 0;

                if(val === 0) {
                    this.getTradingList();
                }else if(val === 1) {
                    this.expertInfo();
                }
            },
            // 定时获取公告
            setannounceTimer(){
                if (this.announceTimer) {
                    clearInterval(this.announceTimer)
                    this.noticeInfo()
                }
                this.noticeInfo()
                this.announceTimer=setInterval(()=>{
                    this.noticeInfo()
                },10000)
            },
            noticeInfo(){//首页公告
                this.$axios({
                    method: 'post',
                    url: '/api/home/notice',
                    params: this.page,
                }).then(res => {
                    if(res.data.errorCode === 0){
                        this.announce = res.data.data.data[0];
                    }
                })
            },
            newsInfo() {//新闻资讯
                this.$axios({
                    method: 'post',
                    url: '/api/home/stock/news',
                    params: this.newsRequestPar,
                }).then(res => {
                    if(res.data.errorCode === 0){
                        this.zxLists = res.data.data.data;
                    }
                })
            },
            expertInfo() {//操盘达人
                this.$axios({
                    method: 'post',
                    url: '/api/home/trader/expert',
                    params: this.page,
                }).then(res => {
                    if(res.data.errorCode === 0){
                        if(res.data.data.data.length != 0) {

                          this.tradingList = res.data.data.data;

                        }
                    }
                })
            },
            getTradingList() { //获取交易动态
                this.$axios({
                    method: 'post',
                    url:'/api/home/trade/deals',
                    params: this.page,
                }).then(res => {
                    if (res.data.errorCode === 0) {

                        if(res.data.data.data.length!= 0){
                            this.tradingList = res.data.data.data;

                            this.randomCode = res.data.data.data[Math.floor(Math.random()*(res.data.data.data.length))].stockCode;
                        }
                    }
                })
            },
            moreLink(type) { //更多跳转
                if(type === 1) { //操盘达人
                    this.$router.push('/traders')
                }else if(type === 0) { //最新动态
                    this.$router.push('/recentNews')
                }
            },
            newsTypeClick(index,name){
                this.typeNewsIndex = index;

                if(name == '研报') {
                    this.newsRequestPar.type = 1;
                }
                if(name == '要闻') {
                    this.newsRequestPar.type = 2;
                }
                if(name == '资讯') {
                    this.newsRequestPar.type = 0;
                }
                this.newsInfo();

            },
            moreClick(index){//新闻类的更多跳转
                if(index === 0) { //资讯
                    this.$router.push('/newsInfo')
                }else if(index === 1) { //研报
                    this.$router.push('/researchReport')
                }else if(index === 2) {//要闻
                    this.$router.push('/newsInfoList')
                }
            },
            insDetail(item) { //详情跳转
                // window.location.href = item.url;
                window.open(item.url,'_blank') ;
            },
            // 获取大盘行情 获取行情 上证指数:sh000001 深证指数:sz399001 创业指数:sz399006
            get_big_market(){
                if (this.big_ws) {
                    this.big_ws.socket.close();
                }
                this.big_ws=new socket('s_sh000001,s_sz399001,s_sz399006',(data)=>{

                    data.split('=').map(i=>{
                        // console.log(i)
                        let market=i.split(',')
                        if (market.length<6) {
                            return
                        }
                        if (this.big_market.length == 3) {
                            this.big_market.map(v=>{
                                if (v.name==market[0]) {
                                    v.price=(+market[1]).toFixed(2)
                                    v.am=(+market[2]).toFixed(2)
                                    v.amr=(+market[3]).toFixed(2)

                                }
                            })
                            return;
                        }
                        this.big_market.push({
                            name:market[0],
                            price:(+market[1]).toFixed(2),
                            am:(+market[2]).toFixed(2),
                            amr:(+market[3]).toFixed(2)
                        })

                    })
                })
            },
        },
        watch: {

        }

    }
</script>

<style scoped>
  /*头部*/
  header {
    background: #ff5e00;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: 3rem;
    line-height: 3rem;
    color: #fff;
    z-index: 9;
    box-sizing: content-box;
  }
  header .header_nav {
    height: 3rem;
    position: relative;
  }
  header .header_nav a{
    padding: 0 1rem;
    color: #fff;
    display: inline-block;
  }
  header .header_nav a.left-btn {
    position: absolute;
    left: 0;
  }
  header .header_nav a.right-btn {
    position: absolute;
    right: 0;
  }
  header .header_nav i {
    font-size: 1.1rem;
    vertical-align: middle;
  }
  header .header_nav span {
    font-size: 1.1rem;
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    width: 65%;
    margin: 0 auto;
  }
  /*轮播*/
  #lunbo {
    margin-top: 3rem;
    height: 9rem;
  }
  .noticeContent {
    background: #fff;
    padding: .5rem 1rem;
    font-size: .9rem !important;
  }
  .noticeContent > div {
    display: flex;
    justify-content: space-between;
  }
  .noticeContent > div p {
    font-size: .9rem;
  }
  /*指数*/
  .optionalWrap {
    background: #fff;
    padding: .8rem;
    font-size: .8rem;
    margin-top: .5rem;
  }
  .optionalWrap ul {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .optionalWrap ul li {
    flex: 1;
    border-right: 1px solid #f1f2f3 ;
  }
  .optionalWrap ul li p{
    display: flex;
    justify-content: center;
    align-items: flex-start;
    line-height: 1.5;
  }
  .optionalWrap ul li p.title {
    color: #212121;
    padding-bottom: .2rem;
  }
  .optionalWrap ul li p.mainInfo {
    font-size: 1rem;
  }
  .optionalWrap ul li p:last-child{
    font-size: .6rem;
  }
  .optionalWrap ul li:last-child {
    border-right: none;
  }
  .red {
    color: #ff5e00 !important;
  }
  .green {
    color: #18b676 !important;
  }
  .arrowUp {
    width: 0;
    height: 0;
    margin-top: 0.2rem;
    border: .3rem solid transparent;
    border-bottom-color: #ff494b;
  }
  .arrowDown {
    width: 0;
    height: 0;
    margin-top: 0.5rem;
    border: .3rem solid transparent;
    border-top-color: #18b676;
    vertical-align: middle;
  }
  /*首页跳转区*/
  .indexLink {
    background-color: #fff;
    margin: 0.85rem 0;
  }
  .indexLink ul {
    display: flex;
    text-align: center;
    justify-content: space-between;
  }
  .indexLink .nav li {
    width: 25%;
    position: relative;
    padding: 1rem 0;
    background-color: #fff;
    outline: none;
  }
  .indexLink .nav li i {
    color: #ff5e00;
    height: 1.8rem;
    line-height: 1.8rem;
    font-size: 1.6rem;
    display: inline-block;
    margin: 0 0 0.2rem;
  }
  /*列表*/
  .list {
    background-color: #fff;
  }
  .list .titleTab {
    height: 3rem;
    line-height: 3rem;
    font-size: 0.9rem;
    padding: 0 0.85rem;
    border-bottom: 1px solid #f1f2f3;
  }
  .list .titleTab .tab {
    height: 100%;
    float: left;
  }
  .list .titleTab .tab li {
    float: left;
    padding: 0 0.2rem;
    height: 100%;
  }
  .list .titleTab .tab li span {
    display: inline-block;
    width: 100%;
    height: 100%;
    padding: 0 .5rem;
  }
  .list .titleTab .tab li.active span {
    border-bottom: 3px solid #ff5e00;
    color: #ff5e00;
  }
  .list .titleTab .tab li:not(:last-child) {
    /*border-right: 1px solid #f1f2f3;*/
  }
  .list .titleTab p {
    float: right;
    font-size: 0.8rem;
    color: #999;
  }
  .list .listCon {
    padding: 0 0.85rem;
  }
  .list .listCon li {
    border-bottom: 1px solid #f1f2f3;
    padding: .3rem .6rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  /*最新动态*/
  .latestDt {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .latestDt > p {
    display: flex;
    flex-direction: column;
    padding: .2rem 0;
    /*flex: 1;*/
  }
  .latestDt > p:nth-child(2) {
    text-align: center;
  }
  .latestDt > p:last-child {
    text-align: right;
  }
  .latestDt > p span:last-child {
    padding-top: .1rem;
  }
  .dynamic li label{
    width: 44%;
    text-align: left;
    font-size: 0.85rem;
  }
  .dynamic li label p {
    font-size: 0.85rem;
  }
  .dynamic li span {
    color: #7a7a7a;
  }
  .dynamic li label + label {
    width: 36%;
  }
  .dynamic li a {
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
  /*专业机构*/
  .moreInfo {
    color: #ff5e00;
  }
  p.data-empty {
    width: 100%;
    text-align: center;
    padding: 1rem 0;
    font-size: .8rem;
  }
  .zxInfoList {
    margin-top: .5rem;
    font-size: 0.9rem;
    background: #fff;
    margin-bottom: 3.7rem;
  }
  .zxTit {
    display: flex;
    justify-content: space-between;
    color: #ff5e00;
    border-bottom: 1px solid #eee;
    padding: .5rem .85rem;
  }
  .zxTit span:first-child {
    padding-left: .15rem;
  }
  .zxTit span.more {
    font-size: 0.8rem;
    color: #999;
  }
  .zxInfoList > ul {
    padding: 0 .5rem;
  }
  .zxInfoList > ul li {
    padding: .5rem .85rem;
    border-bottom: 1px solid #eee;
  }
  .zxInfoList > ul li > p {
    font-size: .9rem;
    white-space: nowrap;
    overflow:hidden;
    word-break:keep-all;
    text-overflow:ellipsis;
  }
  .zxInfoList > ul li > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .zxInfoList > ul li > div span {
    font-size: .7rem;
    color: #999;
    padding-top: .1rem;
  }
  .typeNewsTit {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    height: 3rem;
    line-height: 3rem;
    padding: 0 1.2rem;
    font-size: .8rem;
  }

  .typeNewsTit > div > span {
    padding: 0 .5rem;
    display: inline-block;
  }

  .typeNewsTit > div > span.active {
    color: #ff5e00;
    border-bottom: 3px solid #ff5e00;
  }

  .typeNewsTit > div {
    display: flex;
    justify-content: space-between;
    font-size: .9rem;
    text-align: left;
  }
  .typeNewsTit > span {
    display: inline-block;
    width: 20%;
    text-align: right;
    color: #999;
  }
</style>

