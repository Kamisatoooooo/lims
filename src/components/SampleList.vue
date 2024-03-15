<template>
  <div class="user-container">

    <el-button type="primary"
               plain
               @click="showDialog">新增样本
    </el-button>

    <el-dialog v-model="dialogVisible"
               width="500px"
               title="新增样本">
      <el-form :model="newSample"
               ref="sampleForm"
               :rules="rules"
               label-width="80px"
               status-icon>
        <el-form-item label="检测标准" prop="standard">
          <el-input type="text"
                    placeholder="检测标准"
                    v-model="newSample.standard"></el-input>
        </el-form-item>
        <el-form-item label="登记地点" prop="address">
          <el-input type="text"
                    placeholder="登记地点"
                    v-model="newSample.address"></el-input>
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

      <el-table-column prop="idSample"
                       label="样本id"
      ></el-table-column>
      <el-table-column prop="standard"
                       label="检测标准"
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
  name: "SampleList",
  props: ["user"],
  data() {
    return {
      tableData: null,
      dialogVisible: false,
      newSample: {
        idSample: "",
        user: null,
        standard: "",
        address: "",
        t: ""
      },
      rules: {
        standard: [{required: true, message: "检测标准不能为空", trigger: "blur"}],
        address: [{required: true, message: "登记地点不能为空", trigger: "blur"}]
      },
      currentPage: 1,
      pageSize: 10,
      total: null,
    }
  },
  methods: {
    handleAdd() {
      this.newSample.t = this.now()
      let _this = this
      this.$refs.sampleForm.validate(async (valid) => {
        if (valid) {
          _this.currentPage = 1
          await _this.page(1)
          axios.post("http://localhost:8888/limsSamples/newSample", this.newSample).then(function (resp) {
            if (resp.data.code == 0) {
              _this.dialogVisible = false
              ElMessage.success("添加成功")
              _this.currentPage = 1
              _this.page(1)
            } else {
              ElMessage.error("添加失败")
              _this.currentPage = 1
              _this.page(1)
            }
          }).catch(function (e) {
            ElMessage.error(e + "")
          })
        }
      })
    },
    showDialog() {
      if (this.$refs.sampleForm != undefined) this.$refs.sampleForm.resetFields()
      this.dialogVisible = true
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
    async page(newPage) {
      let _this = this
      axios.get("http://localhost:8888/limsSamples/list/" + newPage + "/" + this.pageSize).then(function (resp) {
        _this.tableData = resp.data.data.data
        for (let elem of _this.tableData) {
          //解决时间标准中带T的问题
          elem.t = elem.t.replace("T", " ")
        }
        _this.total = resp.data.data.total
        _this.newSample.idSample = "SMP" + (_this.total + 1)
      }).catch(function (e) {
        ElMessage.error(e + "")
      })
    }
  },
  created() {
    this.newSample.user = this.user.idUser
    let _this = this
    axios.get("http://localhost:8888/limsSamples/list/1/" + this.pageSize).then(function (resp) {
      _this.tableData = resp.data.data.data
      for (let elem of _this.tableData) {
        //解决时间标准中带T的问题
        elem.t = elem.t.replace("T", " ")
      }
      _this.total = resp.data.data.total
      //设定下一个插入id
      _this.newSample.idSample = "SMP" + (_this.total + 1)
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