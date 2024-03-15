<template>
  <div class="user-container">

    <el-table :data="tableData"
              border
              stripe
              style="width: 100%;position: relative;top: -30px;">
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary"
                     plain
                     style="width: 100%"
                     @click="handleEdit(scope.row)">分配
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="idProject"
                       label="ID"
      ></el-table-column>
      <el-table-column prop="deadline"
                       label="截止时间"
      >
        <template #default="scope">
          <el-date-picker v-model="scope.row.deadline"
                          type="datetime"
                          placeholder="选择截止时间"
                          format="YYYY-MM-DD HH:mm:ss"
                          value-format="YYYY-MM-DDTHH:mm:ss"/>
        </template>
      </el-table-column>
      <el-table-column prop="idCompany"
                       label="委托公司"
      ></el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible"
               width="850px"
               title="设置实验负责人">
      <el-input type="text"
                placeholder="请从下方选择用户"
                ref="helper"
                disabled
                v-model="allocateForm.idTester"></el-input>
      <AllUsers @select="setTester"></AllUsers>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary"
                     @click="handleAdd"
                     style="margin-left: 50px;margin-right: 10px">提交</el-button>
        </span>

      </template>
    </el-dialog>
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

import AllUsers from "@/components/AllUsers";
import axios from "axios";
import {ElMessage} from "element-plus";

export default {
  props: ["user"],
  name: "ProjectAllocate",
  components: {AllUsers},
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
      dialogVisible: false,
      allocateForm: {
        idProject: "",
        idAssigner: null,
        idTester: "",
        deadline: "",
        assignTime: "",
      },
      currentPage: 1,
      pageSize: 5,
      total: null,
      key: "",
      value: ""
    }
  },
  methods: {
    handleEdit(row) {
      this.allocateForm.idProject = row.idProject
      this.allocateForm.deadline = row.deadline
      this.allocateForm.idTester = ""
      this.dialogVisible = true
    },
    handleAdd() {
      let _this = this
      if (this.allocateForm.deadline == null) {
        ElMessage.error("请设置截止时间")
        this.dialogVisible = false
      } else if (this.allocateForm.idTester == "") {
        ElMessage.error("请选择负责人")
      } else {
        this.allocateForm.assignTime = this.now()//设置当前时间
        axios.put("http://localhost:8888/limsProjects/allocate", this.allocateForm).then(function (resp) {
          if (resp.data.code == 0) {
            ElMessage.success("分配成功")
            _this.page(_this.currentPage)
            _this.dialogVisible = false
          } else {
            ElMessage.error("分配失败")
          }
        }).catch(function (e) {
          ElMessage.error(e + "")
          _this.page(_this.currentPage)
        })
      }
    },
    setTester(row) {
      this.allocateForm.idTester = row.idUser
    },
    now() {
      let date = new Date();
      let t = "";
      t += date.getFullYear() + "-"
      t += date.getMonth() + 1 > 10 ? (date.getMonth() + 1) + "" : "0" + (date.getMonth() + 1)
      t += "-"
      t += date.getDate() > 10 ? date.getDate() + "" : "0" + date.getDate()
      t += "T"
      t += date.getHours() > 10 ? date.getHours() + "" : "0" + date.getHours()
      t += ":"
      t += date.getMinutes() > 10 ? date.getMinutes() + "" : "0" + date.getMinutes()
      t += ":"
      t += date.getSeconds() > 10 ? date.getSeconds() + "" : "0" + date.getSeconds()
      return t
    },
    page(newPage) {
      let _this = this
      axios.get("http://localhost:8888/limsProjects/listNull/" + newPage + "/" + this.pageSize).then(function (resp) {
        _this.tableData = resp.data.data.data
        _this.total = resp.data.data.total
      }).catch(function (e) {
        ElMessage.error(e + "")
      })
    }
  },
  created() {
    let _this = this
    this.allocateForm.idAssigner = this.user.idUser
    axios.get("http://localhost:8888/limsProjects/listNull/1/" + this.pageSize).then(function (resp) {
      _this.tableData = resp.data.data.data
      _this.total = resp.data.data.total
    }).catch(function (e) {
      ElMessage.error(e + "")
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