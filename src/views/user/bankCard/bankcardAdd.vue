<template>
    <section>
      <van-nav-bar
        title="绑定银行卡"
        left-arrow
        fixed
        @click-left="$back()"
      />
      <div class="content">
        <div v-if="realNameStatus == 2">
          <ul class="form">
            <li>
              <span>开户人</span>
              <input type="text" placeholder="请输入开户人姓名" v-model="submitBankCardData.chnName">
            </li>
            <li>
              <span>开户银行</span>
              <input type="text" placeholder="请输入开户行名称" v-model="submitBankCardData.openBankName">
            </li>
            <li>
              <span>银行卡号</span>
              <input type="text" placeholder="请输入银行卡号" v-model="submitBankCardData.bankAccount">
            </li>
            <li>
              <span>开户省份</span>
              <input type="text" placeholder="请输入开户省份" v-model="submitBankCardData.province">
            </li>
            <li>
              <span>身份证号</span>
              <input type="text" placeholder="请输入身份证号" v-model="submitBankCardData.idCard">
            </li>
            <li>
              <span>银行卡名称</span>
              <input type="text" placeholder="请输入银行卡名称" v-model="submitBankCardData.bankName">
            </li>
            <li>
              <span>预留手机号</span>
              <input type="text" placeholder="请输入手机号" v-model="submitBankCardData.phone">
            </li>
          </ul>
          <div class="submitBtn">
            <button class="add_btn" @click="submitBankCardInfo()">确定</button>
          </div>
        </div>
        <div class="auditing" v-else-if="realNameStatus == 1">
          <p>认证审核中，请等待实名认证审核通过</p>
        </div>
        <div class="unaudit" v-else>
          <router-link to="/verifiedEdit" tag="p">前去实名认证</router-link>
        </div>
        <div class="tip">
          <p>1. 绑定银行卡前先进行实名认证，请务必认真填写真实资料</p>
          <!--<p>2. 一个身份证只能绑定一个帐号</p>-->
          <!--<p>3. 如有疑问，请 <a href="tel:4008762722">联系客服</a> </p>-->
        </div>
      </div>
    </section>
</template>

<script>
  export default {
    name: "bankcardAdd",
    data() {
      return {
        userData: {}, //个人中心
        bankCardInfo: {}, //银行卡信息
        submitBankCardData: { //需要提交的银行卡信息
          chnName: '', //开户人姓名
          openBankName : '', //开户银行名称
          province: '', //支行省
          idCard : '', //持卡人身份证号
          bankName : '', //银行卡名称
          bankAccount : '', //银行卡号
          phone: '',   //预留手机号
        },
        realNameStatus: '',
      }
    },
    mounted() {
      this.getUserData()
    },
    methods: {
      getUserData() { //获取个人信息
        this.$axios.post('/api/user/query_user_msg').then(res => {
          if (res.data.errorCode === 0) {
            this.userData = res.data.data;
            this.realNameStatus = res.data.data.authStatus;
          }
        })
      },
      submitBankCardInfo() { //绑定/修改银行卡
        if(!this.submitBankCardData.chnName) {
          this.$toast('请输入开户人姓名')
          return
        }
        if(!this.submitBankCardData.openBankName) {
          this.$toast('请输入开户行名称')
          return
        }
        if(!this.submitBankCardData.bankAccount) {
          this.$toast('请输入银行卡号')
          return
        }
        let bankExp=/(^\d{16}$)|(^\d{19}$)/;//银行卡
        if(!(bankExp.test(this.submitBankCardData.bankAccount))) {
          this.$toast('银行卡号格式不正确')
          return
        }
        if(!this.submitBankCardData.province) {
          this.$toast('请输入开户省份')
          return
        }
        if(!this.submitBankCardData.idCard) {
          this.$toast('请输入身份证号')
          return
        }
        if(!this.submitBankCardData.bankName) {
            this.$toast('请输入银行卡名称')
            return
        }
        if(!this.submitBankCardData.phone) {
            this.$toast('请输入预留手机号')
            return
        }
        if(!/^[1][3,4,5,6,7,8][0-9]{9}$/.test(this.submitBankCardData.phone)) {
            this.$toast('手机号码格式不正确');
            return
        }
        this.$axios({
          url: '/api/user/add/bankcard',
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          data: this.submitBankCardData,
        }).then(res => {
          if(res.data.errorCode === 0) {
            this.$toast('绑定成功');
            this.$router.push({
              path: '/user'
            })
          }
        })
      },
    }
  }
</script>

<style scoped>
  /*输入框*/
  .form {
    background-color: #fff;
    margin-bottom: 0.8rem;
  }
  .form li {
    display: flex;
    align-items: center;
    padding: 0 1.35rem;
    border-bottom: 1px solid #f1f2f3;
    font-size: 1rem;
    height: 3.3rem;
  }
  .form li span {
    display: inline-block;
    width: 30%;
    font-size: 0.9rem;
    text-align: left;
  }
  .form li input {
    width: 70%;
    font-size: 0.9rem;
    outline: none;
    border: none;
    padding: 0;
    border-radius: 0.3rem;
    box-sizing: border-box;
    line-height: 1;
  }
  /*提交按钮*/
  .submitBtn {
    padding: 1.3rem;
  }
  .submitBtn .add_btn {
    background-color: #ff5e00;
    border-radius: 0.3rem;
    color: #fff;
    height: 2.6rem;
    line-height: 2.6rem;
    padding: 0 0.8rem;
    font-size: 0.9rem;
    text-align: center;
    outline: none;
    border: none;
    display: block;
    width: 100%;
  }
  /*注意*/
  .tip {
    margin-top: 0.8rem;
    /*background: #fff;*/
  }
  .tip p {
    color: #adadad;
    line-height: 2;
    font-size: 0.7rem;
    text-align: left;
    padding: .5rem;
  }
  .tip p a {
    color: #249fed;
  }
  .auditing, .unaudit {
    background: #fff;
    padding: 1rem;
    text-align: center;

  }
  .auditing p, .unaudit p {
    color: #ff5e00;
    font-size: 1rem;
    font-weight: bold;
  }
</style>
