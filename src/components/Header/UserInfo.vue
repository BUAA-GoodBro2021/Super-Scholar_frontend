<template>
   <el-dropdown>
        <span>
            <el-avatar :size="45" :src="circleUrl"></el-avatar>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item :icon="Plus" @click="logout">
                    {{$t("header.action1")}}
                </el-dropdown-item>
                <el-dropdown-item>
                    <Dark/>
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>
<script setup>
import { Plus } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
import { useGlobalStore } from '../../stores/global';
const globalStore = useGlobalStore();
const router = useRouter();
const circleUrl = globalStore.userInfo.avatar_url;
const logout = ()=>{
    localStorage.clear();
    router.push({name:"Login"});
}
</script>
<style>
</style>