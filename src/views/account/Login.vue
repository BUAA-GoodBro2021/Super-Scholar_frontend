<template>
   Login.vue
</template>
<script setup>
import {Account} from "../../api/account";
import {useGlobalStore} from "../../stores/global";
const globalStore = useGlobalStore();
Account.login({
    "username": "111",
    "password": "111"
}).then(res=>{
   globalStore.setToken(res.data.token);
   globalStore.setUserInfo(res.data.user);
})
</script>
<style>
</style>