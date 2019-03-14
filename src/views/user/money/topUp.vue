<template>
    <section>
      <van-nav-bar
        title="充值"
        left-arrow
        fixed
        @click-left="$back()"
      />
      <div class="content">
        <div class="item"><label>账户余额</label><span class="red">{{balance}}</span></div>
        <div class="item">
          <label>充值金额</label>
          <input placeholder="输入充值金额" v-model="submitTopUp.amount">
        </div>
        <div class="item">
          <label>充值方式</label>
          <select v-model="payType">
            <option value="">请选择充值方式</option>
            <option :value="item.id" v-for="(item,index) of rechargeTypeList" :key="index" v-if="item.use.indexOf('app') != -1">{{item.name}}</option>
          </select>
        </div>

        <!--网银支付  --- 输入银行类型-->
        <div class="ECurrencyPayment item" v-if="payType==wyRechargeIndex">
          <label>网银支付</label>
          <select v-model="bankCodeVal">
            <option value="">请选择银行类型</option>
            <option :value="item.bankCode" v-for="(item, index) of bankTypes" :key="index" >{{item.bankName}}</option>
          </select>
        </div>

        <!--快捷支付  ---  输入银行卡号-->
        <div class="quickPayment item" v-if="payType == quickRechargeIndex">
          <label>快捷支付</label>
          <input type="number" placeholder="请输入银行卡号" v-model="bankCardNum">
        </div>

        <div class="padding-main">
          <button class="btn" @click="submitData()">确定</button>
        </div>

        <form id="zft_form" method="post" action="http://47.52.160.122:8080/YBT/YBTPAY">
          <input type="hidden" name="version" />
          <input type="hidden" name="merchantNum" />
          <input type="hidden" name="nonce_str" />
          <input type="hidden" name="merMark" />
          <input type="hidden" name="client_ip" />
          <input type="hidden" name="orderTime" />
          <input type="hidden" name="payType" />
          <input type="hidden" name="orderNum" />
          <input type="hidden" name="amount" />
          <input type="hidden" name="body" />
          <input type="hidden" name="signType" />
          <input type="hidden" name="bank_code" />
          <input type="hidden" name="notifyUrl"/>
          <input type="hidden" name="sign"/>
        </form>


        <div class="upgrade">
          <p>* 三方银联通道升级中（平台用户也可通过我司在央行开立的对公账户入金，入金时请尽量备注平台的账号。户名：福建国华赢家信息技术有限公司；账号：158009184；开户支行：中国民生银行股份有限公司福州连江支行）</p>
          <p>* 鉴于银联对企业支付宝使用的限制，小部分订单出现无法支付的提示，请用户稍后再试（间隔时间或更改金额），给您带来不便，请谅解！</p>
        </div>
      </div>
      <div v-show="load" style="text-align: center">
        <div class="loadingBg">
            <van-loading color="white" />
        </div>
      </div>
    </section>
</template>

