<template>
    <section>
      <van-nav-bar
        title="实名认证"
        left-arrow
        fixed
        @click-left="$back()"
      />
      <div class="content">
        <div class="info">
          <p>为了保障您的账户安全，请先进行实名认证</p>
          <ul>
            <li>
              <i class="icon-verified"></i>
              <input type="text" placeholder="请输入您的姓名" v-model="realNameData.chnName">
            </li>
            <li>
              <i class="icon-idcard"></i>
              <input type="text" placeholder="请输入您的身份证号码" v-model="realNameData.idCard">
            </li>
          </ul>
          <div class="padding-main">
            <button class="btn" @click="submitRealNameData()">完成</button>
          </div>
        </div>
      </div>
    </section>
</template>

<script>
  export default {
    name: "verified-edit",
    data() {
      return {
        realNameData: { //实名认证上传信息
          chnName: '', //姓名
          idCard: '', //身份证号
        },
      }
    },
    methods: {
      //实名认证
      submitRealNameData() { //上传实名认证信息
        if(!this.realNameData.chnName) {
          this.$toast.fail({
            duration: 1000,   // 持续展示 toast
            message: '请输入正确姓名'
          });
          return
        }
        if(!this.realNameData.idCard || !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.realNameData.idCard)) {
          this.$toast.fail({
            duration: 1000,   // 持续展示 toast
            message: '请输入正确身份证号'
          });
          return
        }
        this.$axios({
          url: '/api/user/certification',
          method: 'post',
          data: this.realNameData
        }).then(res => {
          if(res.data.errorCode === 0) {
            this.$toast.success({
              duration: 2000,   // 持续展示 toast
              message: '提交成功 请耐心等待审核结果'
            });
            this.$router.push('/user');
          }
        })
      },
    },
  }
</script>

<style scoped>
  .info p {
    margin: 0;
    padding: 1rem 0;
    font-size: 0.7rem;
    color: #ff5e00;
    text-align: center;
  }
  .info ul {
    margin-bottom: 0.85rem;
  }
  .info ul li {
    background-color: #fff;
    padding: 0 1rem;
    height: 3.6rem;
    border-bottom: 1px solid #f1f2f3;
    display: flex;
    align-items: center;
  }
  .info ul li i {
    color: #ff5e00;
    font-size: 1.4rem;
    width: 10%;
  }
  .info ul li input {
    width: 100%;
    height: 100%;
    font-size: 0.9rem;
    outline: none;
    border: none;
    padding-left: 2%;
    box-sizing: border-box;
    line-height: 1;
  }
  .info .padding-main {
    padding: 1rem;
  }
  .info .padding-main .btn {
    background-color: #ff5e00;
    border-radius: 0.3rem;
    color: #fff;
    height: 2.6rem;
    line-height: 2.6rem;
    padding: 0 0.5rem;
    font-size: 0.85rem;
    text-align: center;
    outline: none;
    border: none;
    display: block;
    width: 100%;
  }
</style>
