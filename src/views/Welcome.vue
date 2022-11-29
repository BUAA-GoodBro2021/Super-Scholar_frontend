<template>
   <div class="clearfix" style="height: 100vh;">
      <Header style="height: 64px;"/>
      <div class="client-body">
         这里是主页
      </div>
   </div>
</template>
<script setup>
import Header from "../components/Header/index.vue"
</script>
<style scoped>

.clearfix::before,
.clearfix::after{
   content: '';
   display: table;
   clear: both;
}

.client-body {
  margin-top: 64px;
  height: calc(100vh - 64px);
  border: 1px solid black;
  box-sizing: border-box;
}
</style>