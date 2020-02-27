<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="5">
        <!-- 搜索 -->
        <el-col :span="18">
          <el-input
            placeholder="请输入内容" 
            v-model="queryInfo.query" 
            clearable 
            @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加 -->
        <el-col :span="6">
          <el-button type="primary" @click="addDialog = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格视图区域 -->
      <el-table
        :data="userList"
        stripe
        border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template #default="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="openModifyUserForm(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="addDialog"
      width="50%"
      @close="addDialogFormInit">
      <!-- 对话框主体内容区域 -->
      <el-form
        :model="addDialogForm"
        :rules="dialogFormRules" 
        ref="addDialogFormRef" 
        label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addDialogForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="addDialogForm.password"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="addDialogForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addDialogForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部按钮区域 -->
      <span slot="footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="modifyDdialog"
      width="50%"
      @close="modifyDialogFormInit">
      <!-- 对话框主体内容区域 -->
      <el-form
        :model="modifyDdialogForm"
        :rules="dialogFormRules" 
        ref="modifyDialogFormRef" 
        label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="modifyDdialogForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="modifyDdialogForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="modifyDdialogForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDdialogForm = false">取 消</el-button>
        <el-button type="primary" @click="modifyUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Users',
    data() {
      var checkEmail = (rule, value, callback) => {
        var reg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/
        if (reg.test(value)) {
          callback();
        } 
        callback(new Error('请输入正确邮箱'));
      }
      var checkMobile = (rule, value, callback) => {
        var reg = /^1[3456789]\d{9}$/
        if (reg.test(value)) {
          callback();
        } 
        callback(new Error('请输入正确手机号'));
      }
      return {
        queryInfo: {
          query: '',
          // 当前页数
          pagenum: 1,
          // 当前每页显示多少条数据
          pagesize: 5
        },
        userList: [],
        total: 0,
        // 添加用户对话框的显示与隐藏
        addDialog: false,
        // 添加用户表单数据
        addDialogForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        // 修改用户对话框的显示与隐藏
        modifyDdialog: false,
        // 修改用户表单数据
        modifyDdialogForm: {},
        // 表单验证规则
        dialogFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入用户密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入用户邮箱', trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkMobile, trigger: 'blur' }
          ],
        }
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      async getUserList() {
        const { data: res } = await this.$http.get('users', { 
          params: this.queryInfo 
        })
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.userList = res.data.users
        this.total = res.data.total
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getUserList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getUserList()
      },
      async userStateChanged(userinfo) {
        const { data: res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        
        if(res.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state
          return this.$message.error('更新用户状态失败！')
        }
        return this.$message.success('更新用户状态成功！')
      },
      addDialogFormInit() {
        this.$refs.addDialogFormRef.resetFields()
      },
      addUser() {
        this.$refs.addDialogFormRef.validate(async valid => {
          if(!valid) return 

          const {data: res} = await this.$http.post('users', this.addDialogForm)
          console.log(res)
          if(res.meta.status !== 201) return this.$message.error('添加失败，服务器端错误')

          this.$message.success('添加成功')
          this.addDialog = false
          this.getUserList()
        })
      },
      modifyDialogFormInit() {
        this.$refs.modifyDialogFormRef.resetFields()
        console.log(this.modifyDdialogForm)
      },
      openModifyUserForm(userInfo) {
        this.modifyDdialog = true
        this.modifyDdialogForm = userInfo
        console.log(this.modifyDdialogForm)
      },
      modifyUser() {
        this.$refs.modifyDialogFormRef.validate(async valid => {
          if(!valid) return 

          const {data: res} = await this.$http.put('users/' + this.modifyDdialogForm.id, {
            email: this.modifyDdialogForm.email,
            mobile: this.modifyDdialogForm.mobile
          })
          if(res.meta.status !== 200) return this.$message.error('修改失败，服务器端错误')

          this.modifyDdialog = false
          this.$message.success('修改成功')
          this.getUserList()
        })
      },
      async deleteUser(userInfo) {
        const confirmResult = await this.$confirm(`此操作将永久删除用户${userInfo.username}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // 用户点击了取消
        if(confirmResult !== 'confirm') return this.$message.info('已取消删除')
        // 用户点击了确认，发起请求删除用户数据
        const {data: res} = await this.$http.delete('users/' + userInfo.id)
        if(res.meta.status !== 200) return this.$message.error('用户删除失败，服务器端错误')
        this.$message.success('删除成功');
        this.getUserList()
      },
    }
  }
</script>

<style scoped>
  .el-table {
    margin-top: 1rem;
  }
  .el-pagination {
    margin-top: 1rem;
  }
</style>