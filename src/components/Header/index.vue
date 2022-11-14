<template>
    <div class="header">
    <el-row :gutter="20">
        <el-col :span="6" class="left">
            <img src="/icon.png" class="logo"/>
            <router-link to="/" class="link">
                <span>高级检索</span>
            </router-link>
            <router-link to="/" class="link">
                <span>搜索学者</span>
            </router-link>
        </el-col>
        <el-col :span="3" :offset="12" class="avatar">
                <el-dropdown>
                    <span>
                        <el-avatar :size="45" :src="circleUrl"></el-avatar>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item :icon="Plus">
                                Action 1
                            </el-dropdown-item>
                            <el-dropdown-item :icon="CirclePlusFilled">
                                Action 2
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <el-switch
                                v-model="isDark"
                                @change="onDarkChange"
                                inline-prompt
                                active-color="#0a0a0a"
                                inactive-color="#dcdfe6"
                                :active-icon="Sunny"
                                :inactive-icon="Moon"
                                />
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
        </el-col>
        <el-col :span="3">
            <el-dropdown>
                <Language />
                <template #dropdown>
                    <el-dropdown-item :icon="Plus">
                                中文
                    </el-dropdown-item>
                    <el-dropdown-item :icon="Plus">
                                English
                    </el-dropdown-item>
                </template>
            </el-dropdown>
            <FullScreen/>
        </el-col>
    </el-row>
    </div>
</template>
<script setup>
import {
  CirclePlusFilled,
  Plus,
  Sunny,
  Moon
} from '@element-plus/icons-vue'
import { useDark, useToggle} from '@vueuse/core';
import Language from './Language.vue';
import FullScreen from "./FullScreen.vue";
const circleUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
const isDark = useDark();
const linkColor = computed(()=>{
    return isDark.value ? "#dadada":"black";
});
const onDarkChange = useToggle(isDark);
</script>
<style scoped>
.header{
    margin: 0 5%;
    background-color: transparent;
    text-align: center;
}
.logo{
    width: 120px;
    height:64px;
}
.left{
    line-height: 64px;
    display: flex;
}
.link{
    font-size: 16px;
    font-weight: 600;
    text-decoration: none;
    text-align: center;
    color: v-bind(linkColor);
    margin-left: 10px;
}
.avatar{
    margin-top: 10px;
}
</style>