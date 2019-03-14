<template>
  <div class="" style="padding-top:40px;">
    <header>
      <div class="title">
          <van-icon name="arrow-left" @click="$router.go(-1)" />
          <ul>
            <li :class="simulate==1?'active':''" @click="$router.push(`/buy/${code.slice(2)}?simulate=1`)"><a>A股点买</a></li>
            <li :class="simulate==2?'active':''" @click="$router.push(`/buy/${code.slice(2)}?simulate=2`)"><a>模拟点买</a></li>
          </ul>
      </div>
    </header>
    <div class="market">
      <div class="search" v-if="simulate==2">
        <input placeholder="请输入股票代码/名称/拼音" @input="search" v-model="keyword">
        <i v-show="keyword.length" @click="keyword=''"></i>
      </div>
      <div class="search_list" v-if="keyword.length">
        <ul>
          <li class="search_item" v-for="i in search_list" :key="i.id">
            <div class="sname"  @click.stop="mn(i)"><span>{{i.name}}</span><span>{{i.code}}</span></div>
            <!-- <div :class="i.gain>0?'up':'down'"><span>{{i.price||'--'}}</span></div>
            <div :class="i.gain>0?'up':'down'"><span>{{i.gain||'--'}}%</span></div>
            <div class="addIcon" @click.stop="addOptional(i.code)"><img v-show="!i.isOptional" src="@/assets/imgs/add.png" alt=""></div> -->
            <div><button class="btn"  @click.stop="mn(i)">点买体验</button></div>
          </li>
        </ul>
      </div>
      <div class="info" v-show="!keyword.length">
        <div class="name">
          <h3 class="row"><span>{{m.name}}</span>
            <!-- <i class="icon-add"></i> -->
          </h3>
          <label>{{code}}</label>
        </div>
        <div :class="m.change<0?'down':'up'">
          <h4><span>{{m.price}}</span><i :class="m.change<0?'icon-arrow-down':'icon-arrow-up'"></i></h4>
          <p :class="m.change<0?'down':'up'">{{m.change}}&nbsp;&nbsp;{{m.chg}}%</p>
        </div>
        <button class="btn" @click="$router.push(`/market/${code}?simulate=${simulate}`)">查看行情</button>
      </div>
    </div>
      <div class="main"  v-show="!keyword.length">
        <ul class="options">
          <li>
            <p class="between" style="align-items:center;">
              <label>策略金额</label>
              <span><input type="number" placeholder="输入策略金额" v-model="selectMoney" v-if="simulate==1"></span>
            </p>
            <ul class="select">
              <li v-for="i in moneyList" :key="i.num" :class="selectMoney==i.num?'active':''" @click="selectMoney=i.num">{{i.name}}</li>
            </ul>
          </li>
          <li>
            <!-- <p class="normal">
              <label>委托类型</label>
              <select style="border: none;color: #7a7e8a;" v-model="tacticsType" >
                <option disabled>请先选择购买方式</option>
                <option value="0">市价委托</option>
                <option value="1">限价委托</option>
              </select>
            </p> -->
            <p class="normal" v-if="tacticsType==1"><label>限价金额</label>
            <input type="number" v-model="restrictPoint" placeholder="请输入限价金额" @blur="restrictBlur">
              <span style="margin-left: .3rem;">{{m.min}}-{{m.max}}</span>
            </p>
          </li>
        </ul>
        <ul class="options" v-if="simulate==1">
          <li class="base">
            <p class="between"><label>策略匹配</label><label>股数 : {{numberOfShares}}股</label><label>市值 : {{marketValue}}万元</label></p>
            <ul class="select">
              <li v-for="i in baseList" :key="i" @click="()=>{selectBase=i}" :class="selectBase==i?'active':''">{{i}}倍</li>
            </ul>
          </li>
          <li>
            <!-- <p class="normal"><label>买入数量</label><em>{{numberOfShares}}股</em></p> -->
            <!-- <p class="normal"><label>市值</label><em>¥ 94163</em></p> -->
          </li>
        </ul>
        <ul class="options"  v-if="simulate==1">
          <li>
            <p class="normal"><label>止盈</label>
              <van-stepper v-model="surplus" disable-input :min="surplusRange.min" :max="surplusRange.max" :step="0.01" class="up xxxx" />
              <span style="margin-left: .3rem;">涨 <span class="up">{{stopRate(surplus,1)}}%</span> 自动平仓</span>
              <span style="margin-left: .3rem;display:none;" >{{surplusRange.min}} - {{surplusRange.max}}</span>
            </p>
            <p class="normal"><label>止损</label>
              <van-stepper v-model="loss" disable-input :min="lossRange.max" :max="lossRange.min" :step="0.01" class="down xxxx" />
              <span style="margin-left: .3rem;">跌 <span class="down">{{stopRate(loss)}}%</span> 自动平仓</span>
              <span style="margin-left: .3rem;display:none;">{{lossRange.min}} - {{lossRange.max}}</span>
            </p>
          </li>
        </ul>
        <ul class="options"  v-if="simulate==1">
          <li>
            <p class="between baseline"><label>建仓费</label>
              <label>
                <label><em class="large">{{createFee}}</em>元</label>
              </label>
            </p>
          </li>
          <!-- <li>
            <p class="between"> 
              <label>交易费</label>
              <label><em class="large">{{pingtaiFee}}</em>元</label>
            </p>
          </li>
          <li>
            <p class="between baseline"><label>管理费</label>
              <label>
                <label><em class="large">{{fees.manageFee||0}}</em>元/天/千元</label>
              </label>
            </p>
          </li> -->
          <li>
            <p class="between">
              <label>递延费</label>
              <label><input v-model="isDefer" type="checkbox" style="vertical-align: middle;"><span style="font-size: 12px; vertical-align: middle;"> 自动递延</span></label>
              <label><em class="large">{{fees.deferFee||0}}</em>元/天/万元</label>
            </p>
          </li>
        </ul>
        <ul class="options" v-if="simulate==2">
        <li>
          <p class="between"><label>买入价格 : {{m.price}} 现价买入</label><label></label></p>
        </li>          
        <li>
          <p class="between baseline"><label>持仓时间 <em>T+1</em></label><label>支付交易综合费<em class="large">100</em>元
            <!-- <div class="tip">(含前两个交易日的费用)</div> -->
          </label></p>
        </li>
        <li>
          <p class="between"><label>建仓费</label><label><em class="large">0</em>元</label></p>
        </li>
        </ul>
      </div>


    <div class="options bottom-btn" v-show="!keyword.length">
      <p class="between"><label>总计<em class="large">{{totalPayment}}</em>元</label><label>余额<em>{{userInfo.money}}</em>元</label></p>
      <div class="tip">
        <input type="checkbox" id="xy" v-model="isread">
        <label for='xy' >我已阅读</label>
        <a @click="$router.push('/coAgreement')">《用户协议》</a>
      </div>
      <button class="btn disable" v-if="this.m.price>=this.m.close*1.1||this.m.price<=this.m.close*0.9">涨停或跌停不可买入</button>
      <button class="btn" @click="orderShow=true" v-else>立即点买</button>
    </div>
    <van-dialog
      title="确认下单"
      message='111'
      v-model="orderShow"
      show-cancel-button
      :before-close="orderConfirm"
    >
      <ul class="confirm_info">
        <li>
          <span>股票代码</span><span>{{code}}</span>
        </li>
        <li>
          <span>股票名称</span><span>{{m.name}}</span>
        </li>
        <li>
          <span>买入价格</span><span>{{m.price}}</span>
        </li>
        <li>
          <span>策略金额</span><span>{{selectMoney}}</span>
        </li>
        <li v-if="simulate==1">
          <span>买入数量</span><span>{{numberOfShares}}股</span>
        </li>
      </ul>
    </van-dialog>
  </div>
