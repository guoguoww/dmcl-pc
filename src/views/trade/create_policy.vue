<template>
  <div class="main">
    <div class="header">
      <nav>
        <van-icon name="arrow-left" class="back" @click="$router.go(-1)" />
        <p>{{simulate==1?'创建策略':'模拟点买'}}</p>
      </nav>
      <div class="search">
        <input placeholder="请输入股票代码/名称/拼音" @input="search" v-model="keyword">
        <i v-show="keyword.length" @click="keyword=''"></i>
      </div>
    </div>
    <div class="search_list" v-if="keyword.length">
      <ul>
        <li class="search_item" v-for="i in search_list" :key="i.id" @click="toMarket(i)">
          <div class="sname"><span>{{i.name}}</span><span>{{i.code}}</span></div>
          <div :class="i.gain>0?'up':'down'"><span>{{i.price||'--'}}</span></div>
          <div :class="i.gain>0?'up':'down'"><span>{{i.gain||'--'}}%</span></div>
          <div class="addIcon" @click.stop="addOptional(i.code)"><img v-show="!i.isOptional" src="@/assets/imgs/add.png" alt=""></div>
          <div><button class="btn"  @click.stop="$router.push(`/buy/${i.code}?simulate=${simulate}`)">创建策略</button></div>
        </li>
      </ul>
    </div>

    <div class="history" v-if="!keyword.length">
      <div class="history-head clear" v-show="history.length">
        <p class="history-title">历史记录</p>
        <div class="history-clear" @click="delAll">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAqCAYAAADbCvnoAAAAAXNSR0IArs4c6QAAAf9JREFUWAntWDFLAzEUfq8cOqjg2kVwdtVdV8HJX6CI0OVQEEGdHLSLcKWDXUT3roKTIv4IHRVcdBRUWm1tfLlryst5d7mrPUVJl/eS9+XLl0fepQlCxt9+pbYHHdgAEEPJQ/EdCnCwvVbaScbp0YLeTNESwjWLkTwk2Mem4GSQ7IIQqwC0euOPMD7WCLSAv50BTF81eS80qEqnWwmGEs5bjOSXVQluIaiENFWTtyhblXlnOCd+5Lx+xcnPPX1h486gvDH60SEPTQGjweHJpTI/Z4wuqHeCJ53kKqYsE9tzVUzZXoA5KqZsEAoJYvhfcq0gU+JthmyGTBkwxe0eshkyZcAUt3vIZsiUAVP8P+whdWVSNmrNKqZsFCa6L3uG6M0HEF7k2080JfWmwcQMdmL6Y7u7f/4TH6HSYOIm0DKEiB8KWK/Xc7tec24+p5xbEyQEPCpBtw9P08oftA1xP3B+TRAinKug6LQrnncyrtqDspJTcjO+C+aDtoccx9lttVuL8m5G2ZppYPOm7B2e0hOetgpOkM0XxQY0F4i/6I+j4pBzcg7t5ioDZa+2TOZICPElxgd+16e9I4hjZWu9dMy5IiclUbMkSAInOXiA/h1lZmnTXb0Kc0YKkqBq9Wz4VdzP0YPWFKV4LDywrzbCM70bXI/gxKXrzr/1xfHTgz4BkLuu2FecGC0AAAAASUVORK5CYII=">
            <span>清空历史记录</span>
        </div>
      </div>
      <div class="history_list">
        <ul>
          <li class="search_item history_item" v-for="(i,index) in history" :key="index" @click="toMarket(i)">
            <div class="sname"><span>{{i.name}}</span><span>{{i.code}}</span></div>
            <div><button class="btn danger" @click.stop="delHistory(index)">删除</button></div>
          </li>
        </ul>
      </div>
    </div>

    <div class="hot" v-if="!keyword.length">
        <div class="hot-head clear">
            <p class="hot-title">热门推荐</p>
        </div>
        <ul class="hot_list">
            <li v-for="i in hot_list" :key="i.name" @click="toMarket(i)">
                <span>{{i.name}}</span>
                <b  :class="i.am<0?'down':'up'">{{i.price}}</b>
                <div class="gain" :class="i.am<0?'down':'up'">
                    <span>{{i.am}}</span><span>{{i.amr}}%</span>
                </div>
            </li>

        </ul>
    </div>
  </div>
</template>

<script type="">
import socket from "@/assets/js/ws";

