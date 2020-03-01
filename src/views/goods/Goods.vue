<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row>
        <!-- 搜索 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容" 
            v-model="queryInfo.query" 
            clearable 
            @clear="getGoodList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加 -->
        <el-col :span="16">
          <el-button type="primary" @click="addGood">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格视图区域 -->
      <el-table
        :data="goodList"
        stripe
        border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column width="500" label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column width="120" label="商品价格（元）" prop="goods_price"></el-table-column>
        <el-table-column width="120" label="商品数量" prop="goods_number"></el-table-column>
        <el-table-column width="100" label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column width="150" label="创建时间">
          <template #default="scope">
            {{scope.row.add_time | formatDate}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="modifyGood(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGood(scope.row)"></el-button>
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

    <!-- 修改用户对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="modifyDdialogShow"
      width="50%"
      @close="modifyDialogFormInit">
      <!-- 对话框主体内容区域 -->
      <el-form
        :model="modifyDdialogForm"
        :rules="dialogFormRules" 
        ref="modifyDialogFormRef" 
        label-width="100px">
        <el-form-item label="商品名称">
          <el-input v-model="modifyDdialogForm.goods_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="商品价格（元）" prop="goods_price">
          <el-input v-model="modifyDdialogForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="modifyDdialogForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="modifyDdialogForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDdialogShow = false">取 消</el-button>
        <el-button type="primary" @click="saveModifyGood">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Goods',
    data() {
      return {
        // 页面相关
        goodList: [],
        total: 0,
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 5
        },
        // 添加相关
        addDialogShow: false,
        addDialogForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        // 修改相关
        modifyDdialogShow: false,
        modifyDdialogForm: {},
        // 表单验证规则
        dialogFormRules: {
          goods_price: [
            { required: true, message: '请输入商品价格（元）', trigger: 'blur' }
          ],
          goods_weight: [
            { required: true, message: '请输入商品重量', trigger: 'blur' }
          ],
          goods_name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' }
          ]
        },
      }
    },
    created() {
      this.getGoodList()
    },
    methods: {
      async getGoodList() {
        const { data: res } = await this.$http.get('goods', { 
          params: this.queryInfo 
        })
        console.log(res)
        
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        
        this.goodList = res.data.goods
        this.total = res.data.total
      },
      // 分页相关
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getGoodList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getGoodList()
      },
      // 添加相关
      addGood() {
        this.$router.push('/add')
      },
      // 修改相关
      modifyGood(goodInfo) {
        this.modifyDdialogShow = true
        this.modifyDdialogForm = goodInfo
      },
      saveModifyGood() {
        this.$refs.modifyDialogFormRef.validate(async valid => {
          if(!valid) return 

          const {data: res} = await this.$http.put('goods/' + this.modifyDdialogForm.goods_id, {
            goods_name: this.modifyDdialogForm.goods_name,
            goods_price: this.modifyDdialogForm.goods_price,
            goods_number: this.modifyDdialogForm.goods_number,
            goods_weight: this.modifyDdialogForm.goods_weight,
            goods_id: this.modifyDdialogForm.goods_id
          })
          console.log(res)
          if(res.meta.status !== 200) return this.$message.error('修改失败，服务器端错误')

          this.modifyDdialog = false
          this.$message.success('修改成功')
          this.getGoodList()
        })
      },
      modifyDialogFormInit() {
        this.$refs.modifyDialogFormRef.resetFields()
      },
      // 删除相关
      async deleteGood(goodInfo) {
        const confirmResult = await this.$confirm(`此操作将永久删除商品：${goodInfo.goods_name}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // 用户点击了取消
        if(confirmResult !== 'confirm') return this.$message.info('已取消删除')
        // 用户点击了确认，发起请求删除用户数据
        const {data: res} = await this.$http.delete('goods/' + goodInfo.goods_id)
        if(res.meta.status !== 200) return this.$message.error('商品删除失败，服务器端错误')
        this.$message.success('删除成功');
        this.getGoodList()
      },
    },
    filters: {
      formatDate(originVal) { 
        const dt = new Date(originVal)

        var year=dt.getFullYear(); 
        var month=dt.getMonth()+1; 
        var date=dt.getDate(); 
        var hour=dt.getHours(); 
        var minute=dt.getMinutes(); 
        var second=dt.getSeconds(); 
        return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
      } 
    }
  }
</script>

<style scoped>
  div {
    font-size: 0.8rem;
  }
  .el-table {
    margin-top: 1rem;
  }
  .el-pagination {
    margin-top: 1rem;
  }
</style>