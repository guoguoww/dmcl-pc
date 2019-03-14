<template>
  <div class="main">
      <header>
        <div class="title">
            <van-icon name="arrow-left" @click="$router.go(-1)" />
            <span>{{m.name}}</span>
        </div>
      </header>
      <div class="market">
          <div class="market_top">
            <div class="price" :class="m.change<0?'down':'up'">
                <h4><span>{{m.price||'--.--'}}</span><i :class="m.change<0?'icon-arrow-down':'icon-arrow-up'"></i></h4>
                <div><span style="margin-right:.2rem;">{{m.change||'--'}}</span> <span>{{m.chg||'--'}}%</span></div>
            </div>
            <div class="stock-info">
                <div class="stock-item"><span>昨收</span><span> {{m.close}}</span></div>
                <div class="stock-item"><span>今开</span><span> {{m.open}}</span></div>
                <div class="stock-item"><span>最高</span><span> {{m.high}}</span></div>
                <div class="stock-item"><span>最低</span><span> {{m.low}}</span></div>
                <div class="stock-item"><span>振幅</span><span> {{m.am}}</span></div>
                <div class="stock-item"><span>成交量</span><span> {{m.vol}}万</span></div>
            </div>
          </div>
          <!-- <div class="market_bottom">
            <div class="stock-info">
                <div class="stock-item" v-for="(i,index) in info2" :key="index"><span>{{i.name}} : {{i.data}}</span></div>
                <div class="stock-item"><span>涨停 : {{m.max}}</span></div>
                <div class="stock-item"><span>跌停 : {{m.min}}</span></div>
            </div>
          </div> -->
      </div>

      <div class="chart_box">
        <ul class="chart-tab">
            <li v-for="(i,index) in nav" :key="index" :class="chartType==index?'active':''" @click="chartType=index">{{i}}</li>
            
        </ul>
        <div class="chart">
            <div id="chart" v-show="chartType==0"></div>
            <div id="kchart" v-show="chartType==1"></div>
        </div>
      </div>

      <div class="trade_box">
          <div class="trade_title">
              <p>买盘</p>
              <p>卖盘</p>
          </div>
          <div class="trade_data">
              <p class="buy" :style="{'width':`${buyRate}%`}">{{buyRate}}%</p>
              <p class="sell" :style="{'width':`${sellRate}%`}">{{sellRate}}%</p>
          </div>
          <div class="trade_list">
            <ul class="buy">
                <li class="row-middle" v-for="(i,index) in buy5" :key="index">
                    <p><em>{{index+1}}</em><span class="down">{{i.price}}</span></p>
                    <label>{{i.vol}}</label>
                </li>
            </ul>
            <ul class="sell">
                <li class="row-middle" v-for="(i,index) in sell5" :key="index">
                    <p><em>{{index+1}}</em><span class="down">{{i.price}}</span></p>
                    <label>{{i.vol}}</label>
                </li>
            </ul>
          </div>
      </div>

      <div class="btns">
          <button class="btn" v-if="isOptional" @click="delOptional(code.slice(2))">删除自选</button>
          <button class="btn" v-else @click="addOptional(code.slice(2))">添加自选</button>
          <button class="btn"  @click.stop="$router.push(`/buy/${code.slice(2)}?simulate=${simulate}`)">{{simulate==1?'创建策略':'模拟点买'}}</button>
      </div>
  </div>
</template>

