<template>
  <div class="user-container">

    <el-button type="primary"
               plain
               @click="showDialog">新增单位
    </el-button>

    <el-dialog v-model="dialogVisible"
               width="500px"
               title="新增单位">
      <el-form :model="newCompany"
               ref="companyForm"
               :rules="rules"
               label-width="80px"
               status-icon>
        <el-form-item label="单位名称" prop="name">
          <el-input type="text"
                    placeholder="单位名称"
                    v-model="newCompany.name"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input type="text"
                    placeholder="联系人"
                    v-model="newCompany.contact"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phoneNumber">
          <el-input type="text"
                    placeholder="联系电话"
                    v-model="newCompany.phoneNumber"
                    maxlength="11"
                    oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="单位地址" prop="address">
          <el-input type="text"
                    placeholder="单位地址"
                    v-model="newCompany.address"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary"
                     @click="handleAdd"
                     style="margin-left: 50px;margin-right: 10px">提交</el-button>
        </span>

      </template>
    </el-dialog>

    <el-table :data="tableData"
              border
              stripe
              style="width: 100%;position: relative;top: 15px;">

      <el-table-column prop="idCompany"
                       label="单位id"
      ></el-table-column>
      <el-table-column prop="name"
                       label="单位名称"
      ></el-table-column>
      <el-table-column prop="contact"
                       label="联系人"
      ></el-table-column>
      <el-table-column prop="phoneNumber"
                       label="联系电话"
      ></el-table-column>
      <el-table-column prop="address"
                       label="地址"
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
  name: "Companies",
  data() {
    return {
      tableData: null,
      dialogVisible: false,
      newCompany: {
        name: "",
        contact: "",
        phoneNumber: "",
        address: ""
      },
      rules: {
        name: [{required: true, message: "单位名称不能为空", trigger: "blur"}],
        contact: [{required: true, message: "联系人不能为空", trigger: "blur"}],
        address: [{required: true, message: "单位地址不能为空", trigger: "blur"}],
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
      currentPage: 1,
      pageSize: 10,
      total: null,
    }
  },
  methods: {
    handleAdd() {
      let _this = this
      this.$refs.companyForm.validate((valid) => {
        if (valid) {
          axios.post("http://localhost:8888/limsCompanies/newCompany", _this.newCompany).then(function (resp) {
            if (resp.data.code == 0) {
              _this.page(1)
              _this.currentPage = 1
              ElMessage.success("添加成功")
              _this.dialogVisible = false
            } else {
              ElMessage.error("添加失败")
            }
          }).catch(function (e) {
            ElMessage.error(e + "")
          })
        }
      })
    },
    showDialog() {
      if (this.$refs.companyForm != undefined) this.$refs.companyForm.resetFields()
      this.dialogVisible = true
    },
    page(newPage) {
      let _this = this
      axios.get("http://localhost:8888/limsCompanies/list/" + newPage + "/" + this.pageSize).then(function (resp) {
        _this.tableData = resp.data.data.data
        _this.total = resp.data.data.total
      }).catch(function (e) {
        ElMessage.error(e + "")
      })
    }
  },
  created() {
    let _this = this
    axios.get("http://localhost:8888/limsCompanies/list/1/" + this.pageSize).then(function (resp) {
      _this.tableData = resp.data.data.data
      _this.total = resp.data.data.total
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

.page {
  margin-top: 20px;
  float: right;
}

.dialog-footer {

}
</style>