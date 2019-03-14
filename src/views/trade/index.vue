<template>
  <div class="main">
    <div class="header">
      <div class="h_top">
        <div class="money">
          <b>可用资产</b>
          <i style="font-size: 1rem;font-weight: 700;">¥ {{userInfo.money||0}}</i>
        </div>
        <div class="create_c">
            <button @click="$router.push(`/create_policy?simulate=${simulate}`)">{{simulate==1?'创建策略':'模拟点买'}}</button>
        </div>
      </div>
      <div class="h_bottom">
        <div class="money">
          <span>持仓市值</span>
          <i>¥ {{userInfo2.marketValue||0}}</i>
        </div>
        <div class="money">
          <span>持仓信用金</span>
          <i>¥ {{userInfo2.money||0}}</i>
        </div>
        <div class="money">
          <span>浮动盈亏</span>
          <i :class="totalPAL>0?'up':'down'">{{!orders.length|| !totalPAL? '--' : '¥ ' + totalPAL }}</i>
        </div>
      </div>
    </div>
    <van-tabs v-model="active" @change='tabChange'>
        <van-tab title="当前持仓">
            <div class="hold_list">
                <ul>
                    <li v-for="i in orders" :key="i.id">
                        <div class="item_top">
                            <div>
                                <span>股票/信用金</span>
                                <span>{{i.stockName}}</span>
                                <span>{{i.money}}元</span>
                            </div>
                            <div>
                                <span>现价/买入价</span>
                                <span>{{!i.price? '--': i.price}}</span>
                                <span>{{i.buyPoint}}</span>
                            </div>
                            <div>
                                <span>止盈/止损</span>
                                <span>{{i.stopProfit}}</span>
                                <span>{{i.stopLoss}}</span>
                            </div>
                            <div>
                                <span>浮动盈亏</span>
                                <span :class="PAL(i).PAL<0?'down':'up'">{{!i.price?  '--': PAL(i).PAL}}</span>
                                <span :class="PAL(i).PAL<0?'down':'up'">{{!i.price?  '--': PAL(i).ratio + '%'}}</span>
                            </div>
                        </div>
                        <div class="item_bottom">
                            <span>买入：{{i.buyTime}}</span>
                            <span>倍率：{{i.mulripleNum}}</span>
                        </div>
                        <div class="btns" v-if="simulate==1">
                            <button @click="stopPShow=true;sellOrder=i;stop.stopProfit=i.stopProfit;stop.stopLoss=i.stopLoss">修改止盈</button>
                            <button @click="stopLShow=true;sellOrder=i;stop.stopProfit=i.stopProfit;stop.stopLoss=i.stopLoss">修改止损</button>
                            <button @click="sellShow=true;sellOrder=i">平仓</button>
                        </div>
                    </li>
                </ul>
                <div class="loadmore" @click="loadmore" v-if='total!=orders.length'>
                    <p>加载更多</p>
                </div>
            </div>
        </van-tab>
        <!-- <van-tab title="当前委托">
            <div class="hold_list">
                <ul>
                    <li v-for="i in orders" :key="i.id">
                        <div class="item_top">
                            <div>
                                <span>股票/保证金</span>
                                <span>{{i.stockName}}({{i.stockCode}})</span>
                                <span>{{i.money}}元</span>
                            </div>
                            <div>
                                <span>委托价/数量</span>
                                <span>{{i.restrictPoint}}</span>
                                <span>{{i.stockNum}}股</span>
                            </div>
                            <div>
                                <span>止盈/止损</span>
                                <span>{{i.stopProfit}}</span>
                                <span>{{i.stopLoss}}</span>
                            </div>
                        </div>
                        <div class="item_bottom">
                            <span>自动递延：{{i.isDefer==0?'是':'否'}}</span>
                            <span>{{i.status==1?'买入':'卖出'}}委托</span>
                            <button  @click="cancel(i);sellOrder=i">取消委托</button>
                        </div>
                    </li>
                </ul>
                <div class="loadmore" @click="loadmore" v-if='total!=orders.length'>
                    <p>加载更多</p>
                </div>
            </div>
        </van-tab> -->
        <van-tab title="历史持仓">
            <div class="hold_list">
                <ul>
                    <li v-for="i in orders" :key="i.id">
                        <div class="item_top">
                            <div>
                                <span>股票/保证金</span>
                                <span>{{i.stockName}}</span>
                                <span>{{i.money}}元</span>
                            </div>
                            <div>
                                <span>买入/卖出</span>
                                <span>{{i.buyPoint}}</span>
                                <span>{{i.sellPoint}}</span>
                            </div>
                            <div>
                                <span>数量/倍率</span>
                                <span>{{i.stockNum}}股</span>
                                <span>{{i.mulripleNum}}</span>
                            </div>
                            <div>
                                <span>盈亏/收益率</span>
                                <span :class="i.sellPoint-i.buyPoint<0?'down':'up'">{{((i.sellPoint-i.buyPoint)/i.buyPoint).toFixed(2)}}</span>
                                <span :class="i.sellPoint-i.buyPoint<0?'down':'up'">{{((i.sellPoint-i.buyPoint)/i.buyPoint*100).toFixed(2)}}%</span>
                            </div>
                        </div>
                        <div class="item_bottom">
                           <span v-if="i.buyTime">买入时间: {{ i.buyTime.split(':')[0]+':'+i.buyTime.split(':')[1]}}</span>
                           <span v-if="i.sellTime">卖出时间: {{i.sellTime.split(':')[0]+':'+i.sellTime.split(':')[1]}}</span>
                        </div>
                    </li>
                </ul>
                <div class="loadmore" @click="loadmore" v-if='total!=orders.length'>
                    <p>加载更多</p>
                </div>
            </div>
        </van-tab>
    </van-tabs>
    <van-dialog v-model="sellShow" show-cancel-button :before-close="sellClose" title='确认平仓?'>
        <div class="dialog">
            <!-- <van-radio-group v-model="sellParams.type">
                <van-radio name="0">市价平仓</van-radio>
                <van-radio name="1">限价平仓</van-radio>
            </van-radio-group>
            <div class="xj" v-if="sellParams.type==1">
                <input type="text" placeholder="请输入限价" @blur="entrustBlur"  v-model="sellParams.entrustPoint">
                <span>{{(sellOrder.close*0.9).toFixed(2)}}-{{(sellOrder.close*1.1).toFixed(2)}}</span>
            </div> -->
        </div>
    </van-dialog>
    <van-dialog v-model="stopPShow" show-cancel-button :before-close="stopClose" title='修改止盈'>
        <div class="dialog">
          <p class="normal"><label>触发止盈</label>
            <van-stepper v-model="stop.stopProfit" :min="stopRange(sellOrder).profit[0]" :max="stopRange(sellOrder).profit[1]" :step="0.01" />
            <span style="margin-left: .3rem;">股票上涨{{ stopRate(stop.stopProfit,1)}}%</span>
            <!-- <span style="margin-left: .3rem;">{{stopRange(sellOrder).profit[0]}} - {{stopRange(sellOrder).profit[1]}}</span> -->
          </p>
        </div>
    </van-dialog>
    <van-dialog v-model="stopLShow" show-cancel-button :before-close="stopClose" title='修改止损'>
        <div class="dialog">
          <p class="normal"><label>触发止损</label>
            <van-stepper v-model="stop.stopLoss"    :max="stopRange(sellOrder).loss[0]" :step="0.01" />
            <span style="margin-left: .3rem;">股票下跌{{ stopRate(stop.stopLoss)}}%</span>
            <!-- <span style="margin-left: .3rem;display:none;">{{stopRange(sellOrder).loss[0]}} - {{stopRange(sellOrder).loss[1]}}</span> -->

          </p>
          <span>需补充保证金 :{{supplement}}</span>
        </div>
    </van-dialog>

  </div>
