<template>
  <div class="user-container">


    <el-table :data="tableData"
              border
              stripe
              max-height="400"
              style="width: 100%;position: relative;top: -30px;left: -15px">
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary"
                     plain
                     style="width: 100%"
                     @click="handleEdit(scope.row)">提交
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="idUser"
                       label="ID"
      ></el-table-column>
      <el-table-column prop="username"
                       label="用户名"
      ></el-table-column>
      <el-table-column prop="name"
                       label="姓名"
      ></el-table-column>
      <el-table-column prop="gender"
                       label="性别"
      ></el-table-column>
      <el-table-column prop="phoneNumber"
                       label="联系电话"
      ></el-table-column>
      <el-table-column prop="role"
                       label="角色"
      >
        <template #default="scope">
          <el-select v-model="scope.row.role"
                     placeholder="设置角色">
            <el-option label="管理员" value="1"></el-option>
            <el-option label="实验负责人" value="2"></el-option>
            <el-option label="实验员" value="3"></el-option>
            <el-option label="前台登记" value="4"></el-option>
          </el-select>
        </template>

      </el-table-column>
    </el-table>
    <el-pagination class="page"
                   background
                   layout="prev,pager,next"
                   :page-size="pageSize"
                   :total="total"
                   v-model:current-page="currentPage"
                   @current-change="page">
    </el-pagination>
  </div>
</template>

<script>
import {ElMessage} from "element-plus";
import axios from "axios";

export default {
  name: "RegistVerify",
  data() {
    return {
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
      total: null
    }
  },
  methods: {
    handleEdit(row) {
      let _this = this
      if (row.role == null) {
        ElMessage.error("请设定角色后再提交")
      } else {
        axios.put("http://localhost:8888/limsUsers/setRole", row).then(function (resp) {
          if (resp.data.code == 0) {
            ElMessage.success("设置成功")
            _this.page(_this.currentPage)
          } else {
            ElMessage.error("设置失败")
          }
        }).catch(function (e) {
          ElMessage.error(e)
        })
      }
    },
    page(newPage) {
      let _this = this
      axios.get("http://localhost:8888/limsUsers/newRegists/" + newPage + "/" + this.pageSize).then(function (resp) {
        _this.tableData = resp.data.data.data
        for (let elem of _this.tableData) {
          elem.role = null
        }
        _this.total = resp.data.data.total
      }).catch(function (e) {
        ElMessage.error(e)
      })
    }
  },
  created() {
    let _this = this
    axios.get('http://localhost:8888/limsUsers/newRegists/' + this.currentPage + "/" + this.pageSize).then(function (resp) {
      _this.tableData = resp.data.data.data
      for (let elem of _this.tableData) {
        elem.role = null
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
  margin-left: 30px;
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