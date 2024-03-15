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
          <el-option label="ID" value="id_equipment"></el-option>
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

    <el-button type="primary"
               plain
               style="position: relative;top:-60px"
               @click="showDialog">新增设备
    </el-button>

    <el-dialog v-model="dialogVisible"
               width="500px"
               title="新增设备">
      <el-form :model="equipmentForm"
               ref="equipmentForm"
               :rules="rules"
               label-width="80px"
               status-icon>
        <el-form-item label="名称" prop="name">
          <el-input type="text"
                    placeholder="名称"
                    v-model="equipmentForm.name"></el-input>
        </el-form-item>
        <el-form-item label="型号" prop="model">
          <el-input type="text"
                    placeholder="型号"
                    v-model="equipmentForm.model"></el-input>
        </el-form-item>
        <el-form-item label="制造商" prop="manufacturer">
          <el-input type="text"
                    placeholder="制造商"
                    v-model="equipmentForm.manufacturer"></el-input>
        </el-form-item>
        <el-form-item label="存放地点" prop="address">
          <el-input type="text"
                    placeholder="存放地点"
                    v-model="equipmentForm.address"></el-input>
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
              max-height="279"
              style="width: 100%;position: relative;top: -35px;">
      <el-table-column prop="idEquipment"
                       label="ID"></el-table-column>
      <el-table-column prop="name"
                       label="名称"></el-table-column>
      <el-table-column prop="model"
                       label="型号"></el-table-column>
      <el-table-column prop="status"
                       label="状态"></el-table-column>
      <el-table-column prop="cUser"
                       label="当前使用人"></el-table-column>
      <el-table-column prop="manufacturer"
                       label="制造商"></el-table-column>
      <el-table-column prop="address"
                       label="所在地点"></el-table-column>
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
  name: "EquipmentInfos",
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
        ],
        name: [{required: true, message: "名称不能为空", trigger: "blur"}],
        model: [{required: true, message: "型号不能为空", trigger: "blur"}],
        manufacturer: [{required: true, message: "制造商不能为空", trigger: "blur"}],
        address: [{required: true, message: "存放地点不能为空", trigger: "blur"}],
      },
      tableData: null,
      dialogVisible: false,
      equipmentForm: {
        idEquipment: "",
        name: "",
        model: "",
        manufacturer: "",
        address: "",
        cUser: null
      },
      currentPage: 1,
      pageSize: 10,
      total: null,
    }
  },
  methods: {
    handleSubmit: function () {
      let _this = this
      this.$refs.selectForm.validate((valid) => {
        if (valid) {
          axios.get("http://localhost:8888/limsEquipments/search", {params: _this.selectForm}).then(function (resp) {
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
    async page(newPage) {
      let _this = this
      if (this.selectForm.value == "") {//未进行搜索时
        axios.get("http://localhost:8888/limsEquipments/list/" + newPage + "/" + this.pageSize).then(function (resp) {
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
          _this.equipmentForm.idEquipment = "EQ" + (_this.total + 1)
        }).catch(function (e) {
          ElMessage.error(e + "")
        })
      } else {//进行搜索时
        _this.selectForm.page = newPage
        axios.get("http://localhost:8888/limsEquipments/search", {params: _this.selectForm}).then(function (resp) {
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
    },
    showDialog() {
      if (this.$refs.equipmentForm != undefined) this.$refs.equipmentForm.resetFields()
      this.dialogVisible = true
    },
    handleAdd() {
      let _this = this
      this.$refs.equipmentForm.validate(async (valid) => {
        if (valid) {
          _this.selectForm.value = ""
          await _this.page(1)
          _this.currentPage = 1
          await axios.post("http://localhost:8888/limsEquipments/newEquipment", _this.equipmentForm).then(function (resp) {
            if (resp.data.code == 0) {
              _this.dialogVisible = false
              ElMessage.success("添加成功")
            } else {
              ElMessage.error("添加失败")
            }
          }).catch(function (e) {
            ElMessage.error(e + "")
          })
          _this.selectForm.value = ""
          await _this.page(1)
          _this.currentPage = 1
        }
      })
    }
  },
  created() {
    let _this = this
    axios.get('http://localhost:8888/limsEquipments/list/1/' + this.pageSize).then(function (resp) {
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
      //设定下一个插入id
      _this.equipmentForm.idEquipment = "EQ" + (_this.total + 1)
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