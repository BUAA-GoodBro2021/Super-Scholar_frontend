<template>
    <span :class="{'red-point': unRead}">{{$t("header.message")}}</span>
</template>
<script setup>
import { onMounted } from "vue";
import { Message } from "../../api/message.js";
import { useGlobalStore } from "../../stores/global";
const globalStore = useGlobalStore();
const unRead  = ref(false);
let interVal = null;
const getUnread = ()=>{
    Message.lookUnreadMsgCount({}).then((res)=>{
        unRead.value = res.data.unread_message_count > 0; 
    }).catch((err)=>{
        console.log(err);
    })
}
onMounted(
    ()=>{
        if(globalStore.isAuth){
            interVal = setInterval(getUnread,5000)
        }
    }
);
beforeUnmount(()=>{
        clearInterval(interVal);
    }
) 
before
</script>
<style>
.red-point{
    position: relative;
}
.red-point::before{
    content: "";
    border: 3px solid red;
    border-radius:3px;
    position: absolute;
    z-index: 1000;
    right: 0%;
    margin-right: -5px;
}
</style>