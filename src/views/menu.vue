<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-menu class="head" mode="horizontal" :ellipsis="false" @select="handleSelect">
          <div class="title">面壁计划</div>
          <div class="flex-grow" />
          <el-sub-menu index="1">
            <template #title>消息</template>
            <el-menu-item index="1-1">对话</el-menu-item>
            <el-menu-item index="1-2">系统消息</el-menu-item>
            <el-menu-item index="1-3">设置</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-avatar :size='30' :src="avatar"></el-avatar>
              <div class="top-name">张三</div>
            </template>
            <el-menu-item index="2-1">个人主页</el-menu-item>
            <el-menu-item index="2-2">设置</el-menu-item>
            <el-menu-item index="2-3">退出</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-header>

      <el-container>
        <el-aside width="200px">
          <el-row class="tac">
            <el-col>
              <el-menu router :default-active="activeActive" class="el-menu-vertical-demo">
                <el-menu-item index="1">
                  <el-icon>
                    <icon-menu />
                  </el-icon>
                  <span>首页</span>
                </el-menu-item>
                <el-sub-menu index="2">
                  <template #title>
                    <el-icon>
                      <location />
                    </el-icon>
                    <span>面壁者</span>
                  </template>
                  <el-menu-item index="/menu/list">面壁者列表</el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="3">
                  <template #title>
                    <el-icon>
                      <location />
                    </el-icon>
                    <span>题库</span>
                  </template>
                  <el-menu-item index="3-1">题目管理</el-menu-item>
                  <el-menu-item index="3-2">答题</el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="4">
                  <template #title>
                    <el-icon>
                      <location />
                    </el-icon>
                    <span>教学工具</span>
                  </template>
                  <el-menu-item index="/menu/Canvas">白板(原生js)</el-menu-item>
                  <el-menu-item index="/menu/canvas1">白板(fabric)</el-menu-item>
                  <el-menu-item index="/menu/note">笔记</el-menu-item>
                </el-sub-menu>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import 'element-plus/es/components/message-box/style/css'
import avatar from '../assets/1.webp'

export default {
  data() {
    return {
      avatar,
      value1: '',
    }
  },
  methods: {
    handleSelect(items) {
      this.de = items
    }
  },
  computed: {
    activeActive() {
      return this.$route.path
    },
  }
}
</script>

<style scoped>
.common-layout {
  height: 100vh;
  width: 100vw;
}

.head {
  justify-content: space-between;
}

.title {
  font-size: larger;
  line-height: 58px;
}

.flex-grow {
  flex-grow: 1;
}

.top-name {
  margin: 5px;
}
</style>