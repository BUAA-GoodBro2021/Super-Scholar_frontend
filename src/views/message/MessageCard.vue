<template>
    <el-card class="msgCard">
        <div class="title">
            <span class="title-user">{{ props.msg.send_name }}</span>
            <el-button class="title-btn" type="danger" :icon="Delete" @click="handleDelete" circle />
        </div>
        <div class="content">
            <span>{{ props.msg.msg }}</span>
            <span v-if="props.msg.message_type==4">在{{props.msg.work_open_alex_id}}下回复{{props.msg.reply}}</span>
            <span class="content-date">{{ formatted }}</span>
        </div>
        <div>
        </div>
    </el-card>
</template>
<script setup>
import { Delete } from "@element-plus/icons-vue";
import { Message } from "../../api/message";
import { useDateFormat } from "@vueuse/core";
import { ElMessageBox } from "element-plus";
const props = defineProps(["msg"]);
const emit = defineEmits(["reload"]);
const formatted = useDateFormat(props.msg.send_time, "YYYY-MM-DD HH:mm:ss");
const handleDelete = () => {
    ElMessageBox.confirm(
        "您确定删除这条消息么?",
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(
        ()=>{
            Message.delMsg({ message_id: props.msg.id })
        .then((res) => {
            console.log(res.data);
            emit("reload");
        })}
    ).catch((err)=>{

    })

}
</script>
<style lang="scss" scoped>
.msgCard {
    margin: 1rem;

    .title {
        padding-bottom: 1rem;
        border-bottom: solid 1px #eeeeee;

        .title-user {
            font-size: large;
            font-weight: 900;
        }

        .title-btn {
            float: right;
            margin-top: -.5rem;
        }
    }

    .content {
        padding-top: 1rem;

        &-date {
            float: right;
            color: grey;
            font-size: small;
        }
    }
}
</style>