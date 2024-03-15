<template>
  <div class="user-container">

    <el-table :data="tableData"
              border
              stripe
              style="width: 100%;position: relative;top: -30px;">
      <el-table-column label="数据操作">
        <template #default="scope">
          <div style="width: fit-content;margin: auto">
            <el-button-group>
              <el-button type="primary"
                         plain
                         size="mini"
                         @click="handleEdit(scope.row)">录入
              </el-button>
              <el-button type="primary"
                         size="mini"
                         plain
                         @click="handleSee(scope.row)">查看
              </el-button>
            </el-button-group>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="idExperiment"
                       label="ID"
      ></el-table-column>
      <el-table-column prop="status"
                       label="状态"
      >
        <template #default="scope">
          <el-select v-model="scope.row.status"
                     placeholder="实验状态"
                     @change="setStatus(scope.row)">
            <el-option label="进行中" value="0"></el-option>
            <el-option label="已完成" value="1"></el-option>

          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="idSample"
                       label="样本id"
      ></el-table-column>
      <el-table-column prop="testAddress"
                       label="实验地点"
      >
        <template #default="scope">
          <el-input v-model="scope.row.testAddress"
                    placeholder="实验地点"
                    @blur="changeTestAddress(scope.row)"
                    @focus="store(scope.row)">
            <el-option label="进行中" value="0"></el-option>
            <el-option label="已完成" value="1"></el-option>

          </el-input>
        </template>
      </el-table-column>
      <el-table-column prop="idTester"
                       label="负责人"
      ></el-table-column>
      <el-table-column prop="idHelper1"
                       label="实验员1"
      >
        <template #default="scope">
          <el-button type="info"
                     plain
                     v-text="scope.row.idHelper1"
                     style="width: 100%"
                     @click="changeHelper(scope.row,1)"
          ></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="idHelper2"
                       label="实验员2"
      >
        <template #default="scope">
          <el-button type="info"
                     plain
                     v-text="scope.row.idHelper2"
                     style="width: 100%"
                     @click="changeHelper(scope.row,2)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible"
               width="850px"
               title="设置实验员">
      <el-input type="text"
                placeholder="请在下方选择要分配的实验员"
                ref="helper"
                disabled
                v-model="helperName"></el-input>
      <AllUsers @select="setHelper"></AllUsers>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary"
                     @click="handleChange"
                     style="margin-left: 50px;margin-right: 10px">提交</el-button>
        </span>

      </template>
    </el-dialog>

    <el-dialog v-model="dataDialogVisible"
               width="500px"
               title="录入数据">
      <el-form :model="experimentData"
               ref="experimentData"
               label-width="80px"
               v-loading="formLoading"
               status-icon>
        <el-form-item label="字段1">
          <el-input type="text"
                    placeholder="字段名"
                    v-model="experimentData.field1"></el-input>
        </el-form-item>
        <el-form-item label="值1">
          <el-input type="text"
                    placeholder="值"
                    v-model="experimentData.value1"></el-input>
        </el-form-item>
        <el-form-item label="字段2">
          <el-input type="text"
                    placeholder="字段名"
                    v-model="experimentData.field2"></el-input>
        </el-form-item>
        <el-form-item label="值2">
          <el-input type="text"
                    placeholder="值"
                    v-model="experimentData.value2"></el-input>
        </el-form-item>
        <el-form-item label="字段3">
          <el-input type="text"
                    placeholder="字段名"
                    v-model="experimentData.field3"></el-input>
        </el-form-item>
        <el-form-item label="值3">
          <el-input type="text"
                    placeholder="值"
                    v-model="experimentData.value3"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dataDialogVisible = false">取消</el-button>
          <el-button type="primary"
                     @click="handleData"
                     style="margin-left: 50px;margin-right: 10px">提交</el-button>
        </span>

      </template>
    </el-dialog>

    <el-dialog v-model="dataDialogSeeVisible"
               width="600px"
               title="查看数据">
      <el-table :data="experimentDataSee"
                border
                v-loading="experimentDataLoading"
                element-loading-text="Loading···"
                style="width: 100%;position: relative;top: -30px;">
        <el-table-column prop="field1"
                         label="字段1"></el-table-column>
        <el-table-column prop="value1"
                         label="值1"></el-table-column>
        <el-table-column prop="field2"
                         label="字段2"></el-table-column>
        <el-table-column prop="value2"
                         label="值2"></el-table-column>
        <el-table-column prop="field3"
                         label="字段3"></el-table-column>
        <el-table-column prop="value3"
                         label="值3"></el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary"
                     @click="dataDialogSeeVisible = false">确定</el-button>
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

import {ElMessage} from "element-plus";
import AllUsers from "@/components/AllUsers";
import axios from "axios";

