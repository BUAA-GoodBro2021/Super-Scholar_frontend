<template>
    <div class="avatar_main_wrap">
        <div class="card_body">
            <ul>
                <li style="vertical-align: middle; ">
                    <el-avatar :size="200" :src="userInfo.avatar_url ? userInfo.avatar_url : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"  style="cursor: pointer">
                    </el-avatar>
                </li>
                <li>
                    <div class="title_profile">
                        <span class="name">{{
                                userInfo.display_name
                        }}</span>
                        <div class="organization">
                            <el-icon><HomeFilled /></el-icon> &nbsp;
                            {{ userInfo.last_known_institution ? userInfo.last_known_institution : '暂无机构信息' }}
                        </div>
                        <div class="areas" v-if="userInfo.x_concepts">
                            <el-icon><Menu /></el-icon> &nbsp;
                            <span style="cursor: pointer;" v-for="(item, index) in userInfo.x_concepts" :key="index">{{item.display_name}}<span v-if="index != userInfo.x_concepts.length - 1">/&nbsp;</span></span>
                        </div>
                        <div class="areas" v-else>
                            <el-icon><Menu /></el-icon>
                            <span>{{'暂无领域信息'}}</span>
                        </div>
                    </div>
                </li>
                <li class="right-btn-wrap" style="float: right; vertical-align: middle;" v-if="personalAccount == 1 && isEdit == 0">
                    <el-button class="right-btn" type="primary"  size="large" plain @click="isEdit = 1" :icon="Edit">编辑</el-button>
                </li>
                <li class="right-btn-wrap" style="float: right; vertical-align: middle;" v-if="personalAccount == 1 && isEdit == 1">
                    <el-button class="right-btn" type="primary"  size="large" plain @click="uploadFile()" :icon="UploadFiled">上传头像</el-button>
                    <el-button class="right-btn" type="primary"  size="large" plain @click="isEdit = 0" :icon="Edit">保存编辑</el-button>
                </li>
                <li class="right-btn-wrap" v-if="personAccount != 1 && is_follow"
                    style="float: right; vertical-align: middle;">
                    <el-button class="right-btn" type="primary" size="large" plain @click="cancelFollow()">取消关注</el-button>
                </li>

                <li class="right-btn-wrap" v-if="personAccount != 1 && !is_follow"
                    style="float: right; vertical-align: middle;">
                    <el-button class="right-btn" type="primary"  size="large" plain @click="follow()">关注</el-button>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import {
  Menu,
  Edit,
  HomeFilled,
} from '@element-plus/icons-vue'
const props = defineProps({
    tokenid: Number,
    personAccount: Number, // 1 自己的账号 2 别人的账号
    userInfo: Object, //
})

const accountType = ref(1) // 0 - 自己的账户  1 - 他人账户未关注 2 - 他人账户已关注
const idEdit = ref(0) //记录是否处于编辑状态
const is_follow = ref(false)
onMounted(() => {
    is_follow.value = props.userInfo.is_follow
})

const uploadFile = async () => {
    //todo上传头像 更新avatar_url
}

const accountPreProcess = () => {
    //todo 确定该账户是不是自己的账户
    //todo 确定非自己账户是不是已经关注
}

const follow = async() => {
    //todo 向后端发送请求 关注某人
    is_follow.value = true
}

const cancelFollow = async() => {
    //todo 向后端发送请求 取消关注某人
    is_follow.value = false
}
</script>
<style>
/* 整体的height和width由外层调整 */
.avatar_main_wrap{
    width: 100%;
    background-color: white;
    border-radius: 20px;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.card_body {
    height: 80%;
    width: 90%;

}

.card_body ul {
    margin: 0;
    height: 100%;
}

.card_body li {
    list-style: none;
    margin-right: 20px;
    display: inline-block;
    height: 100%;
    vertical-align: middle;
}

.title_profile {
    height: 100%;
    margin-left: 30px;
}

.name {
    font-size: 40px;
    height: 20%;
    margin-top: 15%;
    margin-bottom: 5%;
    line-height: 100%;
    cursor: pointer;
    text-align: left;
    display: block;
}

.organization {
    font-size: 18px;
    height: 13%;
    line-height: 100%;
    text-align: left;
    cursor: pointer;
}

.areas {
    font-size: 18px;
    color: #409eff;
    height: 13%;
    line-height: 100%;
    text-align: left;

    display: block;
    word-break: break-all;
    word-wrap: break-word;
}

.follow {
    font-size: 18px;
    color: grey;
}

.right-btn-wrap{
    height: 100%;
    width: 10%;
}

.right-btn{
    margin-top: 50%;
    font-size: 20px;
}
</style>