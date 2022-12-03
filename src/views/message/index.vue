<template>
   <div class="chat">
      <div class="chat-left">
         <el-menu default-active="1" @select="handleSelect">
            <el-menu-item index="1">
               <el-icon>
                  <icon-menu />
               </el-icon>
               <template #title>系统消息</template>
            </el-menu-item>
            <el-menu-item index="2">
               <el-icon>
                  <document />
               </el-icon>
               <template #title>用户消息</template>
            </el-menu-item>
         </el-menu>
      </div>
      <div class="chat-right">
         <div class="chat-content">
            <template v-if="curKey == 1">
               <MessageCard 
                  v-for="(item,index) in systemList"
                  @reload="getList"
                  :key="index"
                  :msg="item">
               </MessageCard>
            </template>
            <template v-else>
               <MessageCard 
                  v-for="(item,index) in userList"
                  @reload="getList"
                  :key="index"
                  :msg="item">
               </MessageCard>
            </template>
            {{systemList}}
            {{userList}}
         </div>
      </div>
   </div>
</template>
<script setup>
import { ElNotification } from "element-plus";
import { Message } from "../../api/message";
import MessageCard from "./MessageCard.vue";
import {
   Document,
   Menu as IconMenu,
} from '@element-plus/icons-vue'
const curKey = ref(1);
const handleSelect = (key, keyPath) => {
   console.log(key, keyPath);
   curKey.value = key;
}
const systemList = ref([]);
const userList = ref([]);
const getList = ()=>{
   Message.lookMsgList({}).then((res) => {
      console.log("RES", res.data);
      systemList.value.length = 0;
      userList.value.length = 0;
      res.data.message_list.forEach((item)=>{
         console.log(item,"1");
         switch (item.message_type) {
            case -1:
               item.msg = "管理员解除了您的门户";
               systemList.value.push(item);
               break;
            case 0:
               item.msg = "管理员拒绝了您的门户申请";
               systemList.value.push(item);
               break;
            case 1:
               item.msg = "管理员通过了您的门户申请";
               systemList.value.push(item);
               break;
            case 2:
               item.msg = "管理员拒绝了您的pdf上传申请";
               systemList.value.push(item);
               break;
            case 3:
               item.msg = "管理员通过了您的pdf上传申请";
               systemList.value.push(item);
               break;
            case 4:
               userList.value.push(item);
               break;
            case 5:
               item.msg = "恭喜您，您已成功注册";
               systemList.value.push(item);
               break;
            case 6:
               item.msg = "请注意，您已成功修改密码";
               systemList.value.push(items);
               break;
         }
      })
      ElNotification({
         message: res.data.message,
         type: "success",
         duration: 3000
      });
   })
}
onMounted(() => {
   getList();
})
</script>
<style lang="scss" scoped>
.chat {
   display: flex;
   position: relative;
   top:5vh;
   width: 80vw;
   margin: 0 auto;
   height: 80vh;
   max-height: 90vh;
   overflow: hidden;
   background-color: white;
   border-radius: 20px;
   box-shadow: 3px 3px 3px 3px #dedede;

   &-left {
      width: 20vw;
      background-color: white;
   }

   &-right {
      flex: 1;
      border-left: solid 1px var(--el-menu-border-color);
      .chat-content{
         padding: 2rem;
      }
   }
}

:deep(.el-menu) {
   border-right: none;
}
</style>