export default {
  name: "create_policy",
  data() {
    return {
      keyword:'',
      search_list:[],//搜索列表
      optional:[],//自选列表
      search_ws:null,
      history:[],//历史记录
      hot_list:[],//热门列表
      hot_ws:null
    };
  },
  destroyed () {
    if (this.search_ws) {
      this.search_ws.socket.close()
    }
    if (this.hot_ws) {
      this.hot_ws.socket.close()
    }
  },
  created() {
    if (localStorage.history)this.history=JSON.parse(localStorage.history);
    this.getOptional()
    this.hot()
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
  methods: {
    //搜索
    search(){
      this.$axios.post(`api/trade/stock/search?searchContent=${this.keyword}`).then(res=>{
        if (!res.data.errorCode) {
          this.search_list=res.data.data
          this.isOptional(this.search_list,this.optional)
          if (!this.keyword.length) {
            return 
          }
          this.getMarket('search')
        }
      })
    },
    //跳转行情
    toMarket(i){
      this.history.unshift({name:i.name,code:i.code})
      var hash = {};
      this.history = this.history.reduce(function(item, next) {
          hash[next.code] ? '' : hash[next.code] = true && item.push(next);
          return item
      }, [])
      if (this.history.length==6) {
        this.history.pop()
      }
      console.log(this.history);
      localStorage.history=JSON.stringify(this.history)
      let code
      i.code.substr(0,1)=='6'?code='sh'+i.code:code='sz'+i.code 
      this.$router.push(`/market/${code}?simulate=${this.simulate}`)
    },
    //删除历史记录
    delHistory(index){
      this.history.splice(index,1)
      localStorage.history=JSON.stringify(this.history)
    },
    //删除全部
    delAll(){
      this.history=[]
      localStorage.history=JSON.stringify(this.history)
    },
    //添加自选
    addOptional(code){
      this.$axios.post(`api/trade/add/optional?stockCode=${code}`).then(res=>{
        if (!res.data.errCode) {
              this.$toast('添加自选成功');
              this.getOptional()
        }
      })
    },
    //获取自选
    getOptional(){
      if (!this.$cookie.get('_auth')) {
        return 
      }
      this.$axios.post('api/trade/my/optional',{start:0,rows:100}).then(res=>{
        this.optional=res.data.data.data;
        if (this.search_list.length) {
          this.isOptional(this.search_list,this.optional)          
        }
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
        console.log(ws);
        ws.socket.close()
        ws=null
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
    //热门推荐
    hot(){
      this.$axios.post('api/trade/hot/stock').then(res=>{
        console.log(res.data.data);
        let codes=[]
        res.data.data.split(',').map(i=>{
          let code
          i.substr(0,1)=='6'?code='s_sh'+i:code='s_sz'+i 
          codes.push(code)
        })
       this.hot_ws=new socket(codes.join(','),data=>{
          data.split('=').map((v,index)=>{
            let i=v.split(',')
            if (i.length<6) {
              return 
            }
            // console.log(i.split(',')[0]);
            if (this.hot_list.length==3) {
              this.hot_list.map(v=>{
                if (v.name==i[0]) {
                  v.price=(+i[1]).toFixed(2)
                  v.am=(+i[2]).toFixed(2)
                  v.amr=(+i[3]).toFixed(2)
                }
              })
              return
            }
            // console.log(codes[index]);
            let item={name:i[0],price:(+i[1]).toFixed(2),am:(+i[2]).toFixed(2),amr:(+i[3]).toFixed(2),code:res.data.data.split(',')[index-1]}
            this.hot_list.push(item)
          })
        })
      })
    }
  }
};
</script>

<style scoped lang="less">
@color: #ff5e00;

.main{
    padding-bottom: 60px;
}
.header {
  background-color: @color;
  nav {
    display: flex;
    justify-content: center;
    padding: 0.5rem 0px;
    // align-items: center;
    .back{
      color: #fff;
      font-size: 20px;
          position: absolute;
    left: .5rem;
    }
    p {
      font-size: 1rem;
      color: #fff;
    }
  }
  .search {
    padding: 0.5rem;
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
    }
    img {
      height: 1.5rem;
      width: 1.5rem;
    }
  }
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
.danger{
    background: #fff;
    border: 1px solid #f44;
    box-shadow: none;
    color: #f44;
}
.search_list,.history_list {
    background-color: #fff;
  .search_item {
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
  .history_item{
    justify-content: space-between;
    padding: 0.5rem 1rem;
  }
}
.history_list{
    background-color: transparent;
}
.history-head,.hot-head{
        display: flex;
        font-size: .7rem;
        justify-content: space-between;
        align-items: center;
        padding: .5rem 1rem;
        .history-title,.hot-title{
            font-size: 1rem;
        }
        .history-clear{
            display: flex;
            img{
                width: 1rem;
                height: 1rem;
                margin-right: .2rem;
            }
        }
    }
.hot{
    .hot_list{
        display: flex;
        justify-content:space-around;
        margin-top: 1rem;
        li{
            display: flex;
            flex-direction: column;
            align-items: center;
            border: 1px solid #ccc;
            padding: 0.7rem 0.5rem;
            border-radius: 5px;
            background-color: #fff;
            box-shadow: 0 0 3px 1px #d3d3d3;
            >span{
                font-size: .85rem;
            }
            .gain{
                font-size: 0.7rem;
                span:first-child{
                    margin-right: .2rem;
                }    
            }
        }
    }
}
</style>