</template>

<script type="">
import socket from "@/assets/js/ws";

export default {
  name: "trade",
  data() {
    return {
    //   params: {
    //     start: 0,
    //     rows: 10,
    //     type: 0, //状态(默认是0)：0 持仓 1 委托中持仓 2 取消委托持仓 3 行权申请 4 平仓 5 订单取消
    //     isSimulate: 1 //1 不是 2 模拟
    //   },
      orders: [],//订单
      socket:null,
      total:0,
      active:0,//tab选项
      sellShow:false,//平仓的提示框
      sellOrder:{},//选择的订单
      sellParams:{//平仓参数
        id:'',//订单id
        stockCode:'',
        stockNum:null,//平仓股数(分仓时必填)
        value:'1',//是否分仓 1 不分 2 分仓
        type:'0',//是否卖出委托 0 不委托 1 委托
        entrustPoint:null,//委托价格(委托卖出时,必填)
      },
      stopPShow:false,//修改止盈提示框
      stopLShow:false,//修改止损提示框
    //   cancelShow:false,//取消委托提示框
      stop:{//止盈止损参数
        id:'',
        stopProfit:null,
        stopLoss:null
      },
      userInfo:{},//
      userInfo2:{},//
      o:[],//计算浮动盈亏的订单
      o_ws:null,
    };
  },
  created() {
      this.getorders()
      this.getUser()
  },
  destroyed () {
    if (this.o_ws) {
        this.o_ws.socket.close()
    }
    if (this.socket) {
        this.socket.socket.close()
    }

  },
  watch: {
      sellShow(v){
          if(!v){
             this.sellParams.entrustPoint=null

          }
      },
    stopPShow(v){
          if(!v){
            //  this.stop.stopProfit=null
            // this.stop.stopLoss=null
          }
      },
      stopLShow(v){
          if(!v){
            //  this.stop.stopProfit=null
            // this.stop.stopLoss=null
          }
      }
  },
  computed: {
    params(){
        return {
            start: 0,
            rows: 10,
            type: 0, //状态(默认是0)：0 持仓 1 委托中持仓 2 取消委托持仓 3 行权申请 4 平仓 5 订单取消
            isSimulate:this.simulate
      }
    },
    //补充的保证金
    supplement(){
        let s=(this.stopRange(this.sellOrder).loss[1]-this.stop.stopLoss)*this.sellOrder.stockNum
        if (this.sellOrder.stopLoss<this.stopRange(this.sellOrder).loss[1]) {
            s=(this.sellOrder.stopLoss-this.stop.stopLoss)*this.sellOrder.stockNum
        }
        if (s<0) {
            return 0.00
        }
        return s.toFixed(2)
    },
    //总浮动盈亏
    totalPAL(){
        let total=0;
        // console.log(this.o)
        this.o.map(i=>{
            // total+=(+i.price)
          total+=(+this.PAL(i).PAL)
        })
        return total.toFixed(2)
    },
    //是否模拟
    simulate(){
      if (!this.$route.query.simulate) {
        return 1
      }
      return this.$route.query.simulate
    },
  },
  methods: {
          //止盈止损百分比
    stopRate(i,type){
    if (type) {
        if (i<=0) {
          return 0
        }
        if ((i-this.sellOrder.price)*100/i<0) {
          return 0
        }
       return ((i-this.sellOrder.price)*100/i).toFixed(2)
      }
      if (i<=0) {
          return 100
      }
      if ((this.sellOrder.price-i)*100/this.sellOrder.price<0) {
        return 0
      }
      return ((this.sellOrder.price-i)*100/this.sellOrder.price).toFixed(2)

    },
    //获取订单
    getorders() {
      return this.$axios.post("api/trade/query/orders", this.params).then(res => {
          if (!res.data.errorCode) {
            this.orders = [...this.orders,...res.data.data.data];
            this.total = res.data.data.total;
            this.getMarket()
          }
        });
    },
    //浮动盈亏计算
    PAL(i){
      if(!i.price) {
        return {
          PAL: 0,
          ratio: 0,
        }
      }
      return {
        //（现价-买入价）/买入价*100% 
        PAL:((i.price-i.buyPoint)*i.stockNum).toFixed(2),
        ratio:((i.price-i.buyPoint)/i.buyPoint*100).toFixed(2)
      }
    },
    //获取行情
    getMarket() {
      if (this.socket) {
          this.socket.close()
      }
        if (this.active!=0) {
            return
        }
      let codes = [];
      this.orders.map((v, i) => {
        let indexCode = v.stockCode.substr(0, 1);
        // console.log(v);
        if (indexCode == 6) {
          codes.push(`sh${v.stockCode}`);
        } else {
          codes.push(`sz${v.stockCode}`);
        }
      });
      codes=Array.from(new Set(codes))
      this.socket=new socket(codes.join(","), data => {
        data.split("=").map((v, i) => {
            // console.log(v);

          this.orders.map((item,index)=>{
            if (v.split(",")[0]==item.stockName) {
                  this.$set(item,'price',(+v.split(",")[3]).toFixed(2))
                  this.$set(item,'close',(+v.split(",")[2]).toFixed(2))
            }
          })
          // console.log(v.split(","));

        });
      });
      //
    },
    //加载更多
    loadmore(){
        this.params.start+=this.params.rows
        this.getorders().then(()=>{
            if (this.total==this.orders.length) {
                this.$toast('没有更多')
            }
        })
    },
    //切换tab
    tabChange(index,t){
        // console.log(index);
        let type=index
        index==1?type=4:type
        Object.assign(this.params,{
            start:0,
            rows:10,
            type
        })
        this.orders=[]
        this.getorders()
    },
    //委托价格限制价格
    entrustBlur(){
      if (this.sellParams.entrustPoint>this.sellOrder.close*1.1) {
        this.sellParams.entrustPoint=(this.sellOrder.close*1.1).toFixed(2)
      }
      if (this.sellParams.entrustPoint<this.sellOrder.close*0.9) {
        this.sellParams.entrustPoint=(this.sellOrder.close*0.9).toFixed(2)
      }
    },
    //确认修改止盈止损
    stopClose(action,done){
        if (action === 'confirm'){
            this.updateStop(done).finally(()=>{done()})
        }else{
            // this.stop.stopProfit=null
            // this.stop.stopLoss=null
            done()
        }
    },
    //确认平仓
     sellClose(action, done) {
      if (action === 'confirm') {
        this.sell().finally(()=>done())
      } else {
        done();
      }
    },
    //平仓
    sell(){
      if (this.sellParams.type==1&&!this.sellParams.entrustPoint) {
        this.$toast('请输入委托价格')
        return
      }
      this.sellParams.id=this.sellOrder.id
      this.sellParams.stockCode=this.sellOrder.stockCode
     return this.$axios.post('api/trade/apply/for',this.sellParams).then(res=>{
        if (!res.data.errorCode) {
          this.$toast(res.data.data)
          this.orders=[];
          this.params.start=0;
          this.getorders();
          this.getUser();
        }

      })
    },
    //止盈止损范围
      stopRange(i){
          // console.log(i.money,i.maxStopLossRatio,i.marketValue,i.price);

        return{
          profit:[+(i.price*(+i.minStopProfitRatio+1)).toFixed(2),+(i.price*(+i.maxStopProfitRatio+1)).toFixed(2)],
          loss:[+(+i.price*(1-(+i.minStopLossRatio))).toFixed(2),(+i.price-(((i.money*(1-i.maxStopLossRatio))/(i.marketValue))*i.price)).toFixed(2)]
        }
    },
    //修改止盈止损
    updateStop(done){
      if (!this.stop.stopProfit&&!this.stop.stopLoss) {
        this.$toast('请至少修改一个')
        done()
        return
      }
      this.stop.id=this.sellOrder.id
      // console.log(this.sellOrder);
      this.stop.stopProfit==0?this.stop.stopProfit=this.sellOrder.stopProfit:this.stop.stopProfit
      this.stop.stopLoss==0?this.stop.stopLoss=this.sellOrder.stopLoss:this.stop.stopLoss
     return this.$axios.post('api/trade/update/stop',this.stop).then(res=>{
        if (!res.data.errorCode) {
          this.orders=[]
          this.params.start=0
          this.getorders();
          this.$toast('修改成功!')
          this.$axios.post('api/user/query_user_msg').then(res=>{
                if (!res.data.errorCode) {
                Object.assign(this.userInfo,res.data.data)
                }
            })
        }
      })
    },
    //取消委托
    cancel(i){
        this.$dialog.confirm({
            title: '取消委托',
            message: '是否取消委托?'
        }).then(() => {
            // on confirm
            this.$axios.post(`api/trade/del/entrust/?id=${i.id}`).then(res=>{
                if (!res.data.errorCode) {
                    this.orders=[]
                    this.params.start=0
                    this.$toast('取消成功!')
                    this.getorders()
                }
            })
        }).catch(() => {
        // on cancel
        });
    },
    //获取用户信息
    getUser(){
      this.$axios.post('api/user/query_user_msg').then(res=>{
        if (!res.data.errorCode) {
          // Object.assign(this.userInfo,res.data.data)
          this.userInfo = res.data.data;
        }
      })
      this.$axios.post(`api/trade/order/count?isSimulate=${this.simulate}`).then(res=>{
        if (!res.data.errorCode) {
            // console.log(res.data.data.tradeVO);

          // Object.assign(this.userInfo2,res.data.data.tradeVO)
          this.userInfo2 = res.data.data.tradeVO;
        }
      })
      this.$axios.post('api/trade/query/orders',{
        start: 0,
        rows: 100,
        type: 0,
        isSimulate: this.simulate
      }).then(res => {
          if (!res.data.errorCode) {
             let orders=res.data.data.data
             let codes = [];
              orders.map((v, i) => {
                  let indexCode = v.stockCode.substr(0, 1);
                  // console.log(v);
                  if (indexCode == 6) {
                  codes.push(`sh${v.stockCode}`);
                  } else {
                  codes.push(`sz${v.stockCode}`);
                  }
              });
              codes=Array.from(new Set(codes))
              this.o_ws=new socket(codes.join(","), data => {
                console.log(data)
                data.split("=").map((v, i) => {
                    // console.log(v);
                  orders.map((item,index)=>{
                      if (v.split(",")[0]==item.stockName) {
                          this.$set(item,'price',(+v.split(",")[3]).toFixed(2))
                          this.$set(item,'close',(+v.split(",")[2]).toFixed(2))
                      }
                  })
                  // console.log(v.split(","));
                  this.o=orders

                });
              });
          }
        });
    } }
};
</script>

