<template>
    <div class="wrap">
        <el-steps :active="stepIndex" finish-status="success">
            <el-step title="填写个人信息" />
            <el-step title="认领门户" />
            <el-step title="完成" />
        </el-steps>
        <el-divider></el-divider>
        <div class="step step0" v-show="index == 0">
            <el-form :model="form" label-width="120px" ref="formRef" :rules="rules">
                <el-form-item label="真实姓名">
                    <el-input v-model="form.name" prop="name" />
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="form.email" prop="email" />
                </el-form-item>
                <el-form-item label="手机号码">
                    <el-input v-model="form.telephone" prop="telephone" />
                </el-form-item>
                <el-form-item label="单位">
                    <el-input v-model="form.organization" prop="organization" />
                </el-form-item>
            </el-form>
            <el-form-item>
                <el-button type="primary" @click="StepZeroToOne()">下一步</el-button>
            </el-form-item>
        </div>
        <div class="step step0" v-show="index == 1">
            <span class="alert-message">已根据您的姓名， 检索出{{authorList.length}}位科研人员</span>
            <el-button type="primary" @click="StepOneToTwo()">确定</el-button>
            <div v-for="(item, index) in authorList" :key="index">
                <el-checkbox v-model="item.chose" label="{{item.display_name}}" @click="TurnLastToFalse(index)"/>
                <div v-for="(article, articleIndex) in authorList.work_list" :key="articleIndex">
                    <span>{{article.display_name}}</span>
                </div>
            </div>
        </div>
        <div class="step step0" v-show="index == 2">
            <el-icon><SuccessFilled /></el-icon>
            <span>欢迎入驻！</span><br />
            <span>管理员将在3天时间内完成审核，请耐心等待。</span>
            <el-button type="primary" @click="stepFinish()">完成</el-button>
        </div>
    </div>
</template>
<script setup>
const stepIndex = ref(0)
const props = defineProps({
    tokenid: Number
})

const formRef = ref()
const form = reactive({
    name: 'Harbour',
    email: '2358272468@qq.com',
    telephone: '15112345678',
    organization: '北京航空航天大学软件学院'
})
const rules = reactive < FormRules > ({
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
    await formRef.validate((valid, fields) => {
        if(valid) {
            stepIndex.value ++;
            //todo 根据输入的form传到后端进行检索 返回用户组 这里需要跟后端商量那个work_url的用法 更新authorList
        } else {
            console.log(fields)
        }
    })
}

const lastIndex = ref(-1) //记录上一个勾选的框 勾选动作之前当下的选项
const TurnLastToFalse = (index) => {
    if(lastIndex.value >= 0 && lastIndex.value != index) {
        authorList[lastIndex.value].chose = false
    }
    lastIndex.value = index
}

const StepOneToTwo = async () => {
    //todo 将lastIndex对应的authorList的id传到后端
    if(lastIndex.value == -1) {
        ElMessage.warning('请选择一位学者')
    } else {
        //todo 跟后端进行交互
        stepIndex.value ++
    }
}

const stepFinish = () => {
    //todo
}
</script>
<style>

</style>