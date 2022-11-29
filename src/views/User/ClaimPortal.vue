<template>
    <div class="claim-portal-wrap" v-if="accountType == -1">
        <div class="claim-portal-body">
            <el-steps :active="stepIndex" finish-status="success" class="steps">
                <el-step title="填写个人信息" />
                <el-step title="认领门户" />
                <el-step title="完成" />
            </el-steps>
            <el-divider></el-divider>
            <div class="step step0" v-show="stepIndex == 0">
                <el-form :model="form" label-width="120px" ref="formRef" :rules="rules" class="table">
                    <el-form-item label="真实姓名" prop="name">
                        <el-input v-model="form.name" prop="name" />
                    </el-form-item>
                    <el-form-item label="手机号码" prop="telephone">
                        <el-input v-model="form.telephone" prop="telephone" />
                    </el-form-item>
                    <el-form-item label="单位" prop="organization">
                        <el-input v-model="form.organization" prop="organization" />
                    </el-form-item>
                    <el-form-item label="申请理由" prop="content">
                        <el-input v-model="form.content" prop="content" type="textarea" maxlength="200"
                            show-word-limit />
                    </el-form-item>
                </el-form>
                <el-form-item>
                    <el-button type="primary" @click="StepZeroToOne()">下一步</el-button>
                </el-form-item>
            </div>
            <div class="step step1" v-show="stepIndex == 1">
                <div class="alert-message-header">
                    <span class="alert-message">已根据您的姓名， 检索出<span class="alert-message alert-message-number">&nbsp;{{
                            allAuthors
                    }}&nbsp;</span>位科研人员</span>
                    <el-button type="primary" @click="StepBack()" style="float: right;">上一步</el-button>
                    <el-button type="primary" @click="StepOneToTwo()" style="float: right; margin-right: 10px;">确定
                    </el-button>
                </div>
                <div class="authorlist-wrap">
                    <div v-for="(item, index) in authorList" :key="index">
                        <div class="author-name">
                            <el-checkbox v-model="item.chose" :label="AuthorShowHeader(item)"
                                @change="TurnLastToFalse(index)" />
                            <span v-show="!item.showArticle && !item.loading" class="right-arrow"
                                @click="authorWorkListDetail(item)">
                                <el-icon>
                                    <ArrowDown />
                                </el-icon>
                            </span>
                            <span v-show="!item.showArticle && item.loading" class="right-arrow">
                                <el-icon class="is-loading">
                                    <Loading />
                                </el-icon>
                            </span>
                            <span v-show="item.showArticle && !item.loading" class="right-arrow"
                                @click="closeAuthorWorkList(item)">
                                <el-icon>
                                    <ArrowUp />
                                </el-icon>
                            </span>
                        </div>
                        <div class="author-article-list" v-if="item.showArticle && !item.loading">
                            <div v-for="(article, articleIndex) in item.work_list" :key="articleIndex"
                                class="author-article-name">
                                <span class="">{{ (articleIndex + 1) + ". " + article.display_name }}</span>
                                <!-- <el-divider v-if="articleIndex != item.work_list.length - 1"></el-divider> -->
                            </div>
                        </div>
                    </div>
                </div>
                <div class="authorlist-footer">
                    <el-pagination layout="prev, pager, next" :total="pageTotalSize" @current-change="PageChange()"
                        v-model:current-page="pageCurrent" hide-on-single-page
                        :page-sizes="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" />
                </div>
            </div>
            <div class="step step2" v-show="stepIndex == 2">
                <div class="step2-icon">
                    <el-icon class="step2-icon">
                        <SuccessFilled />
                    </el-icon>
                </div>
                <span class="step2-message">欢迎入驻</span>
                <span class="step2-message">管理员将在3天时间内完成审核，请耐心等待。</span>
                <el-button type="primary" @click="stepFinish()">完成</el-button>
            </div>
        </div>
    </div>
    <div class="wrap2" v-if="accountType == 0">
        <el-icon class="step2-icon">
            <SuccessFilled />
        </el-icon>
        <span class="step2-message" style="margin-top: 20px;">管理员将在3天时间内完成审核，请耐心等待。</span>
        <el-button @click="abandonPortalDialog = true">解除认证</el-button>
    </div>
    <div class="wrap2" v-if="accountType == 1">
        <el-icon class="step2-icon">
            <SuccessFilled />
        </el-icon>
        <span class="step2-message" style="margin-top: 20px;">认证成功</span>
        <el-button @click="abandonPortalDialog = true">解除认证</el-button>
    </div>
    <el-dialog v-model="abandonPortalDialog">
        <template #title>
            <span class="dialog-title">确定解除门户关系吗？</span>
        </template>
        <div style="display: flex; justify-content: center; ">
            <el-button @click="Reclaim()" type="danger">确定</el-button>
            <el-button @click="abandonPortalDialog = false">取消</el-button>
        </div>
    </el-dialog>
