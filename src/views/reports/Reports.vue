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
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import _ from 'lodash'
  export default {
    data() {
      return {
        // 指定图表的配置项和数据
        option: {
          title: {
              text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#e9eef3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
      }
    },
    async mounted() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'));

      // 获取报表数据
      const {data: res} = await this.$http.get('reports/type/1')
      if(res.meta.status !== 200) return this.$message.error('获取报表数据失败，服务器错误');
      // 获取成功
      const result = _.merge(res.data, this.option)
      console.log(res.data)

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(result);
    },
    methods: {
      
    }
  }
</script>

<style scoped>

</style>