<template>
    <div class="header">
        <el-row :gutter="20">
            <el-col :span="14" class="left">
                <img src="/icon.png" class="logo" />
                <router-link to="/" class="link">
                    <span>高级检索</span>
                </router-link>
                <router-link to="/" class="link">
                    <span>搜索学者</span>
                </router-link>
            </el-col>
            
            <el-col :span="6">
                <UserInfo class="avatar"/>
                <Language  class="langswitch"/>
                <FullScreen  class="fullscreenswitch"/>
            </el-col>
        </el-row>
    </div>
</template>
<script setup>

import Language from './Language.vue';
import FullScreen from "./FullScreen.vue";
import Dark from "./Dark.vue";
import UserInfo from "./UserInfo.vue";
import { useDark } from '@vueuse/core';
const isDark = useDark();
const linkColor = computed(()=>{
    return isDark.value ? "#dadada":"black";
})


</script>
<style scoped>
.header {
    background-color: white;
    text-align: center;
    width: 100%;
    position: fixed;
    z-index: 1145;
}

.logo {
    margin-left: 40px;
    width: 120px;
    height: 64px;
}

.left {
    line-height: 64px;
    display: flex;
}

.link {
    font-size: 16px;
    font-weight: 600;
    text-decoration: none;
    text-align: center;
    color: v-bind(linkColor);
    margin-left: 10px;
}

.avatar {
    position: absolute;
    margin-top: 10px;
    margin-right: 20px;
    right: 180px;
}

.langswitch{
    position: absolute;
    right: 20px;
}
.fullscreenswitch{
    position: absolute;
    right: 80px;
}
</style>