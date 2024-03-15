<template>
  <div class="user-container">

    <el-table :data="tableData"
              border
              stripe
              max-height="400"
              style="width: 100%;position: relative;top: -30px;">
      <el-table-column prop="idProject"
                       label="ID"
      ></el-table-column>
      <el-table-column prop="deadline"
                       label="截止时间"
      >
      </el-table-column>
      <el-table-column prop="idCompany"
                       label="委托公司"
      ></el-table-column>
      <el-table-column prop="idTester"
                       label="实验负责人"
      ></el-table-column>
      <el-table-column prop="idAssigner"
                       label="分配人"
      ></el-table-column>
      <el-table-column prop="assignTime"
                       label="分配时间"
      ></el-table-column>

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

import axios from "axios";
import {ElMessage} from "element-plus";

export default {
  props: ["user"],
  name: "MyProjects",
  data() {
    return {
      selectForm: {
        key: "",
        value: "",
        page: "",
        size: 3
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
      pageSize: 5,
      total: null,
      key: "",
      value: ""
    }
  },
  methods: {
    page(newPage) {
      let _this = this
      axios.get("http://localhost:8888/limsProjects/myProjects/" + this.user.idUser + "/" + newPage + "/" + this.pageSize).then(function (resp) {
        _this.tableData = resp.data.data.data
        for (let elem of _this.tableData) {
          elem.deadline = elem.deadline.replace("T", " ")
          elem.assignTime = elem.assignTime.replace("T", " ")
        }
        _this.total = resp.data.data.total
      }).catch(function (e) {
        ElMessage.error(e + "")
      })
    }
  },
  created() {
    let _this = this
    axios.get("http://localhost:8888/limsProjects/myProjects/" + this.user.idUser + "/1/" + this.pageSize).then(function (resp) {
      _this.tableData = resp.data.data.data
      for (let elem of _this.tableData) {
        if (elem.deadline != null) {
          elem.deadline = elem.deadline.replace("T", " ")
        }
        if (elem.assignTime != null) {
          elem.assignTime = elem.assignTime.replace("T", " ")
        }
      }
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