</template>

<script type="">
import socket from "@/assets/js/ws";

export default {
  name: "buy",
  data() {
    return {
      m:[],//行情列表
      // moneyList: [1000, 2000, 3000, 5000, 10000, 20000, 30000, 100000], //保证金
      moneyList: [{num:1000,name:1000}, {num:2000,name:2000}, {num:3000,name:3000}, {num:5000,name:5000}, {num:10000,name:'一万'}, {num:20000,name:'两万'}, {num:30000,name:'三万'}, {num:50000,name:'五万'}], //保证金
      selectMoney: 1000,//保证金
      tacticsType:0,//委託類型
      fees:{},//费率
      baseList:[],//倍数
      selectBase:8,//选择的倍数
      surplus:0,//止盈
      loss:0,//止损
      restrictPoint:null,//限价委托价格
      isDefer:1,//是否自动递延
      isread:1,//是否阅读协议
      userInfo:{
        money:0
      },
      orderShow:false,//
      ws:null,
      keyword:'',
      search_list:[],//搜索列表
    };
  },
  computed: {
    //是否是模拟点买 2是 1不是
    simulate(){
      if (!this.$route.query.simulate) {
        return 1
      }
      return this.$route.query.simulate
    },
    //股票代码
    code(){
      let code=this.$route.params.code
      
      code.substr(0,1)=='6'?code='sh'+code:code='sz'+code
      if (code.length>8) {
       code=code.slice(2)        
      }
      return code
    },
    //股数 : math.floor(保证金*倍数/当前价/100)*100   
    numberOfShares(){      
      const [money,base,price]=[this.selectMoney,this.selectBase,this.m.price||0]
      if (price==0) {
        return 0
      }
      // console.log((this.selectMoney*this.selectBase/this.m.price/100)*100);
      
     return Math.floor(money*base/price/100)*100

    },
    //市值 :  股数 * 当前价
    marketValue(){
      const price=this.m.price||0;      
      if (isNaN(this.numberOfShares*price/10000)) {
        return 0.00
      }
      return (this.numberOfShares*price/10000).toFixed(2)
    },
    //止盈=保证金*倍数*（1+止盈率）
    surplusRange(){
      let [money,maxBase,minBase]=[+this.m.price,+this.fees.maxProfit+1,+this.fees.minProfit+1]
      if (this.restrictPoint) {
        money=this.restrictPoint
      }
      // (money*0.2+money)
      //初始止盈
     if (money&&minBase) {
       if (!this.surplus) {
        this.surplus=((money)*maxBase).toFixed(2)          
       }
     }
      return {
        min:(money*minBase).toFixed(2),
        max:(money*maxBase).toFixed(2)
      }
    },
    //止损=保证金*（1-止损率）
    lossRange(){
      let [money,maxBase,minBase]=[+this.m.price,1- (+this.fees.maxLoss),1-(+this.fees.minLoss)]
       if (this.restrictPoint) {
        money=this.restrictPoint
      }
      //(money-money*0.08)
            //初始止损
     if (money&&minBase) {
       if (!this.loss) {
        this.loss=(money*maxBase).toFixed(2)
       }
     }
      
      console.log(this.numberOfShares);
      //最大止损 现价-((保证金*倍数)/市值*现价)
      return {
        min:(money*minBase).toFixed(2),
        // max: (money-(((this.selectMoney*maxBase)/(((this.selectMoney*this.selectBase/this.m.price/100)*100)*money))*money)).toFixed(2)
         max:(money-(((this.selectMoney*maxBase)/(this.numberOfShares*money))*money)).toFixed(2)
      }
    },
    // 建仓费 保证金 * 倍数/1000 向上取整 * 建仓费比例 
    createFee(){
     const [selectMoney,base,createFeeBase]=[this.selectMoney,this.selectBase,+this.fees.createFee]
    return (Math.ceil(selectMoney*base/10000)*createFeeBase).toFixed(2)
    },
    //管理费
    pingtaiFee(){
        const [selectMoney,base,pingtaiFee]=[this.selectMoney,this.selectBase,+this.fees.pingtaiFee]
        if (selectMoney*base<10000) {
          return 20.00
        }
        
       return (Math.ceil(selectMoney*base)*pingtaiFee).toFixed(2)
    },
    //总支付
    totalPayment(){
      if (this.simulate==2) {
        return 100
      }
      return +this.createFee+(+this.selectMoney)
    }
  },
  watch: {
    simulate(v){
      this.keyword=''
      this.isSimulate()
      
    },
    code(){
      this.getMarket()
      this.getFees()
      this.getUser()
      this.isSimulate()
    }
  },
  created() {
    this.getMarket()
    this.getFees()
    this.getUser()
    this.isSimulate()
  },
  destroyed () {
     if (this.ws) {
      this.ws.socket.close()
    }
  },
  methods: {
    mn(i){
      this.$router.push(`/buy/${i.code}?simulate=${this.simulate}`);
      this.keyword='';
      // window.location.reload() 
    },
        //搜索
    search(){
      this.$axios.post(`api/trade/stock/search?searchContent=${this.keyword}`).then(res=>{
        if (!res.data.errorCode) {
          this.search_list=res.data.data
          // this.isOptional(this.search_list,this.optional)
          if (!this.keyword.length) {
            return 
          }
          // this.getMarket('search')
        }
      })
    },
    //止盈止损百分比
    stopRate(i,type){
      if (type) {
        if (i<=0) {
          return 0
        }
        if ((i-this.m.price)*100/i<0) {
          return 0
        }
       return ((i-this.m.price)*100/i).toFixed(2)
      }
      if (i<=0) {
          return 100
      }
      if ((this.m.price-i)*100/this.m.price<0) {
        return 0
      }
      return ((this.m.price-i)*100/this.m.price).toFixed(2)

    },
    //判断是否是模拟点买
    isSimulate(){
      if (this.simulate==2) {
          this.moneyList=[{num:5000,name:5000}]
          this.selectMoney=this.moneyList[0].num
        }else{
          this.moneyList=[{num:1000,name:1000}, {num:2000,name:2000}, {num:3000,name:3000}, {num:5000,name:5000}, {num:10000,name:'一万'}, {num:20000,name:'两万'}, {num:30000,name:'三万'}, {num:50000,name:'五万'}]
          this.selectMoney=this.moneyList[0].num
        }
    },
    //行情
    getMarket(){
      if (this.ws) {
      this.ws.socket.close()
    }
     this.ws=new socket(this.code,data=>{
        console.log(data.split('=')[1]);
        let m=data.split('=')[1].split(',')
          this.m={
              name:m[0],
              open:(+m[1]).toFixed(2),
              close:(+m[2]).toFixed(2),
              price:(+m[3]).toFixed(2),
              high:(+m[4]).toFixed(2),
              low:(+m[5]).toFixed(2),
              am:((m[4] - m[5]) / m[5] * 100).toFixed(2)=="NaN" ? 0 : ((m[4] - m[5]) / m[5] * 100).toFixed(2),//振幅
              change:(m[3] - m[2]).toFixed(2),//涨跌幅
              chg:((m[3] - m[2])* 100 / m[2]).toFixed(2),//涨跌幅 %
              max:(m[2] * 1.1).toFixed(2),//涨停
              min:(m[2] * 0.9).toFixed(2),//跌停
              vol:(m[8] / 100).toFixed(0),//成交量
              amount:(m[9] / 10000).toFixed(0),//成交额
          }
      })
    },
    //费率
    getFees(){
      this.$axios.post('api/trade/params').then(res=>{
        console.log(res);
        if (!res.data.errorCode) {
          this.fees=res.data.data
          this.baseList=this.fees.lever.split(',')
        }
      })
    },
    //限价范围
    restrictBlur(){      
      if(this.restrictPoint<this.m.min){
        this.restrictPoint=this.m.min
        return
      }
      if(this.restrictPoint>this.m.max){
        this.restrictPoint=this.m.max
      }
    },
    //确认下单
    orderConfirm(action, done) {
      if (action === 'confirm') {
        this.order()
        done()
      } else {
        done();
      }
    },
    //创建策略
    order(){
      // console.log(Number(this.marketCode.substr(2)));
      if (!this.isread) {
        this.$toast('勾选协议后交易!');
        return
      }
      // if (!this.in_time_range) {
      //   this.$toast('不在交易时段!');
      //   // return
      // }
      if (this.simulate==2) {
        if (this.userInfo.tradeSimulate==1) {
          this.$dialog.alert({
            title: '提示',
            message: '您已体验过模拟点买!'
          }).then(() => {
            // console.log(this.$route);
            this.$router.push(this.$route.path+'?simulate=1')
          });
          return
        }
        this.surplus=((+this.m.price)*(1+(+this.fees.minProfit))).toFixed(2)     
        this.loss=((+this.m.price)*(1-(+this.fees.minLoss))).toFixed(2)
      }
      this.$axios({
        url:'api/trade/create/order',
        method:'post',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        data:{
            "buyPrice": this.m.price,//股票现价
            "isDefer":+!this.isDefer,//是否递延
            "money": this.simulate==2?100:this.selectMoney,//保证金
            "restrictPoint": this.restrictPoint,//委托价
            "rightMoneyRatio": this.selectBase,//倍数
            "simulate": this.simulate,//是否模拟点买 1否 2是
            "stockCode": (this.code.slice(2)),//股票代码
            "stockName": this.m.name,//股票名字
            "stopLoss": this.loss,//止损
            "stopProfit": this.surplus,
            "tacticsType":this.tacticsType,// 策略类型 0 市价 1 限价
          }
      }).then(res=>{
        if (!res.data.errorCode) {
          this.$toast('下单成功!')
          // this.userInfo.money=res.data.data.userMoney
          this.$router.push(`/trade/?simulate=${this.$route.query.simulate||1}`)
          // if (this.tacticsType==0) {
          //   this.$router.push(`/trade/${this.$route.params.simulate}/sell`)
          // }else{
          //   this.$router.push(`/trade/${this.$route.params.simulate}/entrust`)
          // }
          
        }
      })
    },
    //获取用户信息
    getUser(){
      if (!this.$cookie.get('_auth')) {
        return 
      }
      this.$axios.post('api/user/query_user_msg').then(res=>{
        if (!res.data.errorCode) {
          this.userInfo=res.data.data
          
        }
      })
    }
  }
};
</script>

