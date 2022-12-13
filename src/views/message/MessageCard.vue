<template>
    <el-card class="msgCard">
        <div class="title">
            <h3 class="title-user" :class="{ active: isActive }">
                {{ props.msg.send_name }}
            </h3>
            <el-button class="title-btn" type="danger" :icon="Delete" @click="handleDelete" circle />
        </div>
        <div class="content" :class="{ active: isActive }">
            <span v-if="props.msg.message_type == 2" >
                拒绝了您为<router-link :to="'/client/paper/'+props.msg.work_open_alex_id">{{ props.msg.work_name }}</router-link>上传的
                <a :href="props.msg.url" target="_blank">
                    {{ props.msg.pdf }}
                </a>
            </span>
            <span v-else-if="props.msg.message_type == 3">
                通过了您为<router-link :to="'/client/paper/'+props.msg.work_open_alex_id">{{ props.msg.work_name }}</router-link>上传的
                <a :href="props.msg.url" target="_blank">
                    {{ props.msg.pdf }}
                </a>
            </span>
            <span v-else-if="props.msg.message_type == 4">
                在<router-link :to="'/client/paper/'+props.msg.work_open_alex_id">{{ props.msg.work_name }}</router-link>下回复{{ props.msg.reply }}
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
import { useDateFormat } from "@vueuse/core";
const props = defineProps(["msg"]);
const emit = defineEmits(["reload"]);
const isActive = ref(false);
const formatted = useDateFormat(props.msg.send_time, "YYYY-MM-DD HH:mm:ss");
const handleDelete = () => {
    isActive.value = !isActive.value;
    emit('reload',isActive.value,props.msg.id);
}
</script>
<style lang="scss" scoped>
a {
    text-decoration: none;
    color: black;
}

.active {
    text-decoration: line-through;
}
.el-card{
    background-color: #f0f0f0;
}
.msgCard {
    margin: 1rem;
    .title::before {
        content: "";
        width: 5px;
        height: 2rem;
        position: absolute;
        top: 0;
        left: 0;
        background: black;
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

        .title-btn-check {
            position: absolute;
            right: 2vw;
            margin-top: -1.5rem;
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