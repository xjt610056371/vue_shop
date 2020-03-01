<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert
        title="注意！只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false">
      </el-alert>
      <!-- 级联选则商品分类 -->
      <el-row>
        <el-col>
          <span>请选择商品分类:</span>
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="cascaderProp"
            @change="selectedKeysChange"
            clearable>
          </el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页 -->
      <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isActive">添加参数</el-button>
          <!-- 表格视图区域 -->
          <el-table
            :data="manyTableData"
            stripe
            border>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template #default="scope">
                
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="roleName"></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isActive">添加参数</el-button>
          <!-- 表格视图区域 -->
          <el-table
            :data="onlyTableData"
            stripe
            border>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template #default="scope">
                
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="roleName"></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Categories',
    data() {
      return {
        // 页面相关数据
        cateList: [],
        cascaderProp: { 
          expandTrigger: 'hover' ,
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        selectedKeys: [],
        // 标签页相关
        activeTabName: 'many',
        manyTableData: [],
        onlyTableData: []
      }
    },
    computed: {
      isActive() {
        return this.selectedKeys.length ? false : true
      },
      currentId() {
        return this.selectedKeys[this.selectedKeys.length - 1]
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      async getCateList() {
        const { data: res } = await this.$http.get('categories')

        if(res.meta.status !== 200) 
          return this.$message.error("获取商品分类失败，服务器错误")
        
        this.cateList = res.data.result
      },
      selectedKeysChange() {
        if(this.selectedKeys.length > 0) {
          this.cateInfo.cat_id = this.selectedKeys[this.selectedKeys.length - 1]
          this.cateInfo.cat_level = this.selectedKeys.length
        } else {
          this.cateInfo.cat_id = 0
          this.cateInfo.cat_level = 0
        }
      },
      // 标签页相关
      async getTableData(type) {
        const { data: res } = await this.$http.get(`categories/${currentId}/attributes`, {
          params: { sel: this.activeTabName }
        })

        console.log(res)
        if(res.meta.status !== 200) 
          return this.$message.error("获取商品分类失败，服务器错误")
        
        this.cateList = res.data.result
      },
      handleTabClick() {

      }
    }
  }
</script>

<style scoped>
  .el-row {
    margin: 0.8rem 0;
  }
  span {
    padding-right: 1rem;
  }
</style>