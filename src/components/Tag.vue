<template>
  <div>
    <el-button @click="handleAddClick">新增一个标签</el-button>
    <el-table
      :data="tags"
      stripe
      style="width: 100%">
      <el-table-column
        prop="id"
        label="id"
        width="380">
      </el-table-column>
      <el-table-column
        prop="name"
        label="标签名"
        width="380">
      </el-table-column>
      <el-table-column
        label="操作"
        width="200">
        <template v-slot="scope">
          <el-button type="text" size="small" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="addOrUpdateTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="标签名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Tag',
  data () {
    return {
      tags: [],
      dialogFormVisible: false,
      showBlogDetail: false,
      formLabelWidth: '120px',
      addOrUpdateTitle: '新增标签',
      form: {
        id: '',
        name: '',
      },
      rules:{
        name: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    handleAddClick () {
      this.dialogFormVisible = true
    },
    del (id) {
      axios.delete(`/api/tag/delete?id=${id}`).then(resp => {

        this.$message(
          {
            message: resp.data.message,
            type: 'warning'
          }
        )
        this.queryAllTag()
      })
    },
    async addOrUpdate () {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          await axios.post(`/api/tag/create?name=${this.form.name}`).then((res) => {
            this.$message('新增标签成功.')
            this.dialogFormVisible = false;
            this.queryAllTag()
            this.form.name = '';
          })
        } else {
          console.log('error submit!!');
        }
      });


    },
    // resetForm(formName) {
    //   this.$refs[formName].resetFields();
    // },

    queryAllTag () {
      axios.get('/api/tag/all').then(resp => {
        this.tags = resp.data.data
      }).catch(err => {
        console.log(err)
      })
    },
    queryBlogById (id) {
      return new Promise((resolve) => {
        axios.get(`/api/tag/getById?id=${id}`).then(resp => {
          resolve(resp.data.data)
        }).then(res => res)
      })
    }
  },
  mounted () {
    axios.get('/api/tag/all').then(resp => {
      this.tags = resp.data.data
    }).catch(err => {
      console.log(err)
    })
  }
}
</script>

<style scoped>

</style>