export default {
  props: ["user"],
  name: "Experiments",
  components: {AllUsers},
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
      experimentData: {
        idData: "",
        field1: "",
        field2: "",
        field3: "",
        value1: "",
        value2: "",
        value3: ""
      },
      experimentDataLoading: true,
      formLoading: true,
      experimentDataSee: null,
      dialogVisible: false,
      dataDialogVisible: false,
      dataDialogSeeVisible: false,
      idExperiment: "",
      helperName: null,
      helperNo: null,
      currentPage: 1,
      pageSize: 10,
      total: null,
      testAddress: {
        idExperiment: "",
        tTestAddress: "",
      }
    }
  },
  methods: {
    handleEdit(row) {
      //显示数据录入dialog,获取数据用于渲染
      let _this = this
      this.formLoading = true
      this.dataDialogVisible = true
      this.experimentData.idData = row.idData
      axios.get("http://localhost:8888/limsDatas/getData/" + row.idData).then(function (resp) {
        _this.experimentData = resp.data.data
        _this.formLoading = false
      }).catch(function (e) {
        ElMessage.error(e + "")
      })
    },
    setStatus(row) {
      axios.put("http://localhost:8888/limsExperiments/changeStatus", row).then(function (resp) {
        if (resp.data.code == 0) {
          ElMessage.success("更新实验状态成功")
        } else {
          ElMessage.error("更新实验状态失败")
        }
      }).catch(function (e) {
        ElMessage.error(e + "")
      })
    },
    changeHelper(row, no) {
      //显示设置helper的对话框
      this.idExperiment = row.idExperiment
      this.helperName = null
      this.helperNo = no
      this.dialogVisible = true
    },
    handleChange() {
      //设置实验员
      let _this = this
      if (this.helperName == null) {
        ElMessage.error("请设置要指定的实验员")
        return
      }
      axios.put("http://localhost:8888/limsExperiments/changeHelper/" + this.idExperiment + "/" + this.helperNo + "/" + this.helperName, null).then(function (resp) {
        if (resp.data.code == 0) {
          ElMessage.success("修改成功")
          _this.dialogVisible = false
          _this.dataDialogVisible = false
        } else {
          ElMessage.error("修改失败")
        }
        _this.page(_this.currentPage)
      }).catch(function (e) {
        ElMessage.error(e + "")
      })
    },
    handleData() {
      //修改实验数据
      let _this = this
      axios.put("http://localhost:8888/limsDatas/changeData", this.experimentData).then(function (resp) {
        if (resp.data.code == 0) {
          ElMessage.success("修改成功")
          _this.dataDialogVisible = false
        } else {
          ElMessage.error("修改失败")
        }
      }).catch(function (e) {
        ElMessage.error(e + "")
      })
    },
    handleSee(row) {
      //获取数据库中存储的实验数据信息
      let _this = this
      this.experimentDataLoading = true
      this.dataDialogSeeVisible = true
      axios.get("http://localhost:8888/limsDatas/getData/" + row.idData).then(function (resp) {
        _this.experimentDataSee = [resp.data.data]
        _this.experimentDataLoading = false
      }).catch(function (e) {
        ElMessage.error(e + "")
      })
    },
    setHelper(row) {
      this.helperName = row.idUser
    },
    store(row) {
      this.testAddress.tTestAddress = row.testAddress
      this.testAddress.idExperiment = row.idExperiment
    },
    changeTestAddress(row) {
      let _this = this
      if (row.testAddress != this.testAddress.tTestAddress) {
        this.testAddress.tTestAddress = row.testAddress
        axios.put("http://localhost:8888/limsExperiments/changeTestAddress", this.testAddress).then(function (resp) {
          if (resp.data.code == 0) {
            ElMessage.success("实验地点修改成功")
          } else {
            ElMessage.error("实验地点修改失败")
            _this.page(_this.currentPage)
          }
        }).catch(function (e) {
          ElMessage.error(e + "")
        })
      }
    },
    page(newPage) {
      let _this = this
      axios.get("http://localhost:8888/limsExperiments/list/" + this.user.idUser + "/" + newPage + "/" + this.pageSize).then(function (resp) {
        _this.tableData = resp.data.data.data
        _this.total = resp.data.data.total
      }).catch(function (e) {
        ElMessage.error(e + "")
      })
    }
  },
  created() {
    let _this = this
    axios.get("http://localhost:8888/limsExperiments/list/" + this.user.idUser + "/1/" + this.pageSize).then(function (resp) {
      _this.tableData = resp.data.data.data
      for (let elem of _this.tableData) {
        switch (elem.status) {
          case 0:
            elem.status = "进行中"
            break
          case 1:
            elem.status = "已完成"
            break
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