<template>
   <el-dropdown>
        <span>
            <template v-if="globalStore.isAuth">
                <el-avatar :size="45" :src="circleUrl"></el-avatar>
            </template>
            <template v-else>
                <el-button type="info" @click="login">登录</el-button>
            </template>
        </span>
        <template #dropdown>
            <el-dropdown-menu class="dropdown">
                <el-dropdown-item class="dropdown-item" :icon="More" @click="checkMessage">
                    <span class="dropdown-text">个人详情</span>
                </el-dropdown-item>
                <el-dropdown-item class="dropdown-item" :icon="Check" @click="checkMessage">
                    <span class="dropdown-text">认领门户</span>
                </el-dropdown-item>
                <el-dropdown-item class="dropdown-item" :icon="Star" @click="checkMessage">
                    <span class="dropdown-text">收藏夹</span>
                </el-dropdown-item>
                <el-dropdown-item class="dropdown-item" :icon="Notification" @click="checkMessage">
                    <span class="dropdown-text"><Message/></span>
                </el-dropdown-item>
                <el-dropdown-item class="dropdown-item" :icon="SwitchButton" @click="logout">
                    <span class="dropdown-text">{{$t("header.action1")}}</span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>
<script setup>
import { Check, More, Notification, Star, SwitchButton } from '@element-plus/icons-vue'
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
const login = ()=>{
    router.push({name:"Login"});
}
const checkMessage = ()=>{
    router.push({name:"MessageList"});
}
</script>
<style lang="scss" >
.dropdown{
    width: 10vw;
}
.dropdown-item{
    height: 5vh;
}
.dropdown-text{
    margin-left: 1vw;
}
@media screen and (max-width:768px){
    .dropdown-text{
        display: none;
    }
    .dropdown-item{
        .el-icon{
            margin: 0 auto;
        }
    }
}
</style>