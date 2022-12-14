<template>
    <span v-if="!globalStore.isAuth">
        <el-button class="login-btn" @click="login" style="margin-top:0.5rem">登录</el-button>
    </span>
    <el-dropdown v-else>
        <span v-if="showName" style="margin-top:1rem;font-size: large;">
            {{ globalStore.userInfo.username }}
        </span>
        <span v-else>
            <el-avatar :size="45" :src="circleUrl"></el-avatar>
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
                    <span class="dropdown-text">
                        <Message />
                    </span>
                </el-dropdown-item>
                <el-dropdown-item class="dropdown-item" :icon="Promotion" @click="toChat">
                    <span class="dropdown-text">学术助手</span>
                </el-dropdown-item>
                <el-dropdown-item class="dropdown-item" :icon="SwitchButton" @click="logout">
                    <span class="dropdown-text">{{ $t("header.action1") }}</span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>
<script setup>
import { Check, More, Notification, Star, SwitchButton, User, Promotion } from '@element-plus/icons-vue'
import { useWindowScroll, useWindowSize } from '@vueuse/core';
import { useRoute } from "vue-router";
import Message from './Message.vue';
import { useGlobalStore } from '../../stores/global.js';
import { watch } from 'vue';
const route = useRoute();
const { x, y } = useWindowScroll();
const { width, height } = useWindowSize();
const globalStore = useGlobalStore();
const router = useRouter();
const circleUrl = globalStore.userInfo?.avatar_url || "";
const showName = ref(false);
watch(y, (y) => {
    if (y <= height.value - 64 && route.name === "Welcome") {
        showName.value = true;
    } else {
        showName.value = false;
    }
}, {
    immediate: true,
})
const showPopper = computed(() => {
    return globalStore.isAuth ? "" : "none";
})
const logout = () => {
    globalStore.logout();
    router.push({ name: "Login" });
}
const login = () => {
    router.push({ name: "Login" });
}
const checkMessage = () => {
    router.push({ name: "MessageList" });
}
const toPerconalAccount = () => {
    router.push({ name: "PersonalDetail" });
}
const toCollection = () => {
    router.push({ name: "Collection" });
}
const toClaimPortal = () => {
    router.push({ name: "ClaimPortal" });
}
const toChat = () => {
    router.push({ name: "Chat" });
}
const toFollowList = () => {
    router.push({ name: "FollowList" });
}
</script>
<style lang="scss">
.dropdown {
    width: 10vw;
}

.dropdown-item {
    height: 3rem;
}

.dropdown-text {
    margin-left: 1vw;
}

@media screen and (max-width:1175px) {
    .dropdown-text {
        display: none;
    }

    .dropdown-item {
        .el-icon {
            margin: 0 auto;
        }
    }
}

.login-btn {
    background-color: transparent;
    border: none;
}

// .el-button:hover {
//     background-color: transparent;
// }
</style>