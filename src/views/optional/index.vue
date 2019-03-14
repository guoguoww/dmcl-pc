<template>
  <div class="main">
    <div class="header">
      <nav>
        <ul>
          <li :class="nav_active==index?'active':''" :key="index" v-for="(i,index) in nav" @click="nav_active=index"><a>{{i}}</a></li>
        </ul>
      </nav>
      <div class="search">
        <input placeholder="请输入股票代码/名称/拼音" @input="search" v-model="keyword">
        <i v-show="keyword.length" @click="keyword=''"></i>
        <img src="@/assets/imgs/change.png" @click="is_edit=!is_edit">
      </div>
    </div>
    <div class="search_list" v-if="keyword.length">
      <ul>
        <li class="search_item" v-for="i in search_list" :key="i.id" @click="toMarket(i.code)">
          <div class="sname"><span>{{i.name}}</span><span>{{i.code}}</span></div>
          <div :class="i.gain>0?'up':'down'"><span>{{i.price||'--'}}</span></div>
          <div :class="i.gain>0?'up':'down'"><span>{{i.gain||'--'}}%</span></div>
          <div class="addIcon" @click.stop="addOptional(i.code)"><img v-show="!i.isOptional" src="@/assets/imgs/add.png" alt=""></div>
          <div><button class="btn" @click.stop="$router.push(`/buy/${i.code}?simulate=${simulate}`)">创建策略</button></div>
        </li>
      </ul>
    </div>
    <!-- 自选 -->
    <div class="optional" v-show="nav_active==0">
      <div class="optional_list"  v-if="!keyword.length">
        <ul>
          <li class="optional_item" v-for="i in optional" :key="i.id" @click="select(i)">
            <div class="checkBtn" v-show="is_edit"><input type="checkbox" :value="i.stockCode" v-model="del_codes"></div>
            <div class="sname"><span>{{i.stockName}}</span><span>{{i.stockCode}}</span></div>
            <div :class="i.gain>0?'up':'down'"><span>{{i.price||'--'}}</span></div>
            <div :class="i.gain>0?'up':'down'"><span>{{i.gain||'--'}}%</span></div>
            <div><button class="btn plain"  @click.stop="$router.push(`/buy/${i.stockCode}?simulate=${simulate}`)">创建策略</button></div>
          </li>
        </ul>
        <div class="loadmore" @click="loadmore" v-if='o_total!=optional.length'>
            <p>加载更多</p>
        </div>
        <div class="nodata" v-show="!optional.length"><p>没有更多数据~</p></div>
      </div>
      <div class="allCheck" :style="is_edit?{'bottom': '3.3rem'}:{}">
        <div class="checkbox">
            <!-- <i id="allCheckDel" class="all"></i> -->
            <input id="all" type="checkbox" style="vertical-align: middle;margin-right: .2rem;" v-model="delall">
            <label for="all">全选</label>
        </div>
        <div class="btns">
          <button @click="delOptional">删除</button>
        <button @click="is_edit=false">完成</button>
        </div>
      </div>
    </div>
    <!-- 沪深 -->
    <div class="market" v-show="nav_active==1">
      <ul class="market_ul" v-if="!keyword.length">
        <li v-for="(i,index) in big_market" :key="index" >
            <p>{{i.name}}</p>
            <label class="row " :class="i.am<0?'down':'up'"><i></i><b>{{i.price}}</b></label>
            <div :class="i.am<0?'down':'up'"><span>{{i.am}}</span><span>{{i.amr}}%</span>
            </div>
        </li>
      </ul>
      <div class="rank_list" v-if="!keyword.length">
        <div class="rank_item" v-for="(i,index) in rank_list" :key="index" @click="changeRank(index)">
          <div class="rank_name">
            <p>{{i}}</p>
            <i class="arrow" :class="rank_active==index?'arrow_bottom':''"></i>
          </div>
          <div class="search_list" style="background: #fafafa;">
            <ul>
              <li class="search_item" v-for="j in ranks" :key="j" v-show="rank_active==index" >
                <div class="sname"><span>{{j.split(',')[2]}}</span><span>{{j.split(',')[1]}}</span></div>
                <div :class="(+j.split(',')[3])<0?'down':'up'"><span>{{j.split(',')[3]}}</span></div>
                <div :class="(+j.split(',')[3])<0?'down':'up'"><span>{{j.split(',')[4]}}</span></div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="">
