<template>
    <div class="header">
        <el-row :gutter="20">
            <el-col :span="6" class="left">
                <img src="/icon.png" class="logo" />
                <router-link to="/" class="link">
                    <span>高级检索</span>
                </router-link>
                <router-link to="/" class="link">
                    <span>搜索学者</span>
                </router-link>
            </el-col>
            <el-col :span="3" :offset="12" class="avatar">
                <UserInfo/>
            </el-col>
            <el-col :span="3">
                <Language />
                <FullScreen />
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
    /* 不是这两条也能不加的啊 */
    top: 0;
    left: 0;
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
    margin-top: 10px;
}
</style>