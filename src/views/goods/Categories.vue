<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <!-- 添加按钮 -->
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格视图区域 -->
      <tree-table
        class="tree-table"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false">
        <!-- 是否有效列 -->
        <template #isok="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <!-- 排序列 -->
        <template #order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag size="mini" v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作列 -->
        <template #opt="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
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

    <!-- 添加角色对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="addCateDialogShow"
      width="50%"
      @close="addCateDialogClose">
      <!-- 对话框主体内容区域 -->
      <el-form
        :model="cateInfo" 
        :rules="addCateFormRules" 
        ref="addCateFormRef" 
        label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="cateInfo.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProp"
            @change="selectedKeysChange"
            clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <!-- 对话框底部按钮区域 -->
      <span slot="footer">
        <el-button @click="addCateDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="saveCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Categories',
    data() {
      return {
        // 页面相关数据
        cateList: [],
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        total: 0,
        columns: [
          {
            label: '分类名称',
            prop: 'cat_name'
          },
          {
            label: '是否有效',
            type: 'template',
            template: 'isok'
          },
          {
            label: '排序',
            type: 'template',
            template: 'order'
          },
          {
            label: '操作',
            type: 'template',
            template: 'opt'
          },
        ],
        // 添加角色相关属性
        addCateDialogShow: false,
        parentCateList: [],
        cateInfo: {
          cat_name: '',
          cat_id: 0,
          cat_level: 0
        },
        addCateFormRules: {
          cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ]
        },
        cascaderProp: { 
          expandTrigger: 'hover' ,
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
          checkStrictly: true
        },
        selectedKeys: []
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      async getCateList() {
        const { data: res } = await this.$http.get('categories', { 
          params: this.queryInfo 
        })
        if(res.meta.status !== 200) 
          return this.$message.error("获取商品分类失败，服务器错误")
        
        this.cateList = res.data.result
        this.total = res.data.total
        console.log(res.data)
      },
      // 分页相关
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getCateList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getCateList()
      },
      // 添加相关
      async addCate() {
        // 获取父级分类列表
        const {data: res} = await this.$http.get('categories', { 
          params: { type: 2 }
        })
        if(res.meta.status !== 200) 
          return this.$message.error('获取父级分类列表失败，服务器端错误')

        this.parentCateList = res.data
        this.addCateDialogShow = true
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
      async saveCate() {
        this.$refs.addCateFormRef.validate(async valid => {
          if(!valid) return 

          const {data: res} = await this.$http.post('categories', this.cateInfo)
          if(res.meta.status !== 201) return this.$message.error('添加失败，服务器端错误')

          console.log(res)
          this.$message.success('添加成功')
          this.addCateDialogShow = false
          this.getCateList()
        })
      }, 
      addCateDialogClose() {
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys.splice(0)
        this.cateInfo.cat_id = 0
        this.cateInfo.cat_level = 0
      },




    }
  }
</script>

<style scoped>
  .tree-table {
    margin-top: 1rem;
  }
  .el-cascader {
    width: 100%;
  }
</style>