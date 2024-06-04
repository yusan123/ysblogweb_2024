<template>
  <div>
    <el-button @click="handleAddClick">新增一个博客</el-button>
    <!--    <el-button @click="clearFilter">删除所有</el-button>-->
    <el-table
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        prop="title"
        label="标题"
        width="180">
      </el-table-column>
      <el-table-column
        prop="context"
        label="博客正文"
        width="380">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="200">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间"
        width="200">
      </el-table-column>
      <el-table-column
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button @click="view(scope.row.id)" type="text" size="small">预览</el-button>
          <el-button type="text" size="small" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button type="text" size="small" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
<!--    新增或修改博客表单-->
    <el-dialog :title="addOrUpdateTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="博客标题" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="博客正文" :label-width="formLabelWidth">
          <el-input type="textarea"
                    :rows="2" v-model="form.context" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="博客标签" :label-width="formLabelWidth">
          <el-select clearable
                     multiple v-model="form.tagIds" placeholder="请选择">
            <el-option
              v-for="tag in tags"
              :key="tag.id"
              :label="tag.name"
              :value="tag.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate(flag)">确 定</el-button>
      </div>
    </el-dialog>
<!--    预览博客详情-->
    <el-dialog :visible.sync="showBlogDetail">
      <div style="height: 60px;font-size: 50px">{{ currentBlog.title }}</div>
      <div style="height: 30px">
        <el-tag style="margin-right: 5px" v-for="tag in currentBlog.tags" :key="tag.name">{{ tag.name }}</el-tag>
      </div>
      <span>创建时间:{{ currentBlog.createTime }} </span>
      <span>更新时间:{{ currentBlog.updateTime }}</span>
      <div>
        {{ currentBlog.context }}
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showBlogDetail = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import axios from 'axios'

export default {
  name: 'Blog',
  data () {
    return {
      tableData: [],
      tags: [],
      dialogFormVisible: false,
      showBlogDetail: false,
      formLabelWidth: '120px',
      addOrUpdateTitle:'新增博客',
      form: {
        id: '',
        title: '',
        context: '',
        tagIds: [],
      },
      flag: 'add',
      currentBlog: {
        title: '',
        context: '',
        tags: [],
        createTime: '',
        updateTime: '',
      },
    }
  },
  methods: {
    handleAddClick(){
      this.dialogFormVisible =true;
      this.flag = "add"
    },
    async handleEdit(id){
      this.addOrUpdateTitle = '修改博客';
      const blog = await this.queryBlogById(id);
      this.form.id = blog.id;
      this.form.title = blog.title;
      this.form.context = blog.context;
      this.form.tagIds = blog.tags.map(tag =>tag.id);
      this.dialogFormVisible =true;
      this.flag = "edit"
    },
    async view (id) {
      this.currentBlog = await this.queryBlogById(id);
      this.showBlogDetail = true
    },
    del (id) {
      axios.delete(`/api/blog/delete?id=${id}`).then(resp => {
        this.$message('删除博客成功.')
        this.queryAllBlog()
      })
    },
    async addOrUpdate (flag) {
      if('add' === flag){
        await axios.post('/api/blog/create', this.form, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((res) => {
          this.$message('新增博客成功.')
        })
      } else {
        await axios.put('/api/blog/update',this.form,{
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(resp =>{
          this.$message('更新博客成功.')
        })
      }
      this.form = {
        title: '',
        context: '',
        tagIds: [],
      }
      this.dialogFormVisible = false
      this.queryAllBlog();
    },
    queryAllBlog () {
      axios.get('/api/blog/all').then(resp => {
        this.tableData = resp.data.data
        console.log(resp.data)
      }).catch(err => {
        console.log(err)
      })
    },
    queryBlogById(id){
      return new Promise((resolve)=>{
        axios.get(`/api/blog/getById?id=${id}`).then(resp => {
         resolve(resp.data.data)
        }).then(res => res);
      })
    }
  },
  mounted () {
    this.queryAllBlog();
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
