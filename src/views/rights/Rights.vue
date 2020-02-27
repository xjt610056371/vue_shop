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
      <!-- 表格视图区域 -->
      <el-table
        :data="rightsList"
        height="560"
        stripe
        border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级">
          <template #default="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Rights',
    data() {
      return {
        rightsList: []
      }
    },
    created() {
      this.getRightsList()
    },
    methods: {
      async getRightsList() {
        const {data: res} = await this.$http.get('rights/list')
        if(res.meta.status !== 200) return this.$message.console.error('获取权限列表失败，服务器错误');
        // 获取成功
        this.rightsList = res.data
      }
    }
  }
</script>

<style scoped>

</style>