</template>
<script setup>
import { useGlobalStore } from "../../stores/global.js";
import { ClaimPortal } from "../../api/claimPortal"
import { User } from "../../api/userDetail"
import { ElNotification } from "element-plus";
import {
    ArrowDown,
    ArrowUp,
    SuccessFilled,
    Loading
} from '@element-plus/icons-vue'
import { reactive } from "vue-demi";
const globalStore = useGlobalStore();
const stepIndex = ref(0)

const accountType = ref() //-1 个人账户没有认领 0 个人账户认证但是在审核中 1 个人账户已经成功认证
onMounted(() => {
    // accountType.value = globalStore.claimStatus 这里在认证之后更新localstorage里的东西  所以每次进入页面的时候都请求得到自己的状态
    getUserType()
})

const formRef = ref()
const form = reactive({
    name: 'Harbour',
    email: '2358272468@qq.com',
    telephone: '15112345678',
    organization: '北京航空航天大学软件学院',
    content: '',
})
const rules = reactive({
    name: [
        { required: true, message: '请输入您的真实姓名', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入您的邮箱', trigger: 'blur' },
        { regexp: "^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$", message: '请输入合法的邮箱', trigger: 'blur' },
    ],
    telephone: [
        { regexp: "/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/", message: '请输入合法的电话号码', trigger: 'blur' }
    ],
    organization: [
        { required: true, message: '请输入您的手机号码', trigger: 'blur' },
    ],
    content: [

    ]
})

const allAuthors = ref(0)
const pageCurrent = ref(1)
const pageTotalSize = ref(2)
const abandonPortalDialog = ref(false)
let authorList = ref([
    {
        id: '20373638',
        display_name: 'Harbour',
        last_known_institution: {
            display_name: 'Natrue',
        },
        showArticle: false,
        loading: false,
        work_list: []
    },
    {
        id: '20373638',
        display_name: 'Harbour',
        last_known_institution: {
            display_name: 'Natrue',
        },
        showArticle: false,
        loading: false,
        work_list: []
    },
])

const getUserType = () => {
    User.GetUserDetail().then((res) => {
        if (res.data.result == 1) {
            accountType.value = res.data.user.is_professional 
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

const AuthorShowHeader = (author) => {
    // console.log(author)
    return author.display_name + ` (${!author.last_known_institution ? '暂无机构' : author.last_known_institution.display_name ? author.last_known_institution.display_name : '暂无机构'})`
}

/*展示某一个作者的全部文章 */
const authorWorkListDetail = (author) => {
    if (author.work_list.length != 0) {
        author.showArticle = true
        return
    }
    author.loading = true
    const data = {
        "entity_type": "works",
        "params": {
            "filter": {
                "author.id": author.id.substring(21)
            },
            "page": 1,
            "per_page": 10000
        }
    }
    User.GetAuthorDocumentListById(data).then((res) => {
        if (res.data.result == 1) {
            author.work_list = res.data.list_of_data[0].results
            author.loading = false
            author.showArticle = true
        } else {
            author.showArticle = false
            author.loading = false
            ElNotification({
                title: "很遗憾",
                message: res.message,
                type: "error",
                duration: 3000
            })
        }
    }).catch((err) => {
        author.showArticle = false
        author.loading = false
        ElNotification({
            title: "很遗憾",
            message: err.message,
            type: "error",
            duration: 3000
        })
    })
}

const closeAuthorWorkList = (item) => {
    item.showArticle = false
}

const StepBack = () => {
    // 第二步回到第一步(one to zero)
    lastIndex.value = -1
    pageCurrent.value = 1
    stepIndex.value--;
}

const stepFinish = () => {
    accountType.value = 0
}

let lastIndex = ref(-1) //记录上一个勾选的框 勾选动作之前当下的选项
const TurnLastToFalse = (index) => {
    //这个时候
    console.log(index + " " + lastIndex.value)
    if (lastIndex.value == -1) {
        lastIndex.value = index
        return
    }
    if (lastIndex.value == index) {
        authorList.value[lastIndex.value].chose = false
        lastIndex.value = -1
        return
    }
    if (lastIndex.value >= 0 && lastIndex.value != index) {
        authorList.value[lastIndex.value].chose = false

    }
    lastIndex.value = index
}

const StepZeroToOne = async () => {
    await formRef.value.validate((valid, fields) => {
        if (valid) {
            getAuthorsByName(0)
            //todo 根据输入的form传到后端进行检索 返回用户组 这里需要跟后端商量那个work_url的用法 更新authorList
        } else {
            console.log(fields)
        }
    })
}

const StepOneToTwo = async () => {
    //todo 将lastIndex对应的authorList的id传到后端
    if (lastIndex.value == -1) {
        ElNotification({
            title: "很遗憾",
            message: err.message,
            type: "error",
            duration: 3000
        })
        return
    }
    const data = {
        "author_id": authorList.value[lastIndex.value].id.substring(21),
        "content": form.content,
        "institution": form.organization,
        "real_name": form.name
    }
    ClaimPortal.ClaimPortal(data).then((res) => {
        if (res.data.result == 1) {
            stepIndex.value++
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

const PageChange = (newpage) => {
    // pageCurrent.value = newpage
    // console.log(newpage + pageCurrent.value)
    lastIndex.value = -1
    getAuthorsByName(1)
}

/*
根据名字筛选作者
type 0 筛选结束后页面index++ 1由于页面切换引起的页面++

 */
const getAuthorsByName = (type) => {
    console.log('search author by name')
    ClaimPortal.SearchAuthor({
        "entity_type": "authors",
        "params": {
            "search": form.name,
            "page": pageCurrent.value,
            "per_page": 10
        }
    }).then((res) => {
        if (res.data.result == 1) {
            allAuthors.value = res.data.list_of_data[0].meta.count
            pageTotalSize.value = res.data.list_of_data[0].meta.count
            PreProcess(res.data.list_of_data[0].results)
            if (type == 0) stepIndex.value++;
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

const PreProcess = (data) => {
    authorList.value = []
    authorList.value.push(...data)
    authorList.value.forEach((item) => {
        item.showArticle = false
        item.loading = false
        item.work_list = []
        item.chose = false
    })
    // console.log(authorList.value)
}

// 已经认领成功但是想要重新认证
const Reclaim = async () => {
    ClaimPortal.AbandonPortal({}).then((res) => {
        if (res.data.result == 1) {
            abandonPortalDialog.value = false
            accountType.value = -1
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
</script>
<style scoped>
:deep(.claim-portal-body .steps) {
    margin-top: 0px;
    margin-bottom: 10px;
}

.wrap2 {
    height: 50%;
    width: 100%;
    /* margin-top: 25%;
    margin-left: 20%; */
    border-radius: 20px;
    background-color: white;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 10%;
}

.claim-portal-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
}

.claim-portal-body {
    margin-top: 18vh;
    height: 450px;
    width: 60vw;

    background-color: white;
    border-radius: 20px;
    border: 1px solid black;

    padding: 30px 30px;
}

.steps {
    margin: 20px 0 20px 0;
    padding-top: 20px;
}

.step0 {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}

.step1 {
    height: 100%;
    /* overflow-y: auto; */
}

.alert-message-header {
    width: 100%;
    margin: 10px 0 10px 0;
    height: 7%;
}

.authorlist-wrap {
    height: 60%;
    overflow-y: auto;
}

.authorlist-footer {
    height: 10%;
    display: flex;
    justify-content: center;
}

.step2 {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.step2-icon {
    font-size: 80px;
    margin-top: 20px;
    margin-bottom: 10px;
    color: rgb(93, 228, 93);
}

.step2-message {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
}

.table {
    width: 80%;
    margin-top: 20px;
}

.el-form-item {
    margin-bottom: 30px;
}

.el-form-item__label {
    text-align: left;
    font-size: 18px;
    font-weight: 600;
}

.alert-message {
    font-size: 18px;
    font-weight: 800;
}

.alert-message-number {
    font-size: 20px;
    font-weight: 800;
    color: #409eff;
}

.el-checkbox__label {
    font-size: 18px;
    font-weight: 600;
    color: black;
}

.author-name {
    width: 95%;
    margin: 20px 2.5% 0 2.5%;
    border-radius: 10px;
    background-color: white;
}

.author-article-list {
    width: 93%;
    margin-left: 4.5%;
    transition: 2s;
}

.right-arrow {
    float: right;
    font-size: 18px;
    margin-right: 10px;
    cursor: pointer;
}

.author-article-name {
    font-size: 15px;
    font-weight: 600;
    word-break: break-all;
    word-wrap: wrap;
    margin-top: 20px;
    margin-bottom: 30px;
}

.el-divider--horizontal {
    margin: 0;
}
</style>