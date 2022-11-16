<template>
    <el-switch 
        v-model="isDark" 
        @change="onDarkChange" 
        inline-prompt 
        active-color="#0a0a0a" 
        inactive-color="#dcdfe6"
        :active-icon="Sunny" 
        :inactive-icon="Moon" 
    />
</template>
<script setup>
import{ Sunny,Moon } from '@element-plus/icons-vue';
import { useDark, useToggle } from '@vueuse/core';
// 明暗切换
const isDark = useDark();
const onDarkChange = useToggle(isDark);
</script>
<style scoped>

</style>