<template>
   <el-dropdown>
        <span>
            <el-avatar :size="45" :src="circleUrl"></el-avatar>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item :icon="Notification" @click="checkMessage">
                    <Message/>
                </el-dropdown-item>
                <el-dropdown-item :icon="Plus" @click="logout">
                    {{$t("header.action1")}}
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>
<script setup>
import { Notification, Plus } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
import  Message  from './Message.vue';
import { useGlobalStore } from '../../stores/global';
const globalStore = useGlobalStore();
const router = useRouter();
const circleUrl = globalStore.userInfo.avatar_url;
const logout = ()=>{
    localStorage.clear();
    router.push({name:"Login"});
}
const checkMessage = ()=>{
    router.push({name:"MessageList"});
}
</script>
<style>
</style>