<template>
  <div class="client-main clearfix">
    <Header class="client-header" />
    <div class="client-body">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup>
import Header from "../../components/Header/index.vue"
</script>
<style>
.client-main {
  height: 100vh;
}
/* 清除外边距折叠和高度塌陷 */
.clearfix::before,
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}

.client-header {
  height: 64px;
  /* 4rem */
}

.client-body {
  margin-top: 64px;
  height: calc(100vh - 64px);
}
</style>