<script setup lang="ts">
import { ref, provide } from 'vue'

// 提供主题颜色，可以在整个应用中统一使用
const themeColor = ref('#4f46e5')
provide('themeColor', themeColor)
</script>

<template>
  <div class="app-container">
    <!-- 页面切换动画 -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
/* 导入全局样式 */
@import './assets/main.css';

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 全局样式覆盖 */
:root {
  --el-color-primary: #4f46e5;
  --el-color-success: #10b981;
  --el-color-warning: #f59e0b;
  --el-color-danger: #ef4444;
  --el-color-info: #64748b;
}

/* 美化滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 卡片悬停效果 */
.el-card {
  transition: all 0.3s ease;
  border-radius: 12px;
}

.el-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.08);
}

/* 对话框美化 */
.el-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.el-dialog__header {
  background-color: #f8fafc;
  padding: 16px 20px;
}

.el-dialog__title {
  font-weight: 600;
  color: #334155;
}
</style>