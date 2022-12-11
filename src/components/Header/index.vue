<template>
    <div class="header">
        <div class="left">
            <router-link to="/" class="link">
                <img src="/icon1.png" class="logo" />
                {{y}}
            </router-link>
        </div>
        <div class="avatar">
            <UserInfo/>
        </div>
    </div>
</template>
<script setup>
import UserInfo from "./UserInfo.vue";
import { useDark, useToggle, useWindowScroll, useWindowSize } from '@vueuse/core';
import { useRoute } from "vue-router";
const route = useRoute();
const { x, y } = useWindowScroll();
const { width, height } = useWindowSize();
const isDark = useDark();
const onDarkChange = useToggle(isDark);
const checkRouteName = ()=>{
    return route.name==="Welcome"|| route.name==="Login" || route.name==="Register";
}
const headerColor = checkRouteName() ? ref("#040d21") : ref("white");
watch(y,(y)=>{
    if(y <= height.value-64 && route.name==="Welcome"){
        headerColor.value = "#040d21";
    }else{
        headerColor.value = "white";
    }
})
onMounted(()=>{
    if(isDark.value){
        onDarkChange();
    }
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
        color: black;
        margin-left: 3vw;
        }
        .logo {
        width: 120px;
        height: 64px;
        }
    }
    .avatar {
        margin-top: 1vh;
        margin-right: 10vw;
    }
}
</style>