<script>
  import $ from 'jquery';
  export default {
    name: "topUp",
    data() {
      return {
        payType: '', //支付方式
        balance: 0, //可用余额
        bankCardInfo: {}, //银行卡信息
        submitTopUp: { //上传充值信息
          amount: '', //金额
        },
        load: false,
        rechargeTypeList: '',//充值方式列表
        bankTypes: [
            {bankCode: 'CCB', bankName: '建设银行',i: 1},
            {bankCode: 'BOC', bankName: '中国银行',i: 2},
            {bankCode: 'ABC', bankName: '农业银行',i: 3},
            {bankCode: 'BCOM', bankName: '交通银行',i: 4},
            {bankCode: 'POST', bankName: '邮政银行',i: 5},
            {bankCode: 'CMB', bankName: '招商银行',i: 6},
            {bankCode: 'CITIC', bankName: '中信银行',i: 7},
            {bankCode: 'SPDB', bankName: '浦发银行',i: 8},
            {bankCode: 'CIB', bankName: '兴业银行',i: 9},
            {bankCode: 'CMBC', bankName: '民生银行',i: 10},
            {bankCode: 'CEB', bankName: '光大银行',i: 11},
            {bankCode: 'PAB', bankName: '平安银行',i: 12},
            {bankCode: 'HXB', bankName: '华夏银行',i: 13},
            {bankCode: 'BOB', bankName: '北京银行',i: 14},
            {bankCode: 'GDB', bankName: '广发银行',i: 15},
            {bankCode: 'SHB', bankName: '上海银行',i: 16},
            {bankCode: 'JSB', bankName: '江苏银行',i: 17},
            {bankCode: 'EGB', bankName: '恒丰银行',i: 18},
            {bankCode: 'ICBC', bankName: '工商银行',i: 19},
        ],
        bankCodeVal: '',
        bankCardNum: '',//快捷支付的银行卡号
        wyRechargeIndex: '',//自定义网银充值的
        quickRechargeIndex: '',//自定义快捷充值的
        backData: '',//返回数据
      }
    },
    mounted() {
      this.rechargeType();
      this.getUserData();
    },
    methods: {
      getUserData() { //获取个人信息
        this.$axios.post('/api/user/query_user_msg').then(res => {
          if (res.data.errorCode === 0) {
            this.balance = res.data.data.money;
          }
        })
      },
      rechargeType(){//充值方式查询
          this.$axios.post('/api/money/money_payment').then(res => {
              if(res.data.errorCode === 0) {

                  this.rechargeTypeList = res.data.data;

                  res.data.data.forEach((val) => {

                      if(val.name == '快捷支付') {
                          this.quickRechargeIndex = val.id;
                      }else if (val.name == '网银支付') {
                          this.wyRechargeIndex = val.id;
                      }
                  })
              }
          })
      },
      submitData() {
        if(!this.submitTopUp.amount) {
          this.$toast.fail({
            duration: 1000,   // 持续展示 toast
            message: '请输入充值金额'
          });
          return
        }
        if(this.submitTopUp.amount > this.balance) {
          this.$toast.fail({
            duration: 1000,   // 持续展示 toast
            message: '余额不足'
          });
          return
        }

        if(!this.payType) {
            this.$toast.fail({
                duration: 1000,   // 持续展示 toast
                message: '请先选择充值方式'
            });
            return
        }

        if(this.payType == this.wyRechargeIndex) {//网银支付
            if(!this.bankCodeVal) {
                this.$toast.fail({
                    duration: 1000,   // 持续展示 toast
                    message: '请先选择银行类型'
                });
                return
            }
        }

        if(this.payType == this.quickRechargeIndex) {//快捷支付

            let bankExp=/(^\d{16}$)|(^\d{19}$)/;//银行卡

            if(!this.bankCardNum) {
                this.$toast.fail({
                    duration: 1000,   // 持续展示 toast
                    message: '请输入银行卡号'
                });
                return
            }else if(!bankExp.test(this.bankCardNum)) {
                this.$toast.fail({
                    duration: 1000,   // 持续展示 toast
                    message: '输入的银行卡号有误'
                });
                return
            }
        }



        this.pay();
        // this.$toast.success({
        //   duration: 1000,   // 持续展示 toast,
        //   message: '充值成功（假）'
        // })

      },
      pay(){
          // this.load = true;
          this.$axios({
              method: 'post',
              url: '/api/money/recharge',
              params: {
                  paymentId: this.payType,
                  money: this.submitTopUp.amount,
                  bankCode: this.bankCodeVal,
                  account: this.bankCardNum
              }
          }).then(res => {
              if(!res.data.errorCode){
                  this.backData = res.data.data;
                  for (var i in res.data.data) {
                      if (res.data.data.hasOwnProperty(i) === true) {
                          $('#zft_form input[name=' + i +']').val(res.data.data[i])
                      }
                  }

                  $("#zft_form").submit();
              }
          })
      },
    }
  }
</script>

<style scoped>
  .item {
    text-align: left;
    background-color: #fff;
    margin-bottom: 0.8rem;
    padding: 0 1.4rem;
    display: flex;
    align-items: center;
    height: 3.2rem;
    font-size: 0.9rem;
  }
  .item label {
    width: 25%;
  }
  .red {
    color: #ff494b !important;
  }
  .item input,  .item select {
    height: 100%;
    width: 75%;
    font-size: 0.9rem;
    outline: none;
    border: none;
    padding: 0;
    border-radius: 0.3rem;
    line-height: 1;
    background: #fff;
  }
  /*银行卡*/
  .bank {
    justify-content: space-between;
  }
  .bank label {
    width: 80%;
  }
  .bank span {
    margin-right: 0.8rem;
  }
  /*按钮*/
  .padding-main {
    padding: 1rem;
  }
  .btn {
    background-color: #ff5e00;
    border-radius: 0.3rem;
    color: #fff;
    height: 2.6rem;
    line-height: 2.6rem;
    padding: 0 0.5rem;
    font-size: 0.9rem;
    text-align: center;
    outline: none;
    border: none;
    display: block;
    width: 100%;
  }

  .upgrade p {
    line-height: 1.4rem;
    font-size: 0.85rem;
    color: #ff5e00;
    text-align: center;
    width: 80%;
    margin: 0 auto 0.8rem;
  }

  .loadingBg {
    display:flex;
    width: 50px;
    height: 50px;
    background: #666;
    line-height: 50px;
    margin: auto;
  }
  .van-loading {
    margin: auto;
  }
</style>
