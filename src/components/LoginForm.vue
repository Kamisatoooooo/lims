<template>
  <!--logo和名称-->
  <div>
    <div class="symbol-container">
      <h1><img class="symbol" alt="Logo" src="../assets/symbol.png"></h1>
    </div>
  </div>
  <!--登录表单-->
  <div class="login-container">
    <el-form :model="loginForm" :rules="rules"
             status-icon
             ref="loginForm"
             label-position="left"
             label-width="0px">

      <el-form-item prop="username">
        <el-input type="text"
                  placeholder="用户名"
                  v-model="loginForm.username"
                  maxlength="20">
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input v-model="loginForm.password"
                  type="password"
                  placeholder="密码"
                  show-password
                  maxlength="20">
        </el-input>
      </el-form-item>

      <el-form-item class="buttons-container">
        <el-button
            plain
            style="width: 80px"
            :loading="loading"
            @click="handleSubmit">登录
        </el-button>
        <el-button
            style="margin-left: 50px;width: 80px"
            plain
            @click="handleRegister">注册
        </el-button>
      </el-form-item>
    </el-form>
    <p class="information">{{ information }}</p>

  </div>
</template>

<script>
import axios from "axios";

axios.defaults.timeout = 3000;

export default {
  name: "LoginForm",
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [{required: true, message: "用户名不能为空", trigger: 'blur'}],
        password: [{required: true, message: "密码不能为空", trigger: 'blur'}]
      },
      loading: false,
      information: ""

    }
  },
  methods: {
    handleSubmit: function () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true//正在加载
          let _this = this
          axios.post("http://localhost:8888/limsUsers/login", _this.loginForm).then(function (resp) {
            _this.loading = false
            if (resp.data.code == -1) {
              _this.information = "用户名不存在"
            } else if (resp.data.code == -2) {
              _this.information = "密码错误"
            } else {
              localStorage.setItem("user", JSON.stringify(resp.data.data))
              _this.$router.replace({path: '/mainView', prop: resp.data})
            }
          }).catch((e) => {
            _this.loading = false
            _this.information = e;
          })
        }
      })
    },
    handleRegister: function () {
      this.$emit("switch")
    }
  }
  ,
  computed: {}
}
</script>

<style>
.symbol-container {
  margin-top: 10%;
  margin-bottom: 10px;
  padding: 0;
}

h1 {
  font-family: Consolas;
  text-align: center;
}

.symbol {
  width: 100px;
}

.login-container {
  border: #00000077 solid 1px;
  padding: 20px 20px 10px;
  margin: auto;
  width: 300px;
  box-shadow: #4a44ff40 3px 3px;
  border-radius: 5px;
  background-color: white;
}

.information {
  color: #ff0014aa;
  font-size: small;
  margin: 5px;
  padding-left: 10px;
}

#building {
  /*background: url("../assets/background.jpeg");*/
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
}

.buttons-container {
  width: fit-content;
  margin: auto;
}

input::-ms-reveal {
  display: none;
}

</style>