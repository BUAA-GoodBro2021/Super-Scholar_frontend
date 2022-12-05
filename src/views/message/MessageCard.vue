<template>
    <el-card class="msgCard">
        <div class="title">
            <h3 class="title-user">
                {{ props.msg.send_name }}
            </h3>
            <el-button class="title-btn" type="danger" :icon="Delete" @click="handleDelete" circle />
        </div>
        <div class="content">
            <span v-if="props.msg.message_type==2">
                拒绝了您为<a>{{props.msg.work_name}}</a>上传的
                <a :href="props.msg.url" target="_blank">
                    {{props.msg.pdf}}
                </a>
            </span>
            <span v-else-if="props.msg.message_type==3">
                通过了您为<a>{{props.msg.work_name}}</a>上传的
                <a :href="props.msg.url" target="_blank">
                    {{props.msg.pdf}}
                </a>
            </span>
            <span v-else-if="props.msg.message_type==4">
                在{{props.msg.work_open_alex_id}}下回复{{props.msg.reply}}
            </span>
            <span v-else>{{ props.msg.msg }}</span>
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
a{
    text-decoration: none;
}
.msgCard {
    margin: 1rem;
    .title::before {
        content: "";
        width: 5px;
        height:2rem;
        position: absolute;
        top: 0;
        left: 0;
        background: gray;
    }
    .title {
        padding-bottom: 1rem;
        border-bottom: solid 1px #eeeeee;
        position: relative;
        .title-user {
            font-size: large;
            font-weight: 800;
            line-height: normal;
            margin-left: 0.8rem;
        }
        .title-btn {
            position: absolute;
            right: 1vw;
            margin-top: -1.5rem;
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