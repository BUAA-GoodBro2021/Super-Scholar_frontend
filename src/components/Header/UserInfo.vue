<template>
   <el-dropdown>
            <span v-if="globalStore.isAuth">
                <el-avatar :size="45" :src="circleUrl"></el-avatar>
            </span>
            <span v-else>
                <el-button type="info" @click="login" style="margin-top:0.5rem">登录</el-button>
            </span>
        <template #dropdown v-if="globalStore.isAuth">
            <el-dropdown-menu class="dropdown">
                <el-dropdown-item class="dropdown-item" :icon="More" @click="toPerconalAccount">
                    <span class="dropdown-text">个人详情</span>
                </el-dropdown-item>
                <el-dropdown-item class="dropdown-item" :icon="Check" @click="toClaimPortal">
                    <span class="dropdown-text">认领门户</span>
                </el-dropdown-item>
                <el-dropdown-item class="dropdown-item" :icon="Star" @click="toCollection">
                    <span class="dropdown-text">收藏夹</span>
                </el-dropdown-item>
                <el-dropdown-item class="dropdown-item" :icon="User" @click="toFollowList">
                    <span class="dropdown-text">关注列表</span>
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
import { Check, More, Notification, Star, SwitchButton, User } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
import  Message  from './Message.vue';
import { useGlobalStore } from '../../stores/global.js';

const globalStore = useGlobalStore();
const router = useRouter();
const circleUrl = globalStore.userInfo.avatar_url;
const logout = ()=>{
    globalStore.logout();
    router.push({name:"Login"});
}
const login = ()=>{
    router.push({name:"Login"});
}
const checkMessage = ()=>{
    router.push({name:"MessageList"});
}
const toPerconalAccount = () => {
    router.push({name:"PersonalDetail"});
}
const toCollection = () => {
    router.push({name:"Collection"});
}
const toClaimPortal = () => {
    router.push({name:"ClaimPortal"});
}
const toFollowList = () => {
    router.push({name:"FollowList"});
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
@media screen and (max-width:928px){
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