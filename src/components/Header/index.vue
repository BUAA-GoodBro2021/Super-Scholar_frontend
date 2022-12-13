<template>
    <div class="header">
        <div class="left">
            <router-link to="/" class="link">
                <img src="/icon1.png" class="logo" />
            </router-link>
            <router-link to="/advance-search-detail" class="link">
                <span >高级检索</span>
            </router-link>
        </div>
        <div class="avatar">
            <UserInfo v-if="globalStore.isAuth"/>
        </div>
    </div>
</template>
<script setup>
import UserInfo from "./UserInfo.vue";
import { useWindowScroll, useWindowSize } from '@vueuse/core';
import { useRoute } from "vue-router";
import {useGlobalStore} from "../../stores/global";
const globalStore = useGlobalStore();
const route = useRoute();
const { x, y } = useWindowScroll();
const { width, height } = useWindowSize();
const checkRouteName = ()=>{
    return route.name==="Welcome"|| route.name==="Login" || route.name==="Register";
}
const headerColor = checkRouteName() ? ref("#040d21") : ref("white");
const fontColor = checkRouteName() ? ref("white") : ref("black");
watch(y,(y)=>{
    if(y <= height.value-64 && route.name==="Welcome"){
        headerColor.value = "#040d21";
        fontColor.value = "white";
    }else{
        headerColor.value = "white";
        fontColor.value = "black";
    }
})
onMounted(()=>{
})

</script>
<style lang="scss" scoped>
.header {
    background-color: v-bind(headerColor);
    text-align: center;
    width: 100%;
    position: fixed;
    display: flex;
    justify-content: space-between;
    z-index: 1145;
    .left {
        margin-left: 2vw;
        line-height: 64px;
        display: flex;
        .link {
        font-size: 16px;
        font-weight: 600;
        text-decoration: none;
        color: v-bind(fontColor);
        margin-left: 3vw;
        }
        .logo {
        margin-top: 4px;
        width: 120px;
        height: 60px;
        }
    }
    .avatar {
        margin-top: 1vh;
        margin-right: 10vw;
    }
}
</style>