<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <img src="../../assets/images/logo.png" alt=""/>
      <!-- 右侧的菜单 -->
      <el-menu
        class="el-menu-top"
        mode="horizontal"
        background-color="#23262E"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <img src="../../assets/images/logo.png" alt="" class="avatar"/>
            <span>个人中心</span>
          </template>
          <el-menu-item index="1-1"><i class="el-icon-s-operation"></i>基本资料</el-menu-item>
          <el-menu-item index="1-2"><i class="el-icon-camera"></i>更换头像</el-menu-item>
          <el-menu-item index="1-3"><i class="el-icon-key"></i>重置密码</el-menu-item>
        </el-submenu>
        <el-menu-item index="2" @click="quitFn"><i class="el-icon-switch-button"></i>退出</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <!--左侧边栏的用户信息 -->
      <el-aside width="200px">
        <div class="user-box">
          <img v-if="user_pic" :src="user_pic" alt=""/>
          <img v-else src="../../assets/images/github.png" alt=""/>
          <span>欢迎 {{ nickname || username }}</span>
        </div>
        <!--左侧导航栏-->
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#23262E"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          router
        >
          <!-- 不包含子菜单的“一级菜单” -->
          <template v-for="item in menus">
            <el-menu-item :index="item.indexPath" v-if="!item.children" :key="item.indexPath">
              <i :class="item.icon"></i>
              {{ item.title }}
            </el-menu-item>
            <!-- 包含子菜单的“一级菜单” -->
            <el-submenu :index="item.indexPath" :key="item.indexPath" v-else>
              <template slot="title">
                <i :class="item.icon"></i>
                <span> {{ item.title }}</span>
              </template>
              <el-menu-item :index="subItem.indexPath" v-for="subItem in item.children" :key="subItem.indexPath">
                <i :class="subItem.icon"></i>
                {{ subItem.title }}
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <!--二级路由挂载点-->
        <router-view>
        </router-view>
        <!-- 页面主体区域 -->
        <el-main>
        </el-main>
        <!-- 底部 footer 区域 -->
        <el-footer>
          <img src="../../assets/images/github.png" width="25">
          <a href="https://github.com/GoodLuckyed" target="_blank">
            GoodLuckyed
          </a>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

// 经验：在组件标签上绑定的所有事件（包括原生事件的名字c1ick，input等等）
// 都是自定义事件，都需要组件内$emit来触发才行
// 万一组件内不支持这个原生事件名字
// 解决：@事件名.native="methods里方法名”
// .native给组件内根标签，绑定这个原生的事件

<script>
import { mapGetters } from 'vuex'
import { getMenusAPI } from '@/api'

export default {
  name: 'my-layout',
  data () {
    return {
      menus: []
    }
  },
  computed: {
    ...mapGetters(['username', 'nickname', 'user_pic'])
  },
  methods: {
    quitFn () {
      this.$confirm('是否确认退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除vuex和本地的token值和用户信息
        this.$store.commit('updateToken', '')
        this.$store.commit('updataUserInfo', {})
        // 跳转到登录页面
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    async getMenusListFn () {
      // 获取侧边栏数据
      const { data: res } = await getMenusAPI()
      // console.log(res)
      this.menus = res.data
    }
  },
  created () {
    this.getMenusListFn().catch(error => {
      console.log(error)
    })
  }
}
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;

  .el-header,
  .el-aside {
    background-color: #23262e;
  }

  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }

  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #F2F2F2;
  }

  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}

// 左侧边栏用户信息区域
.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;

  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }

  span {
    color: white;
    font-size: 12px;
  }
}
</style>