<style scoped lang="less">
@font-color: #7b7f8a;
  .search {
    padding:0.5rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
    input {
      border: none;
      padding: 0.3rem 0 0.3rem 2rem;
      background-image: url(../../assets/imgs/search.png);
      background-position: 0.5rem center;
      background-repeat: no-repeat;
      background-size: 1rem;
      width: 100%;
      border-radius: 3px;
      background-color: #f1f2f3;
    }
    img {
      height: 1.5rem;
      width: 1.5rem;
    }
  }
.search_list,.history_list {
    background-color: #fff;
  .search_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: .9rem;
    padding: .5rem;
    color: #565353;
    border-bottom: 1px solid #e3e3e3;
    margin-bottom: 0;
    padding-bottom: .5rem;
    .sname{
        display: flex;
        flex-direction: column;
    }
    .addIcon{
      height: 1rem;
      width: 1rem;
    }
  }
  .history_item{
    justify-content: space-between;
    padding: 0.5rem 1rem;
  }
}
header{
    height: 40px;
    background-color: #ff5e00;
        display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    position: fixed;
    width: 100%;
    top: 0;
    .title{
       i{
            position: absolute;
            left: 1rem;
            font-size: 1.2rem;
            top: 50%;
            transform: translateY(-50%);
       }
        ul {
          display: flex;
          font-size: 0.75rem;
          li {
            padding: 0.3rem 1rem;
            border: 1px solid #fff;
            &:last-child {
              border-top-right-radius: 5px;
              border-bottom-right-radius: 5px;
            }
            &:first-child {
              border-top-left-radius: 5px;
              border-bottom-left-radius: 5px;
              border-right: 0;
            }
            a {
              color: #fff;
            }
          }
          .active {
            background: #fff;
            a {
              color: #ff5e00;
            }
          }
        }
    }
}
.main{
  padding-bottom: 8rem;
}
select{
  outline: none;
}
input[type='text']{
  border: 1px solid #e0e0e0;
    border-radius: 3px;
    text-indent: .4rem;
}
.btn {
  padding: 0.3rem;
  font-size: 0.7rem;
  background: #fff;
  border: 0;
  border-radius: 5px;
  color: #ff5d01;
  border: 1px solid #ff5d01;
}

