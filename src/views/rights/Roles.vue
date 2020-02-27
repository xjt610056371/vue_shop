<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row class="tagmargin">
        <el-col>
          <el-button type="primary" @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 表格视图区域 -->
      <el-table
        :data="rolesList"
        height="470"
        stripe
        border>
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template #default="scope">
            <el-row 
              v-for="(right1, index1) in scope.row.children" 
              :key="right1.id"
              :class="{ bbottom: true, btop: index1 === 0, center: true }">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRight(scope.row, right1)">{{right1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <el-row 
                  v-for="(right2, index2) in right1.children" 
                  :key="right2.id"
                  :class="{ btop: index2 !== 0, center: true }">
                  <!-- 渲染二级权限 -->
                  <el-col :span="8">
                    <el-tag 
                      type="success"
                      closable
                      @close="removeRight(scope.row, right2)">
                      {{right2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="16">
                    <el-tag 
                      v-for="(right3, index3) in right2.children" 
                      :key="right3.id"
                      type="warning"
                      class="tagmargin"
                      closable
                      @close="removeRight(scope.row, right3)">
                      {{right3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRights(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightsDialogShow"
      width="50%"
      @close="setRightsDialogClose">
      <!-- 对话框主体内容区域 -->
      <el-tree
        :data="rightsList" 
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef">
      </el-tree>
      <!-- 对话框底部按钮区域 -->
      <span slot="footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button @click="allowSetRights" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="addRoleDialogShow"
      width="50%"
      @close="addRoleDialogClose">
      <!-- 对话框主体内容区域 -->
      <el-form
        :model="roleInfo" 
        :rules="addRoleFormRules" 
        ref="addRoleFormRef" 
        label-width="100px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="roleInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部按钮区域 -->
      <span slot="footer">
        <el-button @click="addRoleDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Roles',
    data() {
      return {
        rolesList: [],
        rightsList: [],
        // 分配权限相关属性
        currentRole: {},
        setRightsDialogShow: false,
        treeProps: {
          label: 'authName',
          children: 'children'
        },
        defKeys: [],
        // 添加角色相关属性
        addRoleDialogShow: false,
        roleInfo: {
          roleName: '',
          roleDesc: ''
        },
        addRoleFormRules: {
          roleName: [
            { required: true, message: '请输入角色名', trigger: 'blur' }
          ]
        },
      }
    },
    created() {
      this.getRolesList()
      this.getRightsList()
    },
    methods: {
      async getRolesList() {
        const {data: res} = await this.$http.get('roles')
        if(res.meta.status !== 200) return this.$message.error('获取角色列表失败，服务器错误');
        // 获取成功
        this.rolesList = res.data
      },
      async getRightsList() {
        const {data: res} = await this.$http.get('rights/tree')
        if(res.meta.status !== 200) return this.$message.console.error('获取权限列表失败，服务器错误');
        // 获取成功
        this.rightsList = res.data
      },
      async removeRight(role, right) {
        const confirmResult = await this.$confirm(`此操作将删除${role.roleName}的权限：${right.authName}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // 用户点击了取消
        if(confirmResult !== 'confirm') return this.$message.info('已取消删除')
        // 用户点击了确认，发起请求删除用户数据
        const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${right.id}`)
        if(res.meta.status !== 200) return this.$message.error('删除失败，服务器端错误')
        this.$message.success('删除成功')
        // 重新赋权
        role.children = res.data
      },
      setRights(role) {
        // 保存当前选中用户(别的地方需要)
        this.currentRole = role
        // 先清空当前数组里的三级权限id
        this.defKeys.splice(0)
        // 循环取出选中角色三级权限id
        this.getRoleRights(role, this.defKeys)
        this.setRightsDialogShow = true
      },
      getRoleRights(role, arr) {
        if(!role.children) {
          return arr.push(role.id)
        }
        role.children.forEach(item => this.getRoleRights(item, arr))
      },
      async allowSetRights() {
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const idStr = keys.join(',')
        const {data: res} = await this.$http.post(`roles/${this.currentRole.id}/rights`, {rids: idStr})
        if(res.meta.status !== 200) return this.$message.console.error('设置权限失败，服务器错误');
        // 获取成功,刷新视图
        this.$message.success('设置权限成功')
        this.getRolesList()
        this.setRightsDialogShow = false
      },
      setRightsDialogClose() {
        this.$refs.treeRef.setCheckedKeys([])
      },
      // 添加角色相关方法
      addRole() {
        this.addRoleDialogShow = true
      },
      saveRole() {
        this.$refs.addRoleFormRef.validate(async valid => {
          if(!valid) return 

          const {data: res} = await this.$http.post('roles', {

          })
          if(res.meta.status !== 201) return this.$message.error('添加失败，服务器端错误')

          this.$message.success('添加成功')
          this.addRoleDialogShow = false
          this.getRolesList()
        })
      },
      addRoleDialogClose() {
        this.$refs.addRoleFormRef.resetFields()
      }


    }
  }
</script>

<style scoped>
  .btop {
    border-top: 1px solid #eee;
  }
  .bbottom {
    border-bottom: 1px solid #eee;
  }
  .tagmargin {
    margin: 1rem 5px;
  }
  .center {
    display: flex;
    align-items: center;
  }
</style>