<template>
  <div class="user-container">

    <el-table :data="tableData"
              border
              stripe
              style="width: 100%;position: relative;top: -30px;">
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="warning"
                     plain
                     style="width: 100%"
                     @click="handleEdit(scope.row)">归还
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="idEquipment"
                       label="ID"
      ></el-table-column>
      <el-table-column prop="name"
                       label="名称"
      ></el-table-column>
      <el-table-column prop="model"
                       label="型号"
      ></el-table-column>
      <el-table-column prop="manufacturer"
                       label="制造商"
      ></el-table-column>
      <el-table-column prop="address"
                       label="所在地点"
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
  name: "MyEquipments",
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
      pageSize: 5,
      total: null
    }
  },
  methods: {
    handleEdit(row) {
      let _this = this
      this.$confirm("确定归还此设备吗？", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        axios.put("http://localhost:8888/limsEquipments/return", row).then(function (resp) {
          if (resp.data.code == 0) {
            ElMessage.success("归还成功")
          } else {
            ElMessage.error("归还失败")
          }
          _this.page(_this.currentPage)
        }).catch(function (e) {
          ElMessage.error(e + "")
          _this.page(_this.currentPage)
        })
      })
    },
    page(newPage) {
      let _this = this
      axios.get("http://localhost:8888/limsEquipments/myEquipments/" + this.user.idUser + "/" + newPage + "/" + this.pageSize).then(function (resp) {
        _this.tableData = resp.data.data.data
        _this.total = resp.data.data.total
      })
    }
  },
  created() {
    let _this = this
    axios.get("http://localhost:8888/limsEquipments/myEquipments/" + this.user.idUser + "/1/" + this.pageSize).then(function (resp) {
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