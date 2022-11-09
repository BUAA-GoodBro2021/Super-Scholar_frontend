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
                    <el-form-item label="单位" prop="organization" >
                        <el-input v-model="form.organization" prop="organization" />
                    </el-form-item>
                </el-form>
                <el-form-item>
                    <el-button type="primary" @click="StepZeroToOne()">下一步</el-button>
                </el-form-item>
            </div>
            <div class="step step1" v-show="stepIndex == 1">
                <span class="alert-message">已根据您的姓名， 检索出{{ authorList.length }}位科研人员</span>
                <div v-for="(item, index) in authorList" :key="index">
                    <el-checkbox v-model="item.chose" label="{{item.display_name}}" @click="TurnLastToFalse(index)" />
                    <div v-for="(article, articleIndex) in authorList.work_list" :key="articleIndex">
                        <span>{{ article.display_name }}</span>
                    </div>
                </div>
                <el-button type="primary" @click="StepBack()">上一步</el-button>
                <el-button type="primary" @click="StepOneToTwo()">确定</el-button>
            </div>
            <div class="step step2" v-show="stepIndex == 2">
                <el-icon>
                    <SuccessFilled />
                </el-icon>
                <span>欢迎入驻！</span><br />
                <span>管理员将在3天时间内完成审核，请耐心等待。</span>
                <el-button type="primary" @click="stepFinish()">完成</el-button>
            </div>
        </div>
    </div>
    <div class="wrap2" v-if="accountType == 2">
        <el-icon>
            <SuccessFilled />
        </el-icon>
        <span>管理员将在3天时间内完成审核，请耐心等待。</span>
    </div>
</template>
<script setup>
const stepIndex = ref(0)
const props = defineProps({
    tokenid: Number,
    accountType: Number //1->未认证 3->认证待审核
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
    },
])

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

const stepFinish = () => {
    //todo
}
</script>
<style>
.claim-portal-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
}

.claim-portal-body{
    margin-top: 10%;;
    height: 50vh;
    width: 60vw;

    background-color: white;
    border-radius: 20px;

    padding: 30px 30px;
}
.steps{
    margin: 20px 0 20px 0;
}

.step0{
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}

.table{
    width: 80%;
}

.el-form-item{
    margin-bottom: 30px;
}

.el-form-item__label {
    text-align: left;
    font-size: 18px;
}

</style>