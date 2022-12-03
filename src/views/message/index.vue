<template>
   <template v-for="(item,index) in messageList" :key="item.id">
      {{item}}<br/>
   </template>
</template>
<script setup>
import { ElNotification } from "element-plus";
import {Message} from "../../api/message";
const messageList = ref([]);
onMounted(() => {
   Message.lookMsgList({}).then((res)=>{
      messageList.value = res.data.message_list;
      ElNotification({
         message: res.data.message,
         type: "success",
         duration: 3000
      });
   })
})
</script>
<style>
</style>