<script type="">
import socket from "@/assets/js/ws";
import { chart, transformTool } from "@/assets/js/charts";
import { marketJudgment } from "@/assets/js/tool";
import echarts from "echarts";
import $ from "jquery";
export default {
  name:"market",
  data() {
    return {

        info2:[
            {name:'总市值',data:'--'},
            {name:'内 盘',data:'--'},
            {name:'成交额',data:'--'},
            {name:'市盈率',data:'--'},
            {name:'外 盘',data:'--'},
            {name:'流通市值',data:'--'},
            {name:'市净率',data:'--'},
        ],
        nav:['分时图','k线图'],
        ws:null,
        m:{},//行情
        buy5:[],//买5卖5
        sell5:[],
        buyRate:50,//买盘百分比
        sellRate:50,
        chartType:0,//图表类型
        isOptional:false,//是否自选
        f:false,
    }
  },
  computed: {
    code(){
        return this.$route.params.code
    },
    simulate(){
      if (!this.$route.query.simulate) {
        return 1
      }
      return this.$route.query.simulate
    },    
  },
  created () {
      this.getData()
      this.getOptional()
  },
  destroyed () {
      if (this.ws) {
          this.ws.socket.close()
      }
  },
  mounted () {
  },
  watch: {
    chartType(v){
        if (v==1&&!this.f) {
            this.initKchart()  
        }
    }
  },
  methods: {
      //获取行情
      getData(){
          this.ws=new socket(this.code+`,ml_${this.code}`,(data)=>{
            //   console.log(data.split('='));
              if (data.split('=').length==3) {//判断是不是第一次获取数据
                this.formatMarket(data)
                this.initchart(data)
                return
              }
              if (data.split('=')[1].split(',').length>1) {//判断是行情还是图表
                this.formatMarket(data)
              }else{
                 console.log( transformTool.fB( transformTool.db(data.split('=')[1]),false,"CN"));
                 this.initchart(data,1)
              }
          })
      },
      //行情
      formatMarket(data){
            let m=data.split('=')[1].split(',')
            this.m={
                name:m[0],
                open:(+m[1]).toFixed(2),
                close:(+m[2]).toFixed(2),
                price:(+m[3]).toFixed(2),
                high:(+m[4]).toFixed(2),
                low:(+m[5]).toFixed(2),
                am:((m[4] - m[5]) / m[5] * 100).toFixed(2)=="NaN" ? 0 : ((m[4] - m[5]) / m[5] * 100).toFixed(2),
                max:(m[2] * 1.1).toFixed(2),
                min:(m[2] * 0.9).toFixed(2),
                vol:(m[8] / 100).toFixed(0),
                amount:(m[9] / 10000).toFixed(0),
                change:(m[3] - m[2]).toFixed(2),
                chg:((m[3] - m[2])/m[2]*100).toFixed(2),
            }
            this.info2[2].data=(m[9] / 10000).toFixed(0)+'万'
            let sellSum=0,buySum=0
            if (this.sell5) [this.sell5,this.buy5]=[[],[]]
             for (let i = 5; i >0; i--) {
                // console.log((+m[29 - i * 2]).toFixed(2),(+m[28 - i * 2] / 100).toFixed(0));  
                this.sell5.push({
                    price:(+m[29 - i * 2]).toFixed(2),
                    vol:(+m[28 - i * 2] / 100).toFixed(0)
                })
                sellSum+=(+(+m[28 - i * 2] / 100).toFixed(0))
            }
            
            //买5
            for (let i = 0; i < 5; i++) {
                // console.log((+m[11 + i * 2]).toFixed(2),(+m[10 + i * 2] / 100).toFixed(0));
                this.buy5.push({
                    price:(+m[11 + i * 2]).toFixed(2),
                    vol:(+m[10 + i * 2] / 100).toFixed(0)
                })
                buySum+=(+(+m[10 + i * 2] / 100).toFixed(0))
            }
            var buyRate, sellRate;
            if (buySum != 0 && sellSum != 0) {
                buyRate = Math.round((buySum / (sellSum + buySum) * 100));
                sellRate = 100 - buyRate;
            } else {
                buyRate = 50;
                sellRate = 50
            }
            this.buyRate=buyRate
            this.sellRate=sellRate
      },
      //分时
      initchart(data,update){
          if (update) {
            var result=transformTool.fB( transformTool.db(data.split('=')[1]),false,"CN");              
          }else{
            var result=transformTool.fB( transformTool.db(data.split('=')[2]),false,"CN");

          }
            var chartVal = [];
            result.forEach(function(i, index) {
                // console.log(i);
                var inVal = [];
                if (i.price >= 0) {
                var dVal = new Date().format("yyyy-MM-dd");//
                new Date().getDay()==6?dVal=new Date(new Date().getTime() - 24*60*60*1000).format("yyyy-MM-dd"):''
                new Date().getDay()==0?dVal=new Date(new Date().getTime() - 2*24*60*60*1000).format("yyyy-MM-dd"):''
                
                var s1arr1 = dVal.split("-");
                var s1arr2 = i.time.split(":");
                if (s1arr2.length == 2) {
                    s1arr2.push("00");
                }

                var rVal = new Date(
                    s1arr1[0],
                    s1arr1[1] - 1,
                    s1arr1[2],
                    s1arr2[0],
                    s1arr2[1],
                    s1arr2[2]
                ).getTime();
                
                inVal.push(rVal);
                inVal.push(i.price);
                chartVal.push(inVal);
                }
                // console.log(inVal);
                // console.log(chartVal);
            });
             // console.log(chartVal);
            var json = {
                records: chartVal,
                y_close: +this.m.close
            };
            if (update) {
                chart(echarts).chartLine.push( json);
            }
            // console.log(json);
            chart(echarts).chartLine.init("#chart", json);
      },
      //k线
      initKchart(){
        this.f=true
        $.ajax({
            url: 'http://118.190.104.207/www_eastmoney_com/api/js',
            data: 'rtntype=5&isCR=false&id=' + this.code.slice(2)+marketJudgment(this.code.slice(2)) +'&type=' + 'k',
            type: 'GET',
            async: false,
            dataType: 'jsonp',
            jsonp: 'cb',
            success: function (data) {
                let [res,total]=[data.data.slice(data.data.length-200,data.data.length),[]]
                res.forEach((i,index)=>{
                    let [item,val]=[i.split(','),[]]
                    val.push(item[0],+item[1],+item[3],+item[4],+item[2],+item[5])
                    total.push(val)
                    // console.log(val);
                })
                console.log(total);
                var json = {
                    "records": total
                };
                console.log(json);
                chart(echarts).chartK.init("#kchart", json);
                
            }
            });
      },
      //获取自选
      getOptional(){
          if (!this.$cookie.get('_auth')) {
              return
          }
          this.$axios.post('api/trade/my/optional?start=0&rows=100').then(res=>{
              res.data.data.data.map(i=>{                  
                  if (i.stockCode==this.code.slice(2)) {
                      this.isOptional=true
                  }
              })
          })
      },
      //添加自选
      addOptional(code){
        this.$axios.post(`api/trade/add/optional?stockCode=${code}`).then(res=>{
            if (!res.data.errCode) {
                this.$toast('添加自选成功');
                this.isOptional=true
            }
        })
      },
      //删除自选
       delOptional(code){
        this.$axios.post(`api/trade/del/optional?codes=${code}`).then(res=>{
          if (!res.data.errorCode) {
            this.$toast('删除自选成功');
            this.isOptional=false
          }
        })
      },
    

  },
}
</script>

