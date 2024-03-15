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
          <el-option label="名称" value="name"></el-option>
          <el-option label="型号" value="model"></el-option>
          <el-option label="所在地点" value="address"></el-option>
        </el-select>
      </el-form-item>
      <div class="user-select-value">
        <el-form-item label="值">
          <el-input v-model="selectForm.value"
                    placeholder="请输入关键字"
                    style="width: 160px;">
          </el-input>
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
              border
              stripe
              max-height="319"
              style="width: 100%;position: relative;top: -30px;">
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary"
                     plain
                     style="width: 100%"
                     @click="handleEdit(scope.row)">借用
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
      <el-table-column prop="status"
                       label="状态"
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
import {ElMessage} from "element-plus";
import axios from "axios";

export default {
  props: ['user'],
  name: "EquipmentLends",
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
    handleEdit(row) {
      let _this = this
      this.$confirm("确定借用此设备吗？", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        row.cUser = _this.user.idUser
        axios.put("http://localhost:8888/limsEquipments/lend", row).then(function (resp) {
          if (resp.data.code == 0) {
            ElMessage.success("借用成功")
            _this.page(_this.currentPage)
          } else {
            ElMessage.error("借用失败")
            _this.page(_this.currentPage)
          }
        }).catch(function (e) {
          ElMessage.error(e + "")
        })
      })
    },
    handleSubmit() {
      let _this = this
      this.$refs.selectForm.validate((valid) => {
        if (valid) {
          _this.selectForm.page = 1
          axios.get('http://localhost:8888/limsEquipments/unusedsSearch', {params: _this.selectForm}).then(function (resp) {
            _this.currentPage = 1
            _this.tableData = resp.data.data.data
            for (let elem of _this.tableData) {
              switch (elem.status) {
                case 0:
                  elem.status = "空闲"
                  break;
                case 1:
                  elem.status = "使用中"
                  break;
              }
            }
            _this.total = resp.data.data.total
          }).catch(function (e) {
            ElMessage.error(e + "")
          })
        }
      })
    },
    page(newPage) {
      let _this = this
      if (this.selectForm.value == "") {
        axios.get("http://localhost:8888/limsEquipments/unuseds/" + newPage + "/" + this.pageSize).then(function (resp) {
          _this.tableData = resp.data.data.data
          for (let elem of _this.tableData) {
            switch (elem.status) {
              case 0:
                elem.status = "空闲"
                break
              case 1:
                elem.status = "使用中"
                break;
            }
          }
          _this.total = resp.data.data.total
        }).catch(function (e) {
          ElMessage.error(e + "")
        })
      } else {
        this.selectForm.page = newPage
        axios.get("http://localhost:8888/limsEquipments/unusedsSearch", {params: this.selectForm}).then(function (resp) {
          _this.tableData = resp.data.data.data
          for (let elem of _this.tableData) {
            switch (elem.status) {
              case 0:
                elem.status = "空闲"
                break
              case 1:
                elem.status = "使用中"
                break;
            }
          }
          _this.total = resp.data.data.total
        }).catch(function (e) {
          ElMessage.error(e + "")
        })
      }
    }
  },
  created() {
    let _this = this
    axios.get("http://localhost:8888/limsEquipments/unuseds/1/" + this.pageSize).then(function (resp) {
      _this.tableData = resp.data.data.data
      for (let elem of _this.tableData) {
        switch (elem.status) {
          case 0:
            elem.status = "空闲"
            break;
          case 1:
            elem.status = "使用中"
            break;
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