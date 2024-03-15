<template>
  <el-container class="main-container">
    <el-header class="main-header">
      <div class="main-title">LIMS</div>

      <div class="main-user-container">
        <el-dropdown>
          <span class="el-dropdown-link main-user-info"><img src="../assets/logo.png" style="width: 30px">
            {{ user.username }}
            <i class="el-icon-arrow-down el-icon--right main-user-info"></i>
          </span>

          <template v-slot:dropdown>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="changeInfo">个人信息</el-dropdown-item>
              <el-dropdown-item @click.native="logOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-dialog v-model="userInfoVisible"
               title="个人信息"
               width="500px">
      <el-form :model="userInfoForm"
               ref="userInfoForm"
               :rules="rules"
               label-width="80px"
               status-icon>
        <el-form-item label="id">
          <el-input type="text"
                    v-model="userInfoForm.idUser"
                    disabled>

          </el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input type="text"
                    v-model="userInfoForm.username"
                    disabled>

          </el-input>
        </el-form-item>

        <el-form-item label="密码" prop="pwd">
          <el-input v-model="userInfoForm.pwd"
                    type="password"
                    placeholder="密码"
                    show-password
                    maxlength="20">

          </el-input>
        </el-form-item>

        <el-form-item label="姓名" prop="name">
          <el-input type="text"
                    placeholder="姓名"
                    v-model="userInfoForm.name"
                    maxlength="15">
          </el-input>
        </el-form-item>

        <el-form-item label="性别">
          <el-radio-group v-model="userInfoForm.gender">
            <el-radio label="男"/>
            <el-radio label="女"/>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="职责">
          <el-input type="text"
                    placeholder="职责"
                    v-model="userInfoForm.duties"
                    maxlength="15">
          </el-input>
        </el-form-item>

        <el-form-item label="联系电话" prop="phoneNumber">
          <el-input type="text"
                    placeholder="联系电话"
                    v-model="userInfoForm.phoneNumber"
                    maxlength="11"
                    oninput="value=value.replace(/[^0-9.]/g,'')">
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetUser">取消</el-button>
          <el-button type="primary"
                     @click="handleSubmit"
                     style="margin-left: 50px;margin-right: 10px">提交</el-button>
        </span>

      </template>
    </el-dialog>

    <!--  侧边栏-->
    <el-container>

      <el-aside width="200px" height="100%" class="main-aside">
        <el-menu router
                 :default-active="active"
                 unique-opened>
          <el-submenu index="1">
            <template #title>
              <i class="el-icon-s-platform"></i>
              <span>人员管理</span>
            </template>
            <el-menu-item index="/mainView/registVerify" :disabled="permissions.registVerify">注册审核</el-menu-item>
            <el-menu-item index="/mainView/allUsers" :disabled="permissions.allUsers">详细信息</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template #title>
              <i class="el-icon-s-order"></i>
              <span>委托管理</span>
            </template>
            <el-menu-item index="/mainView/delegationRecord" :disabled="permissions.delegationRecord">委托登记
            </el-menu-item>
            <el-menu-item index="/mainView/Companies" :disabled="permissions.companies">委托单位</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template #title>
              <i class="el-icon-star-on"></i>
              <span>项目管理</span>
            </template>
            <el-menu-item index="/mainView/ProjectAllocate" :disabled="permissions.projectAllocate">项目分配
            </el-menu-item>
            <el-menu-item index="/mainView/projectDetails" :disabled="permissions.projectDetails">项目详情
            </el-menu-item>
            <el-menu-item index="/mainView/myProjects" :disabled="permissions.myProjects">我的项目</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template #title>
              <i class="el-icon-s-help"></i>
              <span>实验管理</span>
            </template>
            <el-menu-item index="/mainView/experiments" :disabled="permissions.experiments">数据录入</el-menu-item>
            <el-menu-item index="/mainView/myEquipments" :disabled="permissions.myEquipments">实验设备</el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template #title>
              <i class="el-icon-success"></i>
              <span>样本管理</span>
            </template>
            <el-menu-item index="/mainView/sampleList" :disabled="permissions.sampleList">样本清单</el-menu-item>
          </el-submenu>
          <el-submenu index="6">
            <template #title>
              <i class="el-icon-s-tools"></i>
              <span>设备管理</span>
            </template>
            <el-menu-item index="/mainView/equipmentInfos" :disabled="permissions.equipmentInfos">设备信息
            </el-menu-item>
            <el-menu-item index="/mainVIew/equipmentLends" :disabled="permissions.equipmentLends">设备借出
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>

      <el-container>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item><b>LIMS</b></el-breadcrumb-item>
            <el-breadcrumb-item v-text="this.$router.currentRoute.value.name"></el-breadcrumb-item>
            <router-view :user="user"></router-view>
          </el-breadcrumb>
        </el-main>
        <el-footer class="main-footer">2023 &copy; LIMS</el-footer>
      </el-container>

    </el-container>
  </el-container>
