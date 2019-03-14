<template>
    <section>
      <van-nav-bar
        title="账户提现"
        left-arrow
        fixed
        @click-left="$back()"
      />
      <div class="content">
        <div class="item"><label>账户余额</label><span class="red">{{balance}}</span></div>
        <div class="item">
          <label>提现金额</label>
          <input placeholder="最低10元起提" v-model="submitWithdrawal.money">
        </div>

        <!--<div class="tip">提现银行卡</div>-->
        <div class="outMoney" v-if="bankCardInfo.length">

          <div class="item">
            <label>已绑定银行卡</label>
            <select v-model="submitWithdrawal.bankId" @change="selBankInfo(submitWithdrawal.bankId)">
              <option value="">请选择提现银行卡</option>
              <option :value="item.id" v-for="(item,index) of bankCardInfo" :key="index">{{item.bankName}}</option>
            </select>
          </div>

          <div class="valiCode" v-if="submitWithdrawal.bankId">
            <van-cell-group>
              <van-field
                  v-model="bankDetailInfo.chnName"
                  label="持卡人"
                  disabled
              />
              <van-field
                  v-model="bankDetailInfo.bankAccount"
                  label="卡号"
                  disabled
              />
              <van-field
                  v-model="bankDetailInfo.phone"
                  label="手机号"
                  disabled
              />

              <van-field
                  v-model="submitWithdrawal.verificationCode"
                  center
                  clearable
                  label="短信验证码"
                  placeholder="请输入短信验证码"
              >
                <van-button slot="button" size="small" type="default" @click="getsms">{{codebtn}}</van-button>
              </van-field>
            </van-cell-group>
          </div>
        </div>
        <div class="alertMsg" v-else>
          <router-link to="bankcardAdd" tag="p">您还未绑定银行卡，前去绑定银行卡</router-link>
        </div>
        <div class="padding-main">
          <button class="btn" @click="subWithdrawal()">确定</button>
        </div>
        <div class="time">
          <p>提现处理时间：</p>
          <p>上午8:45-下午17:00 (当天到账)</p>
          <p>下午17:00以后 (次日9点之前到账)</p>
          <p>到账时间以银行为准，节假日延后处理</p>
          <!--<p>如急需到账,请电话 <a :href="'tel:' + hotLine">联系客服</a> </p>-->
        </div>
      </div>
    </section>
</template>

