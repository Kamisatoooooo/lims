<template>
  <div class="regist-container">
    <!--注册表单-->
    <el-form :model="registForm"
             ref="registForm"
             :rules="rules"
             label-width="80px"
             status-icon>

      <el-form-item label="用户名" prop="username">
        <el-input type="text"
                  placeholder="用户名"
                  v-model="registForm.username"
                  maxlength="20">

        </el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input type="password"
                  placeholder="密码"
                  v-model="registForm.password"
                  maxlength="20">
        </el-input>
      </el-form-item>

      <el-form-item label="姓名" prop="name">
        <el-input type="text"
                  placeholder="姓名"
                  v-model="registForm.name"
                  maxlength="15">
        </el-input>
      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="registForm.gender">
          <el-radio label="男"/>
          <el-radio label="女"/>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="职责" prop="duties">
        <el-input type="text"
                  placeholder="职责"
                  v-model="registForm.duties"
                  maxlength="15">
        </el-input>
      </el-form-item>

      <el-form-item label="联系电话" prop="phoneNumber">
        <el-input type="text"
                  placeholder="联系电话"
                  v-model="registForm.phoneNumber"
                  maxlength="11"
                  oninput="value=value.replace(/[^0-9.]/g,'')">
        </el-input>
      </el-form-item>

      <el-form-item label-width="0"
                    class="buttons-container">
        <el-button plain
                   style="width: 80px"
                   :loading="loading"
                   @click="handleSubmit">
          提交
        </el-button>
        <el-button plain
                   style="width: 80px;margin-left: 50px"
                   @click="handleBack">
          返回
        </el-button>
      </el-form-item>
    </el-form>
    <p class="information">{{ information }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RegistForm",
  data() {
    return {
      registForm: {
        username: "",
        password: "",
        name: "",
        gender: "",
        duties: "",
        phoneNumber: ""
      },
      loading: false,
      rules: {
        username: [{required: true, message: "用户名不能为空", trigger: "blur"}],
        password: [{required: true, message: "密码不能为空", trigger: "blur"}],
        name: [{required: true, message: "姓名不能为空", trigger: "blur"}],
        gender: [{required: true, message: "性别不能为空", trigger: "blur"}],
        duties: [{required: false, trigger: "blur"}],
        phoneNumber: [
          {
            required: true,
            message: "电话不能为空",
            trigger: "blur"
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式错误'
          }
        ],
      },
      information: ""
    }
  },
  methods: {
    handleSubmit: function () {
      this.$refs.registForm.validate((valid) => {
        if (valid) {
          this.loading = true
          let _this = this
          axios.post("http://localhost:8888/limsUsers/regist", _this.registForm).then(function (resp) {
            _this.loading = false
            if (resp.data.code == -1) {
              _this.information = "用户名已存在"
            } else if (resp.data.code == 0) {
              _this.information = "注册成功，即将返回登录页"
              setTimeout(() => {
                _this.$emit("switch")
              }, 2000)
            } else {
              _this.information = "未知错误"
            }
          }).catch((e) => {
            _this.information = e
          })
        }
      })
    },
    handleBack: function () {
      this.$emit("switch")
    }
  }
}
</script>

<style scoped>
.regist-container {
  border: #00000077 solid 1px;
  padding: 20px 20px 10px;
  margin: 100px auto auto;
  width: 300px;
  box-shadow: #4a44ff40 3px 3px;
  border-radius: 5px;
  background-color: white;
}

.buttons-container {
  width: fit-content;
  margin: auto;
}

.information {
  color: #ff0014aa;
  font-size: small;
  margin: 5px;
  padding-left: 10px;
}
</style>