<style scoped lang="less">
.main{
    padding-bottom: 40px;
}
header{
    height: 40px;
    background-color: #ff5e00;
        display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    position: relative;
    .title{
       i{
            position: absolute;
            left: 1rem;
            font-size: 1.2rem;
            top: 50%;
            transform: translateY(-50%);
       }
    }
}
.btn{
    padding: 0.3rem;
    font-size: 0.7rem;
    background: #f3f4fa;
    border: 0;
    border-radius: 5px;
    color: #7a7e8a;
    width: 50%;
}
.stock-info{
    display: flex;
    flex-wrap: wrap;
    font-size: .8rem;
    .stock-item{
        width: 33.333%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
}
.market{
    padding: 1rem;
    background-color: #fff;
    color: #7b7f8a;
    margin-bottom: 1rem;
    .market_top{
        display: flex;
        margin-bottom: .5rem;
        .price{
            h4{
                font-size: 1.7rem;
            }
        }
    }
}
.chart_box{
    background-color: #fff;
    padding: 1rem 1.8rem ;
    margin-bottom: 1rem;
   .chart-tab{
        display: flex;
        border: 1px solid #ff5e00;
        border-radius: 0.3rem;
        font-size: .8rem;
        margin-bottom: 1rem;
        li{
            width: 50%;
            text-align: center;
            line-height: 1.5rem;
            color: #ff5e00;
            &.active{
                background-color: #ff5e00;
                color: #fff;
            }
        }
   }
   .chart{
       height: 12rem;
       div{
          height: 12rem;
          width: 100%;
       }
   }
}
.trade_box{
    background-color: #fff;
    padding: 1rem 1.8rem;
    >div{
        display: flex;
        justify-content: space-between;
    }
    .trade_data{
        color: #fff;
        font-size: 0.7rem;
        margin-top: 0.2rem;
        p{
            padding: 0 0.5rem;
        }
        .buy{
            width: 45%;
            background-color: #ff494b;
        }
        .sell{
            width: 55%;
            background-color: #18b676;
            text-align: right;
        }
    }
    .trade_list{
        font-size: .7rem;
        ul{
            width: 50%;
            li{
                display: flex;
                justify-content: space-between;
                padding: 0.4rem 0.5rem;
                color: #7a7a7a;
                em{
                    padding: 0 0.4rem;
                    color: #fff;
                    display: inline-block;
                    margin-right: 0.5rem;
                }
            }
        }
        .buy{
            background-color: #fff6f6;
            em{
                background-color: #ff494b;
            }
        }
        .sell{
            background-color: #eafcf5;
            em{
                background-color: #18b676;
            }
        }
    }
}
.btns{
    display: flex;
    position: fixed;
    bottom: 0;
    justify-content: space-around;
    width: 100%;
    background: #f3f4fa;
    height: 40px;
}
</style>