</template>

<script>


import axios from "axios";
import {ElMessage} from "element-plus";

export default {
  name: "MainView",
  components: {},
  data() {
    return {
      user: "",
      active: "",
      permissions: {
        registVerify: true,
        allUsers: false,
        delegationRecord: true,
        companies: true,
        projectAllocate: true,
        projectDetails: true,
        myProjects: true,
        experiments: true,
        myEquipments: true,
        sampleList: true,
        equipmentInfos: true,
        equipmentLends: true
      },
      userInfoVisible: false,
      userInfoForm: {
        idUser: "",
        username: "",
        name: "",
        gender: "",
        pwd: "",
        phoneNumber: "",
        duties: "",
        role: ""
      },
      rules: {
        name: [{required: true, message: "密码不能为空", trigger: "blur"}],
        pwd: [{required: true, message: "密码不能为空", trigger: "blur"}],
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
      }
    }
  },
  methods: {
    logOut() {
      let _this = this
      this.$confirm("退出当前账号吗？", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        localStorage.removeItem('user')
        _this.$router.replace({path: '/'})
      })
    },
    changeInfo() {
      for (let k in this.user) {
        this.userInfoForm[k] = this.user[k]
      }
      this.userInfoVisible = true
    },
    resetUser() {
      for (let k in this.user) {
        this.userInfoForm[k] = this.user[k]
      }
      this.userInfoVisible = false
    },
    handleSubmit() {
      let _this = this
      this.$refs.userInfoForm.validate((valid) => {
        if (valid) {
          axios.put("http://localhost:8888/limsUsers/changeInfo", this.userInfoForm).then(function (resp) {
            if (resp.data.code == 0) {
              _this.userInfoForm = _this.user = resp.data.data
              localStorage.setItem("user", _this.user)
              ElMessage.success("更新成功")
              _this.userInfoVisible = false
            } else {
              ElMessage.error("更新失败")
            }
          }).catch(function (e) {
            ElMessage.error(e + "")
          })
        }
      })
    }
  },
  created() {
    this.user = JSON.parse(window.localStorage.getItem('user'))
    this.active = this.$router.currentRoute.value.path
    for (let k in this.user) {
      this.userInfoForm[k] = this.user[k]
    }
    if (this.user.idUser == 1) {
      for (let k in this.permissions) {
        this.permissions[k] = false
      }
    } else {
      switch (this.user.role) {
        case 0:
          break;
        case 1:
          this.permissions.registVerify = this.permissions.projectAllocate = this.permissions.projectDetails = this.permissions.equipmentInfos = false
          break
        case 2:
          this.permissions.myProjects = this.permissions.experiments = this.permissions.myEquipments = this.permissions.equipmentInfos = this.permissions.equipmentLends = false
          break
        case 3:
          this.permissions.myProjects = this.permissions.experiments = this.permissions.myEquipments = this.permissions.equipmentInfos = this.permissions.equipmentLends = false
          break
        case 4:
          this.permissions.delegationRecord = this.permissions.companies = this.permissions.sampleList = false
          break
      }
    }
  }

}
</script>

<style>

.main-container {
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
}

.main-header {
  background-color: rgba(48, 48, 48, 1);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.main-title {
  font-family: Consolas;
  color: white;
  font-size: 30px;
  display: inline;
  margin-left: 10px;
}

.main-user-container {
  display: inline;
  margin-right: 30px;
}

.main-user-info {
  color: white;
  cursor: pointer;
}

.main-aside {
  background-color: white;
  width: 200px;
}

.main-footer {
  background-color: white;
  color: black;
  font-size: 18px;
  line-height: 60px;
  text-align: center;
}
</style>