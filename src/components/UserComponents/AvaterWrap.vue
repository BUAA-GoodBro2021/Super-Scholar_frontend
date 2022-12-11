<template>
    <div class="avatar_main_wrap">
        <div class="card_body">
            <ul>
                <li style="vertical-align: middle; ">
                    <div class="avatar_wrap">
                        <el-avatar :size="110" :src="userInfo.avatar_url ? userInfo.avatar_url : authorAvatarUrl"
                            style="cursor: pointer">
                        </el-avatar>
                    </div>
                </li>
                <li class="title-profile-li">
                    <div class="title_profile">
                        <div class="title-profile-block">
                            <span class="name">
                                <div style="display: flex; align-items: center; ">
                                    <div style="position: relative; margin-right: 10px; ">
                                        <div class="name-display_name">
                                            <div style="clear: both"></div>
                                            <span :title="userInfo.display_name" class="name-display_name-span">
                                                {{
                                                        userInfo.display_name
                                                }}
                                            </span>
                                        </div>
                                        <span v-if="openAlexAccount == 1 || claimed == 1" class="name-claim-flag"
                                            :title="openAlexAccount == 1 ? 'openAlex用户' : '已认证'"><el-icon
                                                class="claim-document-icon">
                                                <CircleCheckFilled />
                                            </el-icon></span>
                                    </div>
                                    <div class="claim-wrap" v-if="openAlexAccount == 1">
                                        <span class="claim-wrap-name" :title="'OpenAlex作者'">OpenAlex作者</span>
                                        <div class="claim-wrap-right"></div>
                                    </div>
                                    <div class="claim-wrap claim-wrap-short"
                                        v-if="openAlexAccount == 0 && claimed == 0">
                                        <span class="claim-wrap-name" :title="'未认证'">未认证</span>
                                        <div class="claim-wrap-right"></div>
                                    </div>
                                    <div class="claim-wrap claim-wrap-short"
                                        v-if="openAlexAccount == 0 && claimed == 2">
                                        <span class="claim-wrap-name" :title="'认证中'">认证中</span>
                                        <div class="claim-wrap-right"></div>
                                    </div>
                                    <div class="claim-wrap claim-wrap-var" v-if="openAlexAccount == 0 && claimed == 1">
                                        <span class="claim-wrap-name" @click="toOpenAlexAccount()"
                                            :title="userInfo.real_name">{{ userInfo.real_name
                                            }}</span>
                                        <div class="claim-wrap-right"></div>
                                    </div>
                                    <span v-if="openAlexAccount == 1 || claimed == 1"
                                        class="claim-document-data"><el-icon class="claim-document-icon">
                                            <List />
                                        </el-icon>&nbsp; {{ userInfo.works_count }}</span>
                                    <span v-if="openAlexAccount == 1 || claimed == 1" class="claim-document-data"><i
                                            class="iconfont icon-quotes claim-document-icon"></i>&nbsp;
                                        {{ userInfo.cited_by_count }}</span>

                                    <!-- <el-tag style="margin-left: 20px; font-size: 10px;" v-if="openAlexAccount == 1"
                                        type="success">OpenAlex作者</el-tag> -->
                                    <!-- <el-tag style="margin-left: 20px; font-size: 10px;"
                                        v-if="openAlexAccount == 0 && claimed == 0" type="warning">未认证</el-tag>
                                    <el-tag style="margin-left: 20px; font-size: 10px;"
                                        v-if="openAlexAccount == 0 && claimed == 2" type="warning">认证中</el-tag>
                                    <el-tag style="margin-left: 20px; font-size: 10px;"
                                        v-if="openAlexAccount == 0 && claimed == 1" type="success"
                                        @click="toOpenAlexAccount()">已认证</el-tag> -->
                                </div>
                            </span>
                            <div class="organization">
                                <el-icon>
                                    <!-- <HomeFilled /> -->
                                    <PriceTag />
                                </el-icon> &nbsp;
                                <span v-if="openAlexAccount == 1" @click="toOrganization()" class="single-organization"
                                    :title="userInfo.last_known_institution ?
                                    userInfo.last_known_institution.display_name : '暂无机构信息'">{{
            userInfo.last_known_institution
                ?
                userInfo.last_known_institution.display_name : '暂无机构信息'
    }}</span>
                                <span v-else>{{ userInfo.email }}</span>
                            </div>
                            <div class="areas" v-if="openAlexAccount == 1 && userInfo.x_concepts">
                                <el-icon class="areas-icon">
                                    <Notification />
                                </el-icon> &nbsp;
                                <div class="areas-content">
                                    <div class="card-concepts clearfix">
                                        <div class="card-concepts-wrap" v-for="( concept, conceptIndex) in userInfo.x_concepts.slice(0, 11)" :key="conceptIndex" @click="toArea(concept)">
                                            <div class="card-concept-context">
                                                {{ concept.display_name }}
                                            </div>
                                        </div>
                                    </div>
                                    <!-- <span style="cursor: pointer;"
                                        v-for="(item, index) in userInfo.x_concepts.slice(0, 15)" :key="index"
                                        @click="toArea(item)" class="single-area">{{
                                                item.display_name
                                        }}<span
                                            v-if="index != userInfo.x_concepts.length - 1 && index != 14">&nbsp;/&nbsp;</span></span> -->
                                </div>
                            </div>
                            <div class="areas" v-if="openAlexAccount == 1 && !userInfo.x_concepts">
                                <el-icon class="areas-icon">
                                    <!-- <Menu /> -->
                                    <Notification />
                                </el-icon> &nbsp;
                                <span>{{ '暂无领域信息' }}</span>
                            </div>
                            <div class="areas" v-if="openAlexAccount == 0">
                                <el-icon class="areas-icon">
                                    <!-- <Menu /> -->
                                    <Notification />
                                </el-icon> &nbsp;
                                <span v-if="userInfo.introduction">{{ userInfo.introduction }}</span>
                                <span v-else>{{ "暂无自我介绍" }}</span>
                            </div>
                        </div>
                    </div>
                </li>
                <li class="right-btn-wrap" style="float: right; vertical-align: middle;" v-if="personAccount == 1">
                    <button class="right-btn follow-btn" @click="changeDialogShow = true">
                        编辑
                    </button>
                </li>
                <li class="right-btn-wrap" v-if="personAccount != 1 && openAlexAccount == 1 && is_follow"
                    style="float: right; vertical-align: middle;">
                    <button class="right-btn cancel-follow-btn" @click="cancelFollow()">取消关注
                    </button>
                </li>

                <li class="right-btn-wrap" v-if="personAccount != 1 && openAlexAccount == 1 && !is_follow"
                    style="float: right; vertical-align: middle;">
                    <!-- <el-button class="right-btn" type="primary" plain @click="follow()">关注</el-button> -->
                    <button class="right-btn follow-btn" @click="follow()">关注</button>
                </li>
            </ul>
        </div>
        <el-dialog v-model="changeDialogShow">
            <template #header>
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
                            <el-input v-model="changeMessage.name" maxlength="20" show-word-limit></el-input>
                        </div>
                        <div class="dialog-right-item change-introduction">
                            <span class="change-label">自我介绍:</span>
                            <el-input v-model="changeMessage.introduction" type="textarea" maxlength="120"
                                show-word-limit></el-input>
                        </div>
                        <div class="dialog-right-btn confirm-button">
                            <el-button @click="cancelChange()" style="float: right;">取消</el-button>
                            <el-button @click="saveChange()" style="float: right; margin-right: 20px;">保存编辑</el-button>
                            <el-button @click="abandonPortalDialog = true" style="float: right; margin-right: 20px;"
                                type="danger" v-if="claimed == 1">解除门户认领</el-button>
                        </div>
                    </div>
                </div>
                <el-dialog append-to-body v-model="abandonPortalDialog">
                    <template #header>
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
import authorAvatarUrl from '../../assets/images/avatar.png'
import {
    Menu,
    Edit,
    HomeFilled,
    PriceTag,
    Notification,
    List,
    CircleCheckFilled,
} from '@element-plus/icons-vue'
import { nextTick } from 'vue'
import { ClaimPortal } from '../../api/claimPortal'
import { defineEmits } from 'vue';
import { User } from "../../api/userDetail"
import { useRouter } from 'vue-router';
const emit = defineEmits(["pageChange", "infoChange"])
const router = useRouter()
const props = defineProps({
    openAlexId: String,
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
    if (changeMessage.value.name == null) {
        ElNotification({
            title: "请完善昵称",
            message: "请完善昵称",
            type: "error",
            duration: 3000
        })
        return
    }
    let data = {
        introduction: changeMessage.value.introduction,
        name: changeMessage.value.name
    }
    User.ChangeUserInfo(data).then((res) => {
        if (res.data.result == 1) {
            changeDialogShow.value = false
            emit("infoChange")
        } else {
            ElNotification({
                title: "很遗憾",
                message: res.message,
                type: "error",
                duration: 3000
            })
        }
    }).catch((err) => {
        ElNotification({
            title: "很遗憾",
            message: err.message,
            type: "error",
            duration: 3000
        })
    })
    // changeDialogShow.value = false
}

const cancelChange = () => {
    //todo 清空工作
    changeDialogShow.value = false
}

const abandonPortal = () => {
    //如果是审核中 无法放弃
    ClaimPortal.AbandonPortal({}).then((res) => {
        if (res.data.result == 1) {
            abandonPortalDialog.value = false;
            emit("AbandonPortal")
        } else {
            ElNotification({
                title: "很遗憾",
                message: res.message,
                type: "error",
                duration: 3000
            })
        }
    }).catch((err) => {
        ElNotification({
            title: "很遗憾",
            message: err.message,
            type: "error",
            duration: 3000
        })
    })
    abandonPortalDialog.value = false;
}
/**************************** */

const accountType = ref(1) // 0 - 自己的账户  1 - 他人账户未关注 2 - 他人账户已关注
const isEdit = ref(0) //记录是否处于编辑状态
const is_follow = ref(false)
onMounted(() => {
    is_follow.value = props.personAccount == 1 ? 0 : props.userInfo.is_follow

    changeMessage.value.name = props.userInfo.display_name
    changeMessage.value.email = props.userInfo.email
    changeMessage.value.introduction = props.userInfo.introduction
})

watch(props.userInfo, (newVal) => {
    changeMessage.value.name = props.userInfo.display_name
    changeMessage.value.email = props.userInfo.email
    changeMessage.value.introduction = props.userInfo.introduction
})

const toOpenAlexAccount = () => {
    //跳转到认证的门户
    let { href } = router.resolve({
        name: 'OpenAlexAuthorDetail',
        params: { tokenid: props.userInfo.open_alex_id }
    })
    window.open(href, "_blank")
}

const follow = async () => {
    //todo 向后端发送请求 关注某人
    User.FollowAuthor({
        author_id: props.openAlexId
    }).then((res) => {
        if (res.data.result == 1) {
            is_follow.value = true
        } else {
            ElNotification({
                title: "很遗憾",
                message: res.message,
                type: "error",
                duration: 3000
            })
        }
    }).catch((err) => {
        ElNotification({
            title: "很遗憾",
            message: err.message,
            type: "error",
            duration: 3000
        })
    })
}

const cancelFollow = async () => {
    //todo 向后端发送请求 取消关注某人
    User.CancelFollow({
        author_id: props.openAlexId
    }).then((res) => {
        if (res.data.result == 1) {
            is_follow.value = false
        } else {
            ElNotification({
                title: "很遗憾",
                message: res.message,
                type: "error",
                duration: 3000
            })
        }
    }).catch((err) => {
        ElNotification({
            title: "很遗憾",
            message: err.message,
            type: "error",
            duration: 3000
        })
    })

}

const toArea = (item) => {
    let { href } = router.resolve({
        name: 'ConceptDetail',
        params: { tokenid: item.id.substring(21) }
    })
    window.open(href, "_blank")
}

const toOrganization = () => {
    console.log(props.userInfo.last_known_institution)
    if (props.userInfo.last_known_institution) {
        let { href } = router.resolve({
            name: 'InstitutionDetail',
            params: { institutionid: props.userInfo.last_known_institution.id.substring(21) }
        })
        window.open(href, "_blank")
    } else {
        return
    }
}

watch(() => props.userInfo.is_follow, (newVal) => {
    is_follow.value = newVal
})

</script>
<style>
/* 整体的height和width由外层调整 */
.avatar_main_wrap {
    width: 100%;
    /* background-color: white; */
    /*配色 深 */
    /* background: linear-gradient(70deg, #445a7f,rgb(102 99 84)); */
    /*配色 浅 */
    background: linear-gradient(70deg, #f4f8ff, rgb(184 179 154));
    border-radius: 2px;
    box-shadow: 3px 3px 3px 3px #dedede;
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
    /* margin-right: 20px; */
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
    /* margin-left: 30px; */
    width: 100%;
    display: flex;
    align-items: center;
}

.title-profile-li {
    padding-left: 3rem;
    min-width: 60%;
    height: 100%;
    max-width: calc(100% - 200px);
}

.title-profile-block {
    display: block;
    height: 60%;
}


.name {
    font-size: 1.8rem;
    height: 50%;
    /* cursor: pointer; */
    text-align: left;
    display: flex;
    align-items: center;
}

/**名字 设置 */
.name .name-display_name {
    position: relative;
    /* margin-right: 10px; */
    cursor: default;
    height: auto;
    /* min-height: 37.6px; */
    /* height: 100%;
    display: flex;
    align-items: center; */

    max-width: 450px;
    white-space: nowrap;
    text-overflow: ellipsis;
    /* 设置hidden会导致父元素的高度不能被子元素撑开 */
    /* overflow: hidden; */
}

.name .name-display_name .name-display_name-span {
    height: auto;
    max-width: 450px;
}

.name .name-claim-flag {
    position: absolute;
    top: -6px;
    right: -18px;
    color: rgba(162, 144, 42, 0.575);
    font-size: 1rem;
}


/**认证框 */
.name .claim-wrap {
    width: 150px;
    height: 2rem;
    margin-left: 20px;
    font-size: 1.2rem;
    position: relative;
    cursor: default;
    border-bottom: 2px solid rgb(162, 143, 42);
}

.name .claim-wrap-short {
    width: 73px;
}

.name .claim-wrap-var {
    width: auto;
    max-width: 300px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
}

.name .claim-wrap .claim-wrap-name {
    height: 2rem;
    line-height: 2rem;
    color: rgb(162, 143, 42);
    padding-left: 10px;
}

.name .claim-wrap .claim-wrap-right {
    position: absolute;
    width: 7px;
    height: 2rem;
    left: 0;
    top: 0;
    background-color: rgb(162, 143, 42);
}

.name .claim-document-data {
    font-size: 1.2rem;
    /* color:  #0077c2;
     */
    color: rgb(107 6 6);
    padding-left: 10px;
    height: 1.2rem;
    line-height: 1.2rem;
    cursor: default;
}

.name .claim-document-icon {
    /* color: #0077c2 */
}

.organization {
    font-size: 15px;
    height: 23%;
    margin-bottom: 5px;
    line-height: 100%;
    text-align: left;
    /* cursor: pointer; */
    display: flex;
    align-items: center;
}

.single-organization {
    cursor: pointer;
}

.single-organization:hover {
    /* color: #0169d1; */
    color: rgb(162, 143, 42);
}

.areas {
    font-size: 15px;
    color: rgb(162, 143, 42);
    /* height: 63%; */
    height: 73%;
    width: 100%;
    line-height: 20px;
    /* line-height: 50%; */
    text-align: left;
    display: flex;
    /* align-items: center; */
    /* display: block; */
    word-break: break-all;
    word-wrap: break-word;
    ;
}

.card-concepts {
  height: auto;
}
.card-concepts .card-concepts-wrap {
  float: left;
  margin-right: 10px;
  margin-bottom: 5px;
  padding: 3px 4px;
  box-sizing: border-box;
  border: 1.6px solid rgb(162, 143, 42);
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}
.card-concepts .card-concepts-wrap i {
  display: inline-block;
  margin-right: 3px;
}
.card-concepts .card-concepts-wrap .card-concept-context {
  display: inline-block;
  text-transform: capitalize;
}
.clearfix::before,
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}

::-webkit-scrollbar {
    width: 6px;
}

/* 滚动槽 */
::-webkit-scrollbar-track {
    border-radius: 10px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
    border-radius: inherit;
    background-color: rgba(144, 147, 153, 0.3);
    -webkit-transition: 0.3s background-color;
    transition: 0.3s background-color;
}


.areas-icon {
    height: 20px;
    color: black
}

.areas-content {
    overflow-y: scroll;
    text-overflow: ellipsis;
}

.single-area:hover {
    color: black
}

/* 在小屏幕时的高度布局 */
@media (max-height: 800px) {
    .title-profile-block {
        display: block;
        height: 100%;
    }

    .name {
        height: 39%;
    }

    .organization {
        height: 19%;
    }
    .areas {
        height: 54%;
    }
    
}

@media (max-width: 900px) {
    .name .claim-wrap {
        max-width: 100px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .name .claim-wrap-var {
        max-width: 100px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .name .claim-wrap-name {
        max-width: 100px;
    }
}

@media (max-width: 900px) {
    .name .name-display_name {
        max-width: 130px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .name .name-display_name .name-display_name-span {
        max-width: 130px !important;
    }
}

@media (max-width: 1200px ) {
    .card_body {
        height: 80%;
        width: 97%;
    }

    .areas {
        height: 50%;
    }
}


.follow {
    font-size: 18px;
    color: grey;
}

.right-btn-wrap {
    height: 100%;
    /* width: 10%; */
    display: flex !important;
    align-items: center;
}

.right-btn {
    /* margin-top: 50%; */
    font-size: 1rem;
    color: white;
}

.right-btn:hover {
    /* margin-top: 50%; */
    font-size: 1rem;
    background-color: rgba(162, 144, 42, 0.845);
}

.follow-btn {
    width: 65px;
    height: 40px;
    background-color: rgb(162, 143, 42);
    border: none;
    cursor: pointer;
    border-radius: 1px;
}

.cancel-follow-btn {
    width: 80px;
    height: 40px;
    background-color: rgb(162, 143, 42);
    border: none;
    cursor: pointer;
    border-radius: 1px;
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