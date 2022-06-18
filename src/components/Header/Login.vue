<template>
  <div class="Login">
    <el-form
      v-if="isLogin"
      ref="form"
      :model="loginForm"
      label-width="80px"
      size="mini"
    >
      <el-form-item label="手机号码：" size="mini" label-width="100px" required>
        <input type="text" v-model="loginForm.phoneNum" class="loginInput" />
      </el-form-item>
      <el-form-item label="密码：" size="mini" label-width="100px" required>
        <input
          type="password"
          v-model="loginForm.password"
          class="loginInput"
        />
      </el-form-item>
      <div class="loginButton">
        <el-button type="danger" @click="login" size="mini">登录</el-button>
      </div>
      <div class="regEnter" @click="isLogin = false">注册</div>
    </el-form>
    <div v-else>
      <span @click="isLogin = true" class="back">返回登录</span>
      <el-form
        :model="regForm"
        :rules="RegRules"
        ref="regForm"
        label-width="100px"
      >
        <el-form-item
          label="手机号码"
          prop="phone"
          size="mini"
          label-width="80px"
          required
        >
          <el-input v-model.number="regForm.phone"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          size="mini"
          label-width="80px"
          required
        >
          <el-input type="password" v-model="regForm.password"></el-input>
        </el-form-item>
        <el-form-item
          label="昵称"
          prop="nickname"
          size="mini"
          label-width="80px"
          required
        >
          <el-input v-model="regForm.nickname"></el-input>
        </el-form-item>
        <el-form-item
          label="验证码"
          prop="captcha"
          size="mini"
          label-width="80px"
          required
        >
          <el-input
            v-model="regForm.captcha"
            class="capchaInput"
            :disabled="!isSendCapcha"
          ></el-input>
          <el-button @click="sendCapcha" size="mini" v-show="!isSendCapcha"
            >发送验证码</el-button
          >
          <el-button size="mini" v-show="isSendCapcha" :disabled="isSendCapcha"
            >{{ currentTime }}S</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >注册</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号码不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (/^1[3|4|5|7|8][0-9]{9}$/.test(value)) {
            this.checkPhoneIsRegister(value).then(function (res) {
              if (res) {
                callback(new Error("此号码已被注册"));
              } else {
                callback();
              }
            });
          } else {
            callback(new Error("手机号格式错误"));
          }
        }
      }, 500);
    };
    return {
      isLogin: true,
      isRegister: false,
      isSendCapcha: false,
      currentTime: 60,
      loginForm: {
        password: "",
        phoneNum: "",
      },
      regForm: {
        phone: "",
        password: "",
        captcha: "",
        nickname: "",
      },
      RegRules: {
        phone: [{ validator: checkPhone, trigger: ["blur", "change"] }],
      },
    };
  },
  methods: {
    async login() {
      //   手机登录请求
      let timestamp = Date.parse(new Date());
      let result = await this.$http("/login/cellphone", {
        phone: this.loginForm.phoneNum,
        password: this.loginForm.password,
        withCredentials: true,
        timestamp,
      });
      // console.log(result);
      // 登录成功
      if (result.data.code == 200) {
        // 将请求到的用户id存入localstorage
        // 在index.vue 和 bottomControl.vue中用到过
        window.localStorage.setItem("userId", result.data.profile.userId);
        // this.userInfo = result.data.profile;
        // 将userInfo传回父组件
        this.$emit("getUserInfo", result.data.profile);

        this.$message.success("登录成功!");
        // 刷新页面
        // this.$router.go(0);
        // 修改vuex中的登录状态
        this.$store.commit("updataLoginState", true);
        // this.$store.commit("updateCurrentUserId", result.data.profile.userId);
      } else if (result.data.code == 400) {
        // 手机号错误
        this.$message.error("手机号错误!");
        return;
      } else if (result.data.code == 502) {
        // 密码错误
        this.$message.error("密码错误!");
        return;
      } else {
        // 登录失败，请稍后重试
        this.$message.error("登录失败，请稍后重试!");
        return;
      }

      // 清空输入框的内容
      this.loginForm.password = "";
      this.loginForm.phoneNum = "";
    },

    // 注册
    async register() {
      this.isLogin = true;
    },

    // 检查号码是否已注册
    async checkPhoneIsRegister(phone) {
      let res = await this.$http("/cellphone/existence/check", { phone });
      if (res.data.code == 200) {
        // this.isRegister = res.data.hasPassword;
        return res.data.hasPassword;
      }
    },

    // 发送验证码
    async sendCapcha() {
      this.isSendCapcha = true;
      let res = await this.$http("/captcha/sent", {
        phone: this.regForm.phone,
      });
      if (res.data.code == 200) {
      }
      this.timer = setInterval(() => {
        this.currentTime--;
      }, 1000);
    },
    submitForm() {
      this.$refs.regForm.validate((vaild) => {
        if (vaild) {
          let { captcha, phone, password, nickname } = this.regForm;
          this.$http("/register/cellphone", {
            captcha,
            phone,
            password,
            nickname,
          })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err.config);
              if (err.response) {
                console.log(err.response.data);
                this.$message.error(err.response.data.message);
                console.log(err.response.status);
                console.log(err.response.headers);
              } else if (err.request) {
                console.log(err.request);
              } else {
                console.log("Error" + error.message);
              }
            });
        }
      });
    },
  },
  watch: {
    currentTime(newValue, oldValue) {
      if (newValue == 0) {
        clearInterval(this.timer);
        this.isSendCapcha = false;
        this.currentTime = 60;
      }
    },
  },
};
</script>
<style lang="less"  scoped>
.regEnter {
  width: 100%;
  text-align: center;
  font-size: 12px;
  cursor: pointer;
  margin: 15px auto 0;
}

.regEnter:hover {
  text-decoration: underline;
}

.loginInput {
  height: 25px;
  border-radius: 5px;
  outline: none;
  border: 1px solid #999;
  padding-left: 5px;
  width: 175px;

  .el-input__inner {
    background: none !important;
  }
}

.el-form {
  padding-top: 10px;
}

.loginButton {
  width: 100%;
  text-align: center;
}

.loginButton .el-button {
  width: 120px;
}
.back {
  font-size: 12px;
  cursor: pointer;
}
.back:hover {
  text-decoration: underline;
}
.capchaInput {
  width: 120px;
  margin-left: 7px;
}
</style>