<template>
    <div class="avatar_main_wrap">
        <div class="card_body">
            <ul>
                <li style="vertical-align: middle; ">
                    <div class="avatar_wrap">
                        <el-avatar
                            :size="110"
                            :src="userInfo.avatar_url ? userInfo.avatar_url : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
                            style="cursor: pointer">
                        </el-avatar>
                    </div>
                </li>
                <li style="min-width: 60%; height: 100%;">
                    <div class="title_profile">
                        <div class="title-profile-block">
                            <span class="name">
                                <div style="display: flex; align-items: center;">
                                    {{ userInfo.display_name }}
                                    <el-tag style="margin-left: 20px; font-size: 10px;" v-if="openAlexAccount == 1"
                                        type="success">OpenAlex作者</el-tag>
                                    <el-tag style="margin-left: 20px; font-size: 10px;"
                                        v-if="openAlexAccount == 0 && claimed == 0" type="warning">未认证</el-tag>
                                    <el-tag style="margin-left: 20px; font-size: 10px;"
                                        v-if="openAlexAccount == 0 && claimed == 2" type="warning">认证中</el-tag>
                                    <el-tag style="margin-left: 20px; font-size: 10px;"
                                        v-if="openAlexAccount == 0 && claimed == 1" type="success"
                                        @click="toOpenAlexAccount()">已认证</el-tag>
                                </div>
                            </span>
                            <div class="organization">
                                <el-icon>
                                    <HomeFilled />
                                </el-icon> &nbsp;
                                <span v-if="openAlexAccount == 1">{{ userInfo.last_known_institution ?
                                        userInfo.last_known_institution : '暂无机构信息'
                                }}</span>
                                <span v-else>{{ userInfo.email }}</span>
                            </div>
                            <div class="areas" v-if="openAlexAccount == 1 && userInfo.x_concepts">
                                <el-icon>
                                    <Menu />
                                </el-icon> &nbsp;
                                <span style="cursor: pointer;" v-for="(item, index) in userInfo.x_concepts"
                                    :key="index">{{
                                            item.display_name
                                    }}<span v-if="index != userInfo.x_concepts.length - 1">/&nbsp;</span></span>
                            </div>
                            <div class="areas" v-if="openAlexAccount == 1 && !userInfo.x_concepts">
                                <el-icon>
                                    <Menu />
                                </el-icon> &nbsp;
                                <span>{{ '暂无领域信息' }}</span>
                            </div>
                            <div class="areas" v-if="openAlexAccount == 0">
                                <el-icon>
                                    <Menu />
                                </el-icon> &nbsp;
                                <span v-if="userInfo.introduction">{{ userInfo.introduction }}</span>
                                <span v-else>{{ "暂无自我介绍" }}</span>
                            </div>
                        </div>
                    </div>
                </li>
                <li class="right-btn-wrap" style="float: right; vertical-align: middle;" v-if="personAccount == 1">
                    <el-button class="right-btn" type="primary" size="sma1l" plain @click="changeDialogShow = true"
                        :icon="Edit">编辑
                    </el-button>
                </li>
                <li class="right-btn-wrap" v-if="personAccount != 1 && openAlexAccount == 1 && is_follow"
                    style="float: right; vertical-align: middle;">
                    <el-button class="right-btn" type="primary" size="small" plain @click="cancelFollow()">取消关注
                    </el-button>
                </li>

                <li class="right-btn-wrap" v-if="personAccount != 1 && openAlexAccount == 1 && !is_follow"
                    style="float: right; vertical-align: middle;">
                    <el-button class="right-btn" type="primary" size="sma1l" plain @click="follow()">关注</el-button>
                </li>
            </ul>
        </div>
        <el-dialog v-model="changeDialogShow">
            <template #title>
                <span class="dialog-title">修改个人信息</span>
            </template>
            <template #default>
                <div class="dialog-change-wrap">
                    <div class="dialog-left">
                        <el-avatar :size="130"
                            :src="userInfo.avatar_url ? userInfo.avatar_url : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
                            style="cursor: pointer; margin-top: -30%;">
                        </el-avatar>
                        <!-- <el-upload ref="upload" class="upload-demo"
                        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :limit="1"
                        :on-exceed="handleExceed" :auto-upload="false">
                        <template #trigger>
                            <el-button type="primary" style="margin-top: 20px;">更换头像</el-button>
                        </template>
                    </el-upload> -->
                    </div>
                    <div class="dialog-right">
                        <div class="dialog-right-item change-name">
                            <span class="change-label">昵称:</span>
                            <el-input v-model="changeMessage.name"></el-input>
                        </div>
                        <div class="dialog-right-item change-organization">
                            <span class="change-label">邮箱:</span>
                            <el-input v-model="changeMessage.email"></el-input>
                        </div>
                        <div class="dialog-right-item change-password">
                            <span class="change-label">密码:</span>
                            <el-input v-model="changeMessage.password" type="password"></el-input>
                        </div>
                        <div class="dialog-right-item change-introduction">
                            <span class="change-label">自我介绍:</span>
                            <el-input v-model="changeMessage.introduction" type="text-area"></el-input>
                        </div>
                        <!-- <div class="dialog-right-item change-areas">
                        <span class="change-label" v-if="claimed == 0">确认密码:</span>
                        <div class="change-area">
                            <el-tag v-for="(tag, index) in changeMessage.areas" :key="index" class="area-tag" closable
                                :disable-transitions="false" @close="areaTagClose(index)" style="margin-right: 10px;">
                                {{ tag.display_name }}
                            </el-tag>
                            <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="ml-1 w-20"
                                size="small" @keyup.enter="handleInputConfirm" @blur="handleInputConfirm"
                                style="width: 100px;" maxlength="10" />
                            <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput()">
                                + 领域
                            </el-button>
                        </div>
                    </div> -->
                        <div class="dialog-right-btn confirm-button">
                            <el-button @click="cancelChange()" style="float: right;">取消</el-button>
                            <el-button @click="saveChange()" style="float: right; margin-right: 20px;">保存编辑</el-button>
                            <el-button @click="abandonPortalDialog = true" style="float: right; margin-right: 20px;"
                                type="danger" v-if="claimed == 1">解除门户认领</el-button>
                        </div>
                    </div>
                </div>
                <el-dialog append-to-body v-model="abandonPortalDialog">
                    <template #title>
                        <span class="dialog-title">确定解除门户关系吗？</span>
                    </template>
                    <div style="display: flex; justify-content: center; ">
                        <el-button @click="abandonPortal()" type="danger">确定</el-button>
                        <el-button @click="abandonPortalDialog = false">取消</el-button>
                    </div>
                </el-dialog>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import {
    Menu,
    Edit,
    HomeFilled,
} from '@element-plus/icons-vue'
import { nextTick } from 'vue-demi'
const props = defineProps({
    tokenid: Number,
    personAccount: Number, // 1 自己的账号 2 别人的账号
    openAlexAccount: Number, //0 非openalex 1 openalex原生作者
    userInfo: Object, //
    claimed: Number // 0 未认证 1 已认证
})