<style scoped lang="less">
.normal{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.dialog{
    padding: 1rem 1.5rem;
    .xj{
        margin-top: .5rem;
        display: flex;
        align-items: center;
        font-size: .8rem;
        color: dimgrey;
        input{
            border: 1px solid #ddd;
            padding: .2rem .4rem;
            border-radius: .2rem;
        }
    }
}
.main{
    padding-bottom: 60px;
}
i{
    font-style:normal;
}
.money{
    display: flex;
    flex-direction: column;
    i{
        margin-top: .3rem;
        font-size: 0.7rem;
    }
}
.header{
    padding: 0.8rem 0;
    background: #fff;
    color: #000;
    .h_top{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1.5rem;
        margin-bottom: 1rem;
        button{
            padding: 0.3rem;
            font-size: 0.7rem;
            background: #ff5d01;
            border: 0;
            border-radius: 5px;
            color: #fff;
        }
    }
    .h_bottom{
        display: flex;
        justify-content: space-around;
        font-size: 0.8rem;
    }
}
.item_bottom{
    button{
        margin-right: .6rem;
        padding: 0.3rem;
        font-size: 0.7rem;
        background: #fff;
        border: 0;
        border-radius: 5px;
        color: #ff5d01;
        border: 1px solid #ff5d01;
    }
}
.btns{
    margin-top: .6rem;
    display: flex;
    justify-content: flex-end;
    button{
        margin-right: .6rem;
        padding: 0.3rem;
        font-size: 0.7rem;
        background: #fff;
        border: 0;
        border-radius: 5px;
        color: #ff5d01;
        border: 1px solid #ff5d01;
    }
}
.hold_list{
    font-size: .8rem;
    color: #2d2d2d;
    // .item_title{
    //     display: flex;
    //     justify-content:space-around;
    //     margin: .6rem 0;
    // }
    ul{
        padding-top: 0.7rem;
        li{
            margin: 0 .5rem;
            border-bottom: 1px solid #dedddd;
            padding: .8rem 0;
            .item_top{
                display: flex;
                span{
                    margin-bottom: .4rem;
                }
                div{
                    display: flex;
                    width: 100%;
                    justify-content: space-around;
                    flex-direction: column;
                    align-items: center;
                }
            }
            .item_bottom{
                display: flex;
                justify-content: space-between;
                padding: 0 .5rem;
                align-items: center;
            }
        }
    }
}
</style>
