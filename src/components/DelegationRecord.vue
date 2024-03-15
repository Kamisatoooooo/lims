<template>
  <div class="user-container">

    <el-button type="primary"
               plain
               @click="showDialog">新增委托
    </el-button>

    <el-dialog v-model="dialogVisible"
               width="500px"
               title="新增委托">
      <el-form :model="newDelegation"
               ref="delegationForm"
               :rules="rules"
               label-width="80px"
               status-icon>
        <el-form-item label="样品编号" prop="idSample">
          <el-input type="text"
                    placeholder="样本编号"
                    v-model="newDelegation.idSample"></el-input>
        </el-form-item>
        <el-form-item label="委托公司" prop="idCompany">
          <el-input type="text"
                    placeholder="委托公司"
                    v-model="newDelegation.idCompany"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input type="text"
                    placeholder="联系人"
                    v-model="newDelegation.contact"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phoneNumber">
          <el-input type="text"
                    placeholder="联系电话"
                    maxlength="11"
                    oninput="value=value.replace(/[^0-9.]/g,'')"
                    v-model="newDelegation.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="登记地点" prop="address">
          <el-input type="text"
                    placeholder="登记地点"
                    v-model="newDelegation.address"></el-input>
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
              max-height="400"
              style="width: 100%;position: relative;top: 15px;">

      <el-table-column prop="idDelegation"
                       label="ID"
      ></el-table-column>
      <el-table-column prop="idSample"
                       label="样本id"
      ></el-table-column>
      <el-table-column prop="status"
                       label="状态"
      ></el-table-column>
      <el-table-column prop="idCompany"
                       label="委托公司"
      ></el-table-column>
      <el-table-column prop="contact"
                       label="联系人"
      ></el-table-column>
      <el-table-column prop="phoneNumber"
                       label="联系电话"
      ></el-table-column>
      <el-table-column prop="registrant"
                       label="登记人"
      ></el-table-column>
      <el-table-column prop="address"
                       label="登记地点"
      ></el-table-column>
      <el-table-column prop="t"
                       label="登记时间"
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
  name: "DelegationRecord",
  data() {
    return {
      tableData: null,
      dialogVisible: false,
      newDelegation: {
        idDelegation: "",
        idSample: "",
        idCompany: "",
        contact: "",
        phoneNumber: "",
        registrant: null,
        address: "",
        t: ""
      },
      currentPage: 1,
      pageSize: 10,
      total: null,
      rules: {
        idSample: [{required: true, message: "样本编号不能为空", trigger: "blur"}],
        idCompany: [{required: true, message: "委托公司不能为空", trigger: "blur"}],
        contact: [{required: true, message: "联系人不能为空", trigger: "blur"}],
        address: [{required: true, message: "登记地点不能为空", trigger: "blur"}],
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
    }
  },
  methods: {
    handleAdd() {
      let _this = this
      this.$refs.delegationForm.validate((valid) => {
        if (valid) {
          this.newDelegation.t = this.now()
          this.newDelegation.idDelegation = "DE" + this.newDelegation.idSample.replace("SMP", "")
          axios.post("http://localhost:8888/limsDelegations/newDelegation", this.newDelegation).then(function (resp) {
            if (resp.data.code == 0) {
              ElMessage.success("登记成功")
              _this.page(1)
              _this.currentPage = 1
              _this.dialogVisible = false
            } else if (resp.data.code == -1) {
              ElMessage.error("该样品的委托已存在")
              _this.page(1)
              _this.currentPage = 1
            } else {
              ElMessage.error("登记失败")
              _this.page(1)
              _this.currentPage = 1
            }
          }).catch(function (e) {
            ElMessage.error(e + "")
          })
        }
      })
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
    showDialog() {
      if (this.$refs.delegationForm != undefined) this.$refs.delegationForm.resetFields()
      this.dialogVisible = true
    },
    page(newPage) {
      let _this = this
      axios.get("http://localhost:8888/limsDelegations/list/" + newPage + "/" + this.pageSize).then(function (resp) {
        _this.tableData = resp.data.data.data
        for (let elem of _this.tableData) {
          switch (elem.status) {
            case 0:
              elem.status = "执行中"
              break;
            case 1:
              elem.status = "已完成"
              break;
          }
        }
        _this.total = resp.data.data.total
      }).catch(function (e) {
        ElMessage.error(e + "")
      })
    }
  },
  created() {
    let _this = this
    axios.get("http://localhost:8888/limsDelegations/list/1/" + this.pageSize).then(function (resp) {
      _this.tableData = resp.data.data.data
      for (let elem of _this.tableData) {
        switch (elem.status) {
          case 0:
            elem.status = "执行中"
            break;
          case 1:
            elem.status = "已完成"
            break;
        }
        elem.t = elem.t.replace("T", " ")
      }
      _this.total = resp.data.data.total
      _this.newDelegation.registrant = _this.user.idUser
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

.page {
  margin-top: 20px;
  float: right;
}

.dialog-footer {

}
</style>