/*修改个人信息************************ */
const abandonPortalDialog = ref(false)
const changeDialogShow = ref(false)
// const InputRef = ref()
// const inputVisible = ref(false) // area的输入框
// const inputValue = ref(null) // 输入的内容
const changeMessage = ref({
    name: "",
    email: "",
    password: "", //为空的话则不修改
    introduction: '',
})

// const areaTagClose = (index) => {
//     changeMessage.value.areas.splice(index, 1);
// }

// const handleInputConfirm = () => {
//     console.log('input失去焦点或确定输入')
//     if (!inputValue.value) {
//         inputVisible.value = false
//         return
//     } else console.log('新标签的内容：' + inputValue.value)
//     changeMessage.value.areas.push({
//         display_name: inputValue.value,
//     })
//     inputVisible.value = false
//     inputValue.value = ''

// }

// const showInput = () => {
//     if (changeMessage.value.areas.length >= 6) {
//         ElMessage.warning("标签不可多于6个")
//         return
//     }
//     inputVisible.value = true
//     nextTick(() => {
//         InputRef.value.focus();
//     })
// }

const saveChange = async () => {
    //todo保存工作 
    changeDialogShow.value = false
}

const cancelChange = () => {
    //todo 清空工作
    changeDialogShow.value = false
}

const abandonPortal = () => {
    //如果是审核中 无法放弃
    abandonPortalDialog.value = false;
}
/**************************** */

const accountType = ref(1) // 0 - 自己的账户  1 - 他人账户未关注 2 - 他人账户已关注
const isEdit = ref(0) //记录是否处于编辑状态
const is_follow = ref(false)
onMounted(() => {
    is_follow.value = props.personAccount == 1 ? 0 : props.userInfo.is_follow

    // changeMessage.value.name = props.userInfo.display_name
    // changeMessage.value.organization = props.userInfo.last_known_institution
    // changeMessage.value.areas = props.userInfo.x_concepts
})

const toOpenAlexAccount = () => {
    //跳转到认证的门户
}

const uploadFile = async () => {
    //todo上传头像 更新avatar_url
}

const accountPreProcess = () => {
    //todo 确定该账户是不是自己的账户
    //todo 确定非自己账户是不是已经关注
}

const follow = async () => {
    //todo 向后端发送请求 关注某人
    is_follow.value = true
}

const cancelFollow = async () => {
    //todo 向后端发送请求 取消关注某人
    is_follow.value = false
}

</script>
<style>
/* 整体的height和width由外层调整 */
.avatar_main_wrap {
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

.avatar_wrap {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.title_profile {
    height: 100%;
    margin-left: 30px;
    width: 100%;
    display: flex;
    align-items: center;
}

.title-profile-block {
    display: block;
    height: 50%;
}

.name {
    font-size: 23px;
    height: 55%;
    line-height: 100%;
    cursor: pointer;
    text-align: left;
    display: block;
}

.organization {
    font-size: 15px;
    height: 23%;
    margin-bottom: 2%;
    line-height: 100%;
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.areas {
    font-size: 15px;
    color: #409eff;
    height: 25%;
    width: 100%;
    line-height: 100%;
    text-align: left;
    display: flex;
    align-items: center;

    /* display: block; */
    word-break: break-all;
    word-wrap: break-word;
}

.follow {
    font-size: 18px;
    color: grey;
}

.right-btn-wrap {
    height: 100%;
    width: 10%;
    display: flex;
    align-items: center;
}

.right-btn {
    margin-top: 50%;
    font-size: 1px;
}

/******dialog ******/
.dialog-change-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    /* position: relative; */
}

.dialog-left {
    width: 20%;
    margin-right: 5%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.dialog-right {
    flex: 1;
    width: 65%;
    height: 100%;
}

.dialog-right-item {
    margin-bottom: 10px;
}

.dialog-right-btn {
    /* position: absolute;
    bottom: 20px;
    right: 20px; */
    font-size: 10px;
    margin-top: 25px;
}

.change-label {
    display: block;
    margin-bottom: 10px;
}

/******dialog end ******/
</style>