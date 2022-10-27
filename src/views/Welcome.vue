<template>
   Welcome.vue
</template>
<script setup>
import { Account } from '../api/account';
Account.login({
    "username": "111",
    "password": "111"
})
</script>
<style>
</style>