import socket from "@/assets/js/ws";
import $ from "jquery";
export default {
  name: "optional",
  data() {
    return {
      nav:['自选','沪深'],
      nav_active:0,
      is_edit:false,//编辑模式
      keyword:'',//搜索词
      search_list:[],//搜索列表
      search_ws:null,//搜索列表的websocket
      optional:[],//自选列表
      o_total:0,
      o_ws:null,//自选的websocket
      del_codes:[],//删除的自选
      delall:false,//删除所有
      big_ws:null,//大盘的websocket
      big_market:[],//大盘的行情
      start:0,
      rows:10,
      rank_active:null,
      rank_list:['涨幅榜','跌幅榜','涨速榜','换手榜','金额榜','量比榜'],
      ranks:[],//排行榜
    };
  },
  computed: {
    //是否模拟
    simulate(){
      if (!this.$route.query.simulate) {
        return 1
      }
      return this.$route.query.simulate
    },     
  },
  created() {
    this.getOptional()
    this.get_big_market()
    window.cb=this.cb
  },
  destroyed () {
    if (this.big_ws) {
      this.big_ws.socket.close()
    }
    if (this.search_ws) {
      this.search_ws.socket.close()      
    }
    if (this.o_ws) {
      this.o_ws.socket.close()      
    }
  },
  watch: {
    //点击全选时全选
    delall(v){
      if (v) {
        this.select_all(true)
      }else{
        this.select_all()
      }
    },
    //编辑自选完成的时候
    is_edit(v){
      if (!v) {
        this.del_codes=[]
      }
    },
    //
    rank_active(v){
      this.getRanklist(v)
    }
  },
  methods: {
    changeRank(index){
      if (this.rank_active==index) {
        this.rank_active=null
        return 
      }
      this.ranks=[]
      this.rank_active=index
    },
    //搜索
    search(){
      this.$axios.post(`api/trade/stock/search?searchContent=${this.keyword}`).then(res=>{
        if (!res.data.errorCode) {
          this.search_list=res.data.data
          this.isOptional(this.search_list,this.optional)
          this.getMarket('search')
        }
      })
    },
    //获取行情
    getMarket(type){
      let [ws,list]=[null,[]]
      // console.log(type,ws,list);
      type=='search'?[ws,list]=[this.search_ws,this.search_list]:[ws,list]=[this.o_ws,this.optional]
      let codes=[]
      list.map(v=>{
        let code
        if (v.code) {
          v.code.substr(0,1)=='6'?code='sh'+v.code:code='sz'+v.code 
        }else{
          v.stockCode.substr(0,1)=='6'?code='sh'+v.stockCode:code='sz'+v.stockCode
        }

        codes.push(code)
      })
      if (!codes.length) {
        return 
      }
      if (ws) {
        ws.socket.close()
      }
      ws=new socket(codes.join(','),(data)=>{
          data.split("=").map((v, i) => {
              list.map((item,index)=>{
                if (v.split(",")[0]==item.name||v.split(",")[0]==item.stockName) {
                  this.$set(item,'price',(+v.split(",")[3]).toFixed(2)) 
                  this.$set(item,'gain',((+v.split(",")[3] - +v.split(",")[2])* 100 / +v.split(",")[2]).toFixed(2))      
                }
            })
        });
      })
      type=='search'?this.search_ws=ws:this.o_ws=ws
    },
    //获取自选
    getOptional(){
      if (!this.$cookie.get('_auth')) {
        return 
      }
     return this.$axios.post('api/trade/my/optional',{start:this.start,rows:this.rows}).then(res=>{
        this.optional=[...this.optional,...res.data.data.data];
        this.o_total=res.data.data.total
        if (this.optional.length) {
         this.getMarket() 
        }
        if (this.search_list.length) {
          this.isOptional(this.search_list,this.optional)          
        }
      })
    },
    //加载更多
    loadmore(){
        this.start+=this.rows
        this.getOptional().then(()=>{
            if (this.o_total==this.optional.length) {
                this.$toast('没有更多')
            }
        })
    },
    //添加自选
    addOptional(code){
      this.$axios.post(`api/trade/add/optional?stockCode=${code}`).then(res=>{
        if (!res.data.errCode) {
              this.$toast('添加自选成功');
              this.optional=[]
              this.getOptional();
        }
      })
    },
    //全选
    select_all(bool){
      if (!bool) {
        this.del_codes=[]
        return
      }
      this.optional.map(i=>{
        this.del_codes.push(i.stockCode)
      })
    },
    //删除自选
    delOptional(){
      if (!this.del_codes.length) {
        return 
      }
      this.$axios.post(`api/trade/del/optional?codes=${this.del_codes.join(',')}`).then(res=>{
          if (res.data.errorCode) {
            return 
          }
          this.$toast('删除自选成功');
          this.optional=[]
          this.getOptional();
      })
    },
    //点击自选item
    select(i){
      if (this.is_edit) {        
        if (this.del_codes.indexOf(i.stockCode)!=-1) {
          this.del_codes.splice(this.del_codes.indexOf(i.stockCode),1)
          return
        }
        this.del_codes.push(i.stockCode)
        return
      }
      this.toMarket(i.stockCode)
    },
    //跳转行情
    toMarket(stockCode){
      let code
      stockCode.substr(0,1)=='6'?code='sh'+stockCode:code='sz'+stockCode 
      this.$router.push(`/market/${code}?simulate=${this.simulate}`)
    },
    //获取大盘行情
    get_big_market(){
      if (this.big_ws) {
        this.big_ws.socket.close()
      }
      this.big_ws=new socket('s_sh000001,s_sz399001,s_sz399006',(data)=>{
        data.split('=').map(i=>{
          let market=i.split(',')
          if (market.length<6) {
            return 
          }
          if (this.big_market.length==3) {
            this.big_market.map(v=>{
              if (v.name==market[0]) {
                v.price=(+market[1]).toFixed(2)
                v.am=(+market[2]).toFixed(2)
                v.amr=(+market[3]).toFixed(2)
              }
            })
            return
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
    //判断是否自选
    isOptional(list1,list2){
      list1.map(v=>{
        // console.log(v.code);
        list2.map(i=>{
          // console.log(i.stockCode);
          if (i.stockCode==v.code) {
            this.$set(v,'isOptional',true)
          }
        })
      })
      // console.log(list1);
    },
    //获取排行榜
    getRanklist(type){
      let baseurl='http://nufm.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?cb=cb&type=CT&token=4f1862fc3b5e77c150a2b985b12db0fd'
      let num=10
        if (type === 0) {
          baseurl = `${baseurl}&cmd=C._A&sty=MPNSBAS&st=(ChangePercent)&sr=-1&p=1&ps=${num}&lvl=&&_=08919`
      }
      if (type === 1) {
          baseurl = `${baseurl}&cmd=C._A&sty=MPNSBAS&st=(ChangePercent)&sr=1&p=1&ps=${num}&lvl=&&_=05428`
      }
      if (type === 2) {
          baseurl = `${baseurl}&sty=FCOIATC&cmd=C._A&st=(Speed)&sr=-1&p=1&ps=${num}&_=1545373226781"`
      }
      if (type === 3) {
          baseurl = `${baseurl}&sty=FCOIATC&cmd=C._A&st=(TurnoverRate)&sr=-1&p=1&ps=${num}&_=154537380"`
      }
      if (type === 4) {
          baseurl = `${baseurl}&sty=FCOIATC&cmd=C._A&st=(Amount)&sr=-1&p=1&ps=${num}&_=1545373804072"`
      }
      if (type === 5) {
          baseurl = `${baseurl}&sty=FCOIATC&cmd=C._A&st=(VolumeRate)&sr=-1&p=1&ps=${num}&_=15453738040"`
      }
      $.ajax({
          dataType: 'jsonp',
          url: baseurl,
          type: 'get',
          success: function (data) {
              console.log(data)
          }
      });

    },
    //
    cb(res){
      console.log(res);
      this.ranks=res
    }
    
  }
};
</script>

<style scoped lang="less">
@color: #ff5e00;
.nodata{
  padding: 1rem;
  p{
    color: #999;
    text-align: center;
  }
}
.btns{
    display: flex;
    justify-content: space-between;
    width: 45%;
}
.main{
  padding-bottom:100px;
}
.btn{
    padding: .3rem;
    font-size: 0.7rem;
    background: #ff5d01;
    border: 0;
    border-radius: 5px;
    color: #fff;
    box-shadow: 0px 0px 1px 1px #969696;
}
.plain{
  color: #ff5d01;
  background: #fff;
  border: 1px solid #ff5d01;
  box-shadow: none;
}

.header {
  background-color: @color;
  nav {
    display: flex;
    justify-content: center;
    padding: 0.5rem 0px 1rem;
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
          color: @color;
        }
      }
    }
  }
  .search {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: relative;
    i{
        background: #CCCCCC;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        position: absolute;
        right: 16%;
        top: 50%;
        transform: translateY(-50%);
      &:before {
          display: block;
          content: '';
          width: 70%;
          height: 20%;
          background: #fff;
          border-radius: 3px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
      }
      &:after {
        display: block;
        content: '';
        width: 70%;
        height: 20%;
        background: #fff;
        border-radius: 3px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
      }
    }
    input {
      border: none;
      padding: 0.3rem 0 0.3rem 2rem;
      background-image: url(../../assets/imgs/search.png);
      background-position: 0.5rem center;
      background-repeat: no-repeat;
      background-size: 1rem;
      width: 85%;
      border-radius: 3px;
    }
    img {
      height: 1.5rem;
      width: 1.5rem;
    }
  }
}
.search_list,.optional_list {
    background-color: #fff;
  .search_item,.optional_item {
    display: flex;
    align-items: center;
    justify-content: space-around;
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
}
.isChecked,.all{
    vertical-align: middle;
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 1px solid #ccc;
    border-radius: 50%;
    position: relative;
}
.checked {
    background: #15B0FF;
    border: 1px solid #15B0FF;
    &:after {
        display: block;
        content: '';
        width: 70%;
        height: 30%;
        border-bottom: 1px solid #fff;
        border-left: 1px solid #fff;
        top: 40%;
        left: 50%;
        position: absolute;
        transform: translate(-50%, -50%) rotate(-45deg);
    }
}

.optional{
  .allCheck {
    padding: 1.1rem;
    position: fixed;
    width: 100%;
    bottom: -10rem;
    transition: all .3s;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.7rem;
    button {
        padding: 0.3rem 1rem;
        background: @color;
        border: none;
        border-radius: 3px;
        color: #fff;
    }
  }
} 
.market{
  .market_ul{
    display: flex;
    text-align: center;
    padding: 1rem 0;
    background-color: #fff;
    color: #212121;
    margin-bottom: 1rem;
    li{
      width: 33.333%;
      border-right: 1px solid #f1f2f3;
       &:last-child {
          border: none;
      }
      b{
        font-style: normal;
        font-weight: normal;
        font-size: .9rem;
      }
      span{
        margin: 0 .2rem;
        font-size: 0.8rem;
      }
    }
  }
  .rank_list{
    background-color: #fff;
    .rank_item{
      .rank_name{
        display: flex;
        height: 2rem;
        justify-content: space-between;
        align-items: center;
        margin: 0 .5rem;
        padding: .2rem 0.5rem;
        box-sizing: content-box;
        border-bottom: 1px solid #e3e3e3;
        p{
          font-size: 1rem;
        }
        .arrow{
            width: 12px;
            height: 12px;
            border-left: 2px solid @color;
            border-bottom: 2px solid @color;
            transform: rotate(-135deg);
            transition: all .3s;
        }
        .arrow_bottom {
            transform: rotate(-45deg);
        }
      }
    }
  }
}
</style>
