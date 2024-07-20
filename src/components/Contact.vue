<template>
  <div>
    <div style="display: flex; height: 40px;padding: 10px;justify-content: space-between;margin-bottom: 100px">
      <el-button
        size="mini"
        @click="mulhandleDelete">删除
      </el-button>
      <el-button
        size="mini"
        @click="exportData">导出
      </el-button>
      <el-button
        size="mini"
        @click="add">新增
      </el-button>


      <el-input v-model="inputValue1" style="width: 300px;border: 1px solid #ccc" :placeholder="'请输入id'"></el-input>
      <el-button type="primary" @click="searchById">查询id</el-button>
      <el-input v-model="inputValue" style="width: 300px;border: 1px solid #ccc" :placeholder="'请输入'"></el-input>
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="id"
        width="120">
        <template v-slot="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="phoneNumber"
        label="电话号码"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deleteItem(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="()=> dialogVisible = false">
      <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
        <el-form-item label="姓名">
          <el-input v-model="formLabelAlign.name"></el-input>
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input v-model="formLabelAlign.phoneNumber"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">

    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submit">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      tableData: [],
      multipleSelection: [],
      dialogVisible: false,
      labelPosition: 'right',
      formLabelAlign: {
        phoneNumber: '',
        name: '',
        id: ''
      },
      inputValue: '',
      inputValue1: '',
      isAdd: false
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    handleClose () {

    },
    exportData () {
      const url = '/api/contract/exportData'
      axios({
        method: 'post',
        url: url, // 请求地址
// 二进制流文件，一定要设置成blob，默认是json
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      }).then(res => {

        const filename = decodeURIComponent(res.headers['content-disposition'].split(';')[1].split('=')[1])
        console.log(filename)
        const link = document.createElement('a')
        const blob = new Blob([res.data], {type: 'text/plain;charset=utf-8'})
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    search (e) {
      axios.get('/api/contract/search?key=' + this.inputValue.trim()).then(res => {
        this.tableData = res.data.data
      })
    },
    searchById () {
      console.log(this.inputValue1)
      axios.get('/api/contract/getItem?id=' + this.inputValue1).then(res => {
        this.tableData = [res.data.data]
      })
    },
    mulhandleDelete () {
      const ids = this.multipleSelection.map(item => item.id)
      axios.post('/api/contract/multDelete', ids).then(res => {
        this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
        this.getData()
      })
    },
    async getData () {
      const data = await axios.get('/api/contract/list')
      console.log(data)
      this.tableData = data.data.data;
    },
    resetForm () {
      Object.keys(this.formLabelAlign).forEach(item => this.formLabelAlign[item] = '')
    },
    submit () {
      const url = `/api/contract/${this.isAdd ? 'addItem' : 'update'}`
      const method = this.isAdd ? 'post' : 'put'
      axios[method](url, this.formLabelAlign).then(res => {
        this.$message({
          showClose: true,
          message: '成功',
          type: 'success'
        })
        this.resetForm()
        this.dialogVisible = false
        this.getData()
      })
    },
    handleEdit (index, row) {
      this.isAdd = false
      axios.get('/api/contract/getItem?id=' + row.id).then(res => {
        this.dialogVisible = true
        console.log(res)
        Object.keys(this.formLabelAlign).forEach(item => {
          this.formLabelAlign[item] = res.data.data[item]
        })
      })
    },
    deleteItem (id, row) {
      this.handleDelete(row)
    },
    handleDelete (row) {
      let param = []
      param = [row.id]
      axios.post('/api/contract/multDelete', param).then(res => {
        this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })

        this.getData()
      })
    },
    add () {
      this.resetForm()
      this.dialogVisible = true
      this.isAdd = true
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style scoped>
::v-deep .el-main {
  line-height: 26px !important;
}
</style>
