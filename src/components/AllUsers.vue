<template>
  <div class="user-container">
    <el-form class="user-select-form"
             :model="selectForm"
             :rules="rules"
             ref="selectForm"
             label-width="100px">
      <el-form-item label="字段："
                    prop="key">
        <el-select v-model="selectForm.key"
                   class="user-select-input"
                   placeholder="请选择字段">
          <el-option label="用户名" value="username"></el-option>
          <el-option label="姓名" value="name"></el-option>
          <el-option label="角色" value="role"></el-option>
        </el-select>
      </el-form-item>
      <div class="user-select-value">
        <el-form-item label="值">
          <el-input v-if="selectForm.key!=`role`"
                    v-model="selectForm.value"
                    placeholder="请输入关键字"
                    style="width: 160px;">
          </el-input>
          <el-select v-if="selectForm.key==`role`"
                     v-model="selectForm.value"
                     placeholder="请选择角色"
                     style="width: 160px">
            <el-option label="管理员" value="1"></el-option>
            <el-option label="实验负责人" value="2"></el-option>
            <el-option label="实验员" value="3"></el-option>
            <el-option label="前台登记" value="4"></el-option>
            <el-option label="尚未指定" value="0"></el-option>
          </el-select>
          <el-button type="primary"
                     icon="el-icon-search"
                     style="position: relative;left: 10px;"
                     @click="handleSubmit">
            搜索
          </el-button>
        </el-form-item>
      </div>
    </el-form>

    <el-table :data="tableData"
              highlight-current-row
              border
              stripe
              @current-change="handleSelected"
              native="false"
              style="width:100%;position: relative;top: -30px;left: -10px"
              max-height="310">
      <el-table-column fixed
                       prop="idUser"
                       label="ID"></el-table-column>
      <el-table-column prop="username"
                       label="用户名"></el-table-column>
      <el-table-column prop="name"
                       label="姓名"></el-table-column>
      <el-table-column prop="gender"
                       label="性别"></el-table-column>
      <el-table-column prop="phoneNumber"
                       label="联系电话"></el-table-column>
      <el-table-column prop="role"
                       label="角色"></el-table-column>
    </el-table>
    <el-pagination class="page"
                   background
                   layout="prev, pager, next"
                   :page-size="pageSize"
                   :total="total"
                   v-model:current-page="currentPage"
                   @current-change="page">

    </el-pagination>
  </div>
</template>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";

export default {
  name: "AllUsers",
  data() {
    return {
      selectForm: {
        key: "",
        value: "",
        page: 1,
        size: 10
      },
      rules: {
        key: [
          {
            required: true, message: "请选择字段", trigger: 'change'
          }
        ]
      },
      tableData: null,
      currentPage: 1,
      pageSize: 10,
      total: null,
      key: "",
      value: ""
    }
  },
  methods: {
    handleSubmit() {
      let _this = this
      this.$refs.selectForm.validate((valid) => {
        if (valid) {
          _this.selectForm.page = 1
          axios.get('http://localhost:8888/limsUsers/search', {params: _this.selectForm}).then(function (resp) {
            _this.currentPage = 1
            _this.tableData = resp.data.data.data
            for (let respElement of _this.tableData) {
              switch (respElement.role) {
                case 1:
                  respElement.role = "管理员"
                  break;
                case 2:
                  respElement.role = "实验负责人"
                  break;
                case 3:
                  respElement.role = "实验员"
                  break;
                case 4:
                  respElement.role = "前台登记"
                  break;
                case 0:
                  respElement.role = "尚未指定"
                  break;
              }
            }
            _this.total = resp.data.data.total
          })
        }
      })
    },
    handleSelected(row) {
      if (row != null) {
        this.$emit('select', row)
      }
    },
    page(newPage) {
      let _this = this
      if (this.selectForm.value == "") {//未查询时直接使用list全部查询
        axios.get("http://localhost:8888/limsUsers/list/" + newPage + "/" + _this.pageSize).then(function (resp) {
          _this.tableData = resp.data.data.data
          for (let respElement of _this.tableData) {
            switch (respElement.role) {
              case 1:
                respElement.role = "管理员"
                break;
              case 2:
                respElement.role = "实验负责人"
                break;
              case 3:
                respElement.role = "实验员"
                break;
              case 4:
                respElement.role = "前台登记"
                break;
              case 0:
                respElement.role = "尚未指定"
                break;
            }
          }
          _this.total = resp.data.data.total
        }).catch(function (e) {
          ElMessage.error(e)
        })
      } else {
        _this.selectForm.page = newPage
        axios.get("http://localhost:8888/limsUsers/search", {params: _this.selectForm}).then(function (resp) {
          _this.tableData = resp.data.data.data
          for (let respElement of _this.tableData) {
            switch (respElement.role) {
              case 1:
                respElement.role = "管理员"
                break;
              case 2:
                respElement.role = "实验负责人"
                break;
              case 3:
                respElement.role = "实验员"
                break;
              case 4:
                respElement.role = "前台登记"
                break;
              case 0:
                respElement.role = "尚未指定"
                break;
            }
          }
          _this.total = resp.data.data.total
        }).catch(function (e) {
          ElMessage.error(e)
        })
      }
    }
  },
  created() {
    let _this = this
    axios.get('http://localhost:8888/limsUsers/list/1/' + _this.pageSize).then(function (resp) {
      _this.tableData = resp.data.data.data
      for (let respElement of _this.tableData) {
        switch (respElement.role) {
          case 1:
            respElement.role = "管理员"
            break;
          case 2:
            respElement.role = "实验负责人"
            break;
          case 3:
            respElement.role = "实验员"
            break;
          case 4:
            respElement.role = "前台登记"
            break;
          case 0:
            respElement.role = "尚未指定"
            break;
        }
      }
      _this.total = resp.data.data.total
    }).catch(function (e) {
      ElMessage.error(e)
    })
  }
}
</script>

<style>
.user-container {
  margin-top: 60px;
  margin-left: 80px;
  border: 0px solid red;
}

.user-select-form {
  margin-left: -40px;

}

.user-select-input {
  width: 160px;
  float: left;
}

.user-select-value {
  border: 0px solid red;
  width: 400px;
  height: 60px;
  position: relative;
  top: -64px;
  left: 250px;
}

.page {
  margin-top: 20px;
  float: right;
}
</style>