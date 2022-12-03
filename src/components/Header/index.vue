<template>
    <div class="header">
        <div class="left">
            <router-link to="/" class="link">
                <img src="/icon.png" class="logo" />
            </router-link>
            <router-link to="/" class="link">
                <span>高级检索</span>
            </router-link>
        </div>
        <div class="avatar">
            <UserInfo />
        </div>
    </div>
</template>
<script setup>
import UserInfo from "./UserInfo.vue";
import { useDark, useToggle } from '@vueuse/core';
const isDark = useDark();
const onDarkChange = useToggle(isDark);
onMounted(()=>{
    if(isDark.value){
        onDarkChange();
    }
})

</script>
<style lang="scss" scoped>
.header {
    background-color: white;
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