.market {
  background-color: #fff;
  margin-bottom: 1rem;
  // position: relative;
  font-size: 0.8rem;
  .info {
    display: flex;
    align-items: center;
    padding: 0.7rem 1rem;
    h4 {
      font-size: 1.2rem;
    }
    i {
      margin-left: 0.5rem;
    }
    label {
      color: @font-color;
    }
    > div {
      width: 34%;
    }
    .name {
      width: 44%;
      .row > * {
        display: inline-block;
        vertical-align: middle;
      }
      .row span {
        font-size: 1.1rem;
        font-weight: normal;
      }
    }
  }
}
.options {
  background-color: #fff;
  margin-top: 1rem;
  padding: 0 1rem;
  color: @font-color;
  > li {
    // border-bottom: 1px solid #f1f2f3;
    padding: 0.75rem 0;
  }
  .normal {
    align-items: center;
    label:first-child {
      width: 25%;
    }
  }
  em {
    color: #ff5e00;
    margin: 0 0.2rem;
  }
  p {
    display: flex;
    margin-bottom: 0.675rem;
    line-height: 1;
    font-size: 0.7rem;
    color: @font-color;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .between {
    justify-content: space-between;
    label:last-child {
      text-align: right;
    }
  }
  .base {
    ul {
      li {
        width: 30%;
        &:nth-child(n + 4) {
          margin-top: 0.5rem;
        }
      }
    }
  }
  .select {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    li {
      font-size: 0.8rem;
      border-radius: 0.3rem;
      border: 1px solid #e0e0e0;
      width: 23%;
      text-align: center;
      padding: 0.4rem 0;
      &:nth-child(n + 5) {
        margin-top: 0.5rem;
      }
      &.active {
        border-color: #ff5e00;
        color: #ff5e00;
      }
    }
  }
}


.options {
    background-color: #fff;
    margin-top: 1rem;
    padding: 0 1rem;
    color: #7a7a7a;
    .between {
    justify-content: space-between;
  }
   p{
    display: flex;
    margin-bottom: 0.5rem;
    line-height: 1;
  }
   em{
    color: #ff5e00;
    margin: 0 0.2rem;
  }
  .tip {
    color: #7a7a7a;
    font-size: 0.9rem;
    input{
      vertical-align: middle;
      margin-right:.3rem;
    }
    label{
      font-size: 12px;
       vertical-align: middle;
    }
    a{
      font-size: 12px;
      color: #00abff;
    }
  }
  .btn{
    background-color: #ff5e00;
    border-radius: 0.3rem;
    color: #fff;
    line-height: 2rem;
    padding: 0 0.5rem;
    font-size: 1.05rem;
    text-align: center;
    outline: none;
    display: block;
    width: 100%;
    margin-top: .75rem;
  }
  .disable{
  background-color: #a5a19e;
  border-color: #a5a19e;
}
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
.confirm_info{
  padding: 1rem;
  li{
    display: flex;
    justify-content: space-between;
  }
}
</style>
