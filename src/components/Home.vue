<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <img src="" alt="">
      <span>电商后台管理系统</span>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 主菜单 -->
        <el-menu 
          background-color="#333744" 
          text-color="#fff" 
          active-text-color="#409bff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false">
          <!-- 一级菜单 -->
          <el-submenu 
            v-for="(item, index) in menuList"
            :key="item.id"
            :index="item.id + ''">
            <template slot="title">
              <i :class="menuIcon[index]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              v-for="subItem in item.children"
              :key="subItem.id"
              :index="subItem.id + ''"
              @click="menuRouter(subItem.path)">
              <template slot="title">
                <i class="el-icon-message"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: 'Home',
    data() {
      return {
        menuList: [],
        menuIcon: [
          'iconfont icon-GroupCopy',
          'iconfont icon-lifangtilitiduomiantifangkuai',
          'iconfont icon-shangpin',
          'iconfont icon-dingdan',
          'iconfont icon-shujutongji'
        ],
        isCollapse: false
      }
    },
    created() {
      this.getMenuList()
    },
    methods: {
      logout() {
        // 清空token，返回login页面
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      async getMenuList() {
        const {data: res} = await this.$http.get('menus')
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.menuList = res.data
      },
      toggleCollapse() {
        this.isCollapse = !this.isCollapse
      },
      menuRouter(path) {
        this.$router.push('/' + path)
      }
    },
  }
</script>

<style scoped>
  .home-container {
    height: 100%;
  }
  .el-header {
    background-color: #373d41;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-aside {
    background-color: #333744;
  }
  .el-aside .toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .el-aside .el-menu {
    border-right: none;
  }
  .el-aside .iconfont {
    margin-right: 10px;
  }
  .el-main {
    background-color: #eaedf1;
  }
</style>