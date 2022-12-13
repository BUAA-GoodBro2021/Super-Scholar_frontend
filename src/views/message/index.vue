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
         <el-button class="del-btn" type="danger" @click="handleDelete">
            删除所选
            </el-button>
         <div class="chat-content">
            <template v-if="curKey == 1">
                  <MessageCard 
                     v-for="(item,index) in systemList"
                     @reload="updateCheckedList"
                     :key="item.id"
                     :msg="item">
                  </MessageCard>
               <div v-if="systemList.length===0">
                  暂无消息捏
               </div>
            </template>
            <template v-else>
                  <MessageCard 
                     v-for="(item,index) in userList"
                     @reload="updateCheckedList"
                     :key="item.id"
                     :msg="item">
                  </MessageCard>
               <div v-if="userList.length===0">
                  暂无消息捏
               </div>
            </template>
         </div>
      </div>
   </div>
</template>
<script setup>
import { Delete } from "@element-plus/icons-vue";
import { ElNotification, ElMessageBox } from "element-plus";
import { Message } from "../../api/message";
import MessageCard from "./MessageCard.vue";
import {
   Document,
   Menu as IconMenu,
} from '@element-plus/icons-vue'
const curKey = ref(1);
const handleSelect = (key, keyPath) => {
   curKey.value = key;
   checkedList.value.length = 0;
}
const checkedList = ref([]);
watch(checkedList,(newVal)=>{
   console.log(newVal);
})
const updateCheckedList = (isDel,id)=>{
   if(isDel){
      checkedList.value.push(id);
   }else{
      let index = checkedList.value.indexOf(id);
      checkedList.value.splice(index,1);
   }
   console.log(checkedList.value);
}
const systemList = ref([]);
const userList = ref([]);
const getList = ()=>{
   checkedList.value.length = 0;
   Message.lookMsgList({}).then((res) => {
      console.log("RES", res.data);
      systemList.value.length = 0;
      userList.value.length = 0;
      res.data.message_list.forEach((item)=>{
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
               systemList.value.push(item);
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
const handleDelete = ()=>{
   ElMessageBox.confirm(
        "您确定删除选中消息么?",
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(
        ()=>{
         if(checkedList.value.length===0){
            ElNotification({
               title:"请检查",
               message: "您没有选中内容",
               type: "error",
               duration: 3000
            });
            return;
         }
         console.log("LIST",checkedList.value);
         Message.delMsg({ message_id_list: checkedList.value})
        .then((res) => {
            console.log(res.data);
            getList();
        }).catch((err)=>{
         console.log(err);
        })}
         ).catch((err)=>{
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

   background-color: white;
   border-radius: 2px;
   box-shadow: 3px 3px 3px 3px #dedede;

   &-left {
      width: 20vw;
      .el-menu{
         background-color: white;
      }
      .el-menu-item:hover{
         background-color: #f0f0f0;
      }
      .el-menu-item.is-active{
         color: #a28f2a;
      }
   }

   &-right {
      flex: 1;
      position: relative;
      overflow: auto;
      .del-btn{
               position: absolute;
               right:3rem;
               top: 1rem;
         }
      .chat-content{
         margin-top: 1rem;
         padding: 2rem;
         position: relative;
      }
   }
   /* 设置滚动条的样式 */
   /* ::-webkit-scrollbar 滚动条整体部分，可以设置宽度之类的 */
   &-right::-webkit-scrollbar {
   width: 8px;
   height: 8px;
   }
   /* ::-webkit-scrollbar-corner 边角 */
   &-right::-webkit-scrollbar-corner {
   background-color: initial;
   }
   /* ::-webkit-scrollbar-thumb 滚动条里面可以拖动的那个 */
   &-right::-webkit-scrollbar-thumb {
   background-color: transparent !important;
   border-radius: 10px;
   }
   /* ::-webkit-scrollbar-track 外层轨道 */
   &-right::-webkit-scrollbar-track {
   background-color: transparent !important;
   }
   @media (min-width: 1280px) {
      &-right::-webkit-scrollbar-thumb {
         background-color: #e4e4e7 !important;
      }
   }
}

:deep(.el-menu) {
   border-right: none;
}
</style>