<script>
  export default {
    name: "withdrawal",
    data() {
      return {
        balance: 0, //可用余额
        bankCardInfo: [], //银行卡信息
        submitWithdrawal: { //上传提现信息
          verificationCode: '', //提现密码
          money: '', //金额
          bankId: '', //选中提现的银行卡id
        },
        bankDetailInfo: {},//提现的银行卡具体信息
        codebtn: '发送验证码',
        codedisable: false,
        timer: null,
      }
    },
    mounted() {
      this.getBankCardInfo();
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
      getBankCardInfo() { //获取绑定银行卡信息
        this.$axios.post('/api/user/query/bankcard').then(res => {
          if (res.data.errorCode === 0) {
            this.bankCardInfo = res.data.data;
            if(this.bankCardInfo.length === 0){
              this.$toast.fail({
                  duration: 1000,   // 持续展示 toast
                  message: '请先绑定银行卡'
              });
            }
          }
        })
      },
      selBankInfo(id){//查询银行卡详情
          if(this.timer) {
              clearTimeout(this.timer);
              this.codebtn = '发送验证码';
              this.codedisable = false;
          }

          if(!this.submitWithdrawal.bankId) {
              this.$toast.fail({
                  duration: 1000,   // 持续展示 toast
                  message: '请先选定要提现的银行卡'
              });
              return
          }

          this.$axios.post('/api/user/bankcard/info',{id,}).then(res => {
              if(res.data.errorCode === 0) {
                  this.bankDetailInfo = res.data.data;
              }
          })
      },
      getsms(){
          if (this.codedisable) {
              return;
          }

          this.countdown();

          this.$axios.post('/api/sms/validate_code',{mobile: this.bankDetailInfo.phone,type: 'moneyout'},).then(res => {
              if(res.data.errorCode === 0){
                  this.$toast.success({message: '发送成功'});
              }
          })
      },
      countdown( ) {
        //倒计时
        var text = this.codebtn;
        var num = 60;
        this.codedisable = true;
        this.codebtn = `${num--}秒`;
        this.timer = setInterval(() => {
            this.codebtn = `${num--}秒`;
            if (num < 0) {
                this.codebtn = text;
                this.codedisable = false;
                clearInterval(timer);
            }
        }, 1000);
      },
      subWithdrawal() {
        if(!this.bankCardInfo.length) {
            this.$toast.fail({
                duration: 1000,   // 持续展示 toast
                message: '请先绑定银行卡'
            });
            return
        }
        if(!this.submitWithdrawal.money) {
          this.$toast.fail({
            duration: 1000,   // 持续展示 toast
            message: '请输入提现金额'
          });
          return
        }
        if(parseInt(this.submitWithdrawal.money) > parseInt(this.balance) || !parseInt(this.balance)) {
          this.$toast.fail({
            duration: 1000,   // 持续展示 toast
            message: '余额不足'
          });
          return
        }

        if(parseInt(this.submitWithdrawal.money) < 10){
            this.$toast.fail({
                duration: 1000,   // 持续展示 toast
                message: '提现金额最低10元起'
            });
            return
        }

        if(!this.submitWithdrawal.bankId) {
            this.$toast.fail({
                duration: 1000,   // 持续展示 toast
                message: '请选择已经绑定的银行卡'
            });
            return
        }

        if(!this.submitWithdrawal.verificationCode) {
            this.$toast.fail({
                duration: 1000,   // 持续展示 toast
                message: '请输入短信验证码'
            });
            return
        }


        this.$axios({
          method: 'post',
          url: '/api/money/out',
          headers: {'Content-Type': 'application/json'},
          data: this.submitWithdrawal
        }).then(res => {
          if(res.data.errorCode === 0) {
            this.$toast.success({
              duration: 2000,   // 持续展示 toast
              message: '提取成功 请注意查看'
            });
            this.getBankCardInfo();
            this.submitWithdrawal.amount = ''; //清除提现金额
          }
        })
      }
    },
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
  .item input {
    height: 100%;
    width: 75%;
    font-size: 0.9rem;
    outline: none;
    border: none;
    padding: 0;
    border-radius: 0.3rem;
    box-sizing: border-box;
    line-height: 1;
  }
  .tip {
    margin-bottom: 0.8rem;
    padding-left: 1.4rem;
    color: #7a7a7a;
    text-align: left;
    font-size: 0.8rem;
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
  /*注意*/
  .time p {
    font-size: 0.7rem;
    text-align: center;
  }
  .time p a {
    color: #249fed;
  }
  .van-radio-group {
    background: #fff;
  }
  .van-radio {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.4rem;
    height: 3.2rem;
    font-size: 0.9rem;
    border-bottom: 1px solid #eee;
  }
  .van-radio label span {
    padding-right: 2rem;
  }
  .alertMsg {
    width: 100%;
    text-align: center;
  }
  .alertMsg p {
    color: #ff5e00;
  }
  .valiCode {
    margin-top: .5rem;
  }
  .valiCode .van-cell {
    padding: 10px 1.4rem;
    font-size: .9rem;
  }
  .van-button--default {
    background: #ff5e00;
    color: #fff;
    border-radius: .3rem;
    border: none;
  }
  .outMoney .item {
    justify-content: space-between;
  }
  .outMoney .item label, .outMoney .item select {
    flex: 1;
  }
  .outMoney .item select {
    border: none;
    outline: none;
  }
</style>
