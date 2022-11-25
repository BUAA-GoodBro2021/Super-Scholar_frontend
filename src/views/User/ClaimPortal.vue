<template>
    <div class="claim-portal-wrap" v-if="accountType == 1">
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
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="form.email" prop="email" />
                    </el-form-item>
                    <el-form-item label="手机号码" prop="telephone">
                        <el-input v-model="form.telephone" prop="telephone" />
                    </el-form-item>
                    <el-form-item label="单位" prop="organization">
                        <el-input v-model="form.organization" prop="organization" />
                    </el-form-item>
                </el-form>
                <el-form-item>
                    <el-button type="primary" @click="StepZeroToOne()">下一步</el-button>
                </el-form-item>
            </div>
            <div class="step step1" v-show="stepIndex == 1">
                <div class="alert-message-header">
                    <span class="alert-message">已根据您的姓名， 检索出<span class="alert-message alert-message-number">&nbsp;{{
                            authorList.length
                    }}&nbsp;</span>位科研人员</span>
                    <el-button type="primary" @click="StepBack()" style="float: right;">上一步</el-button>
                    <el-button type="primary" @click="StepOneToTwo()" style="float: right; margin-right: 10px;">确定
                    </el-button>
                </div>
                <div v-for="(item, index) in authorList" :key="index">
                    <div class="author-name">
                        <el-checkbox v-model="item.chose" :label="item.display_name" @click="TurnLastToFalse(index)" />
                        <span v-show="!item.showArticle" class="right-arrow" @click="item.showArticle = true">
                            <el-icon>
                                <ArrowDown />
                            </el-icon>
                        </span>
                        <span v-show="item.showArticle" class="right-arrow" @click="item.showArticle = false">
                            <el-icon>
                                <ArrowUp />
                            </el-icon>
                        </span>
                    </div>
                    <div class="author-article-list" v-show="item.showArticle">
                        <div v-for="(article, articleIndex) in item.work_list" :key="articleIndex"
                            class="author-article-name">
                            <span class="">{{ (articleIndex + 1) + ". " + article.display_name }}</span>
                            <!-- <el-divider v-if="articleIndex != item.work_list.length - 1"></el-divider> -->
                        </div>
                    </div>
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
    <div class="wrap2" v-if="accountType == 3">
        <el-icon class="step2-icon">
            <SuccessFilled />
        </el-icon>
        <span class="step2-message" style="margin-top: 20px;">管理员将在3天时间内完成审核，请耐心等待。</span>
    </div>
</template>
<script setup>
import {
    ArrowDown,
    ArrowUp,
    SuccessFilled
} from '@element-plus/icons-vue'
import { onMounted } from 'vue-demi'
const stepIndex = ref(0)
const props = defineProps({
    tokenid: Number,
    claimType: Number //1->未认证 3->认证待审核
})

const accountType = ref()
onMounted(() => {
    accountType.value = props.claimType
})

const formRef = ref()
const form = reactive({
    name: 'Harbour',
    email: '2358272468@qq.com',
    telephone: '15112345678',
    organization: '北京航空航天大学软件学院'
})
const rules = reactive({
    name: [
        { required: true, message: '请输入您的真实姓名', trigger: 'blur' },
    ],
    emial: [
        { required: true, message: '请输入您的邮箱', trigger: 'blur' },
        { regexp: "^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$", message: '请输入合法的邮箱', trigger: 'blur' },
    ],
    telephone: [
        { required: true, message: '请输入您的手机号码', trigger: 'blur' },
        { regexp: "/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/", message: '请输入合法的电话号码', trigger: 'blur' }
    ]
})

const authorList = reactive([
    {
        id: '20373638',
        display_name: 'Harbour',
        last_known_institution: 'Nature',
        work_list: [
            {
                display_name: '论基因拟实载态酶在练习时长两年半中的催化作用',
            },
            {
                display_name: '论基因拟实载态酶对中分头的催化作用',
            }
        ],
        showArticle: false
    },
    {
        id: '20373638',
        display_name: 'Harbour',
        last_known_institution: 'Nature',
        work_list: [
            {
                display_name: '论基因拟实载态酶在练习时长两年半中的催化作用',
            },
            {
                display_name: '论基因拟实载态酶对中分头的催化作用',
            }
        ],
        showArticle: false
    },
])

const showArticles = (index) => {
    authorList[index].value.showArticle = true
}

const closeArticles = (index) => {
    authorList[index].value.showArticle = false
}

const StepZeroToOne = async () => {
    await formRef.value.validate((valid, fields) => {
        if (valid) {
            stepIndex.value++;
            //todo 根据输入的form传到后端进行检索 返回用户组 这里需要跟后端商量那个work_url的用法 更新authorList
        } else {
            console.log(fields)
        }
    })
}

const StepBack = () => {
    stepIndex.value--;
}

const stepFinish = () => {
    accountType.value = 3
}

const lastIndex = ref(-1) //记录上一个勾选的框 勾选动作之前当下的选项
const TurnLastToFalse = (index) => {
    if (lastIndex.value >= 0 && lastIndex.value != index) {
        authorList[lastIndex.value].chose = false
    }
    lastIndex.value = index
}

const StepOneToTwo = async () => {
    //todo 将lastIndex对应的authorList的id传到后端
    if (lastIndex.value == -1) {
        ElMessage.warning('请选择一位学者')
    } else {
        //todo 跟后端进行交互
        stepIndex.value++
    }
}
</script>
<style scoped>
.wrap2{
    height: 50%;
    width: 60%;
    /* margin-top: 25%;
    margin-left: 20%; */
    border-radius: 20px;
    background-color: white;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.claim-portal-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
}

.claim-portal-body {
    margin-top: 10%;
    height: 50vh;
    width: 60vw;

    background-color: white;
    border-radius: 20px;

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

.step2-message{
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
}

.table {
    width: 80%;
    margin-top: 30px;
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
    font-size: 20px;
    font-weight: 800;
}

.alert-message-number {
    font-size: 23px;
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
    width: 95%;
    margin-left: 2.5%;
    transition: 2s;
}

.right-arrow {
    float: right;
    font-size: 20px;
    margin-right: 10px;
    cursor: pointer;
}

.author-article-name {
    font-size: 18px;
    font-weight: 600;
    word-break: break-all;
    word-wrap: wrap;
    margin-top: 20px;
    margin-bottom: 30px;
}

.el-divider--horizontal {
    margin: 0;
}

.alert-message-header {
    width: 100%;
    margin: 10px 0 10px 0;
}
</style>