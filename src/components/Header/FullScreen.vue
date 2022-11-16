<template>
<span @click="toggle">
   <template v-if="isFullscreen">
      <el-tooltip :content="$t('header.exitFullScreen')">
         <svg t="1668443958435" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8117" width="200" height="200"><path d="M298.666667 631.466667H226.133333v-81.066667h217.6v204.8h-85.333333v-68.266667l-128 128L170.666667 759.466667l128-128z m422.4 0l128 128-59.733334 59.733333-128-128v68.266667h-85.333333V554.666667h217.6v81.066666h-72.533333zM298.666667 341.333333L187.733333 230.4 243.2 170.666667l115.2 115.2V217.6h85.333333v204.8H226.133333V341.333333H298.666667z m430.933333 0h64v81.066667h-217.6V217.6h85.333333v72.533333L780.8 170.666667l59.733333 59.733333L729.6 341.333333z" fill="#444444" p-id="8118"></path></svg>
      </el-tooltip>
   </template>
   <template v-else>
      <el-tooltip :content="$t('header.fullScreen')">
         <svg t="1668443945321" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7978" width="200" height="200"><path d="M358.4 768H426.666667v85.333333H213.333333v-213.333333h85.333334v68.266667l128-128 59.733333 59.733333-128 128z m345.6 0l-128-128 59.733333-59.733333 132.266667 132.266666V640h85.333333v213.333333h-213.333333v-85.333333h64zM358.4 298.666667l128 128-59.733333 59.733333-128-128V426.666667H213.333333V213.333333h213.333334v85.333334H358.4z m345.6 0H640V213.333333h213.333333v213.333334h-85.333333V354.133333l-132.266667 132.266667-59.733333-59.733333 128-128z" fill="#444444" p-id="7979"></path></svg>
      </el-tooltip>
   </template>
</span>
</template>
<script setup>
import { useFullscreen } from '@vueuse/core'
const { isFullscreen, toggle } = useFullscreen();
</script>
<style scoped>
.icon{
   width: 40px;
   height: 40px;
   margin-top: 10px;
   margin-left: 10px;
}
</style>