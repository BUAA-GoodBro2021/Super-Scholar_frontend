<template>
	<div>
		<el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" status-icon size="large">
			<el-form-item prop="email">
				<el-input type="email" v-model="registerForm.email" placeholder="用户邮箱">
					<template #prefix>
						<el-icon class="el-input__icon"><Promotion /></el-icon>
					</template>
				</el-input>
			</el-form-item>
			<el-form-item prop="username">
				<el-input v-model="registerForm.username" placeholder="用户名">
					<template #prefix>
						<el-icon class="el-input__icon"><user /></el-icon>
					</template>
				</el-input>
			</el-form-item>
			<el-form-item prop="password1">
				<el-input type="password1" v-model="registerForm.password1" placeholder="密码 8-16位 可使用 数字 字母 @ _" show-password autocomplete="new-password">
					<template #prefix>
						<el-icon class="el-input__icon"><lock /></el-icon>
					</template>
				</el-input>
			</el-form-item>
			<el-form-item prop="password2">
				<el-input type="password2" v-model="registerForm.password2" placeholder="确认密码" show-password>
					<template #prefix>
						<el-icon class="el-input__icon"><lock /></el-icon>
					</template>
				</el-input>
			</el-form-item>
		</el-form>
		<div class="register-btn">
			<el-button :icon="CirclePlus" round @click="submit(registerFormRef)" size="large" type="primary">
				注册
			</el-button>
			<el-button :icon="RefreshLeft" round @click="login" size="large" type="primary">
				返回
			</el-button>
		</div>
		<teleport to="body">
			<SliderCaptcha 
				v-if="isSliderCaptchaShow"
				@success="onSliderCaptchaSuccess"
				@close="isSliderCaptchaShow = false"
			/>
		</teleport>
		
	</div>
</template>
<script setup>
import SliderCaptcha from "./SliderCaptcha.vue";
import { CirclePlus, RefreshLeft } from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";
import {useGlobalStore} from "../../stores/global.js";
import { Account } from "../../api/account";
import { useRoute,useRouter } from "vue-router";
const globalStore = useGlobalStore();
const router = useRouter();
const route = useRoute();
const registerFormRef = ref();
const validateName = (rule,value,callback)=>{
	if(!value.length){
		callback(new Error("请输入用户名"))
	}else{
		callback();
	}
}
const validateEmail = (rule,value,callback)=>{
	let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
	if(!value.length){
		callback(new Error("请输入邮箱"))
	}else if(!reg.test(value)){
		callback(new Error("邮箱不合法"))
	}else{
		callback();
	}
}
const validatePassword = (rule,value,callback)=>{
	let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/
	if(!value.length){
		callback(new Error("请输入密码"))
	}else if(value.length<8||value.length>16){
		callback(new Error("密码长度应为8-16位"))
	}else if(!reg.test(value)){
		callback(new Error("密码格式不规范"))
	}else{
		callback();
	}
}
const validatePassword2 = (rule,value,callback)=>{
	if (!value.length){
		callback(new Error("请确认密码"))
	}else if(value!=registerForm.value.password1){
		callback(new Error("两次密码不一致"))
	}else{
		callback();
	}
}

const registerRules = ref({
	username: [{validator:validateName, trigger: "blur" }],
	password1: [{validator:validatePassword, trigger: "blur" }],
	password2: [{validator: validatePassword2,trigger: "blur" }],
   	email: [{validator:validateEmail, trigger: "blur" }],
});
const registerForm = ref({
    username:"",
    password1:"",
	password2:"",
    email:"",
})
const login = ()=>{
	router.push({name:"Login"})
}
// 提交前进行表单验权
const submit = (formRef)=>{
	console.log("FORMREF",formRef)
	formRef.validate((valid)=>{
		if(valid) isSliderCaptchaShow.value = true
	})
}
// 控制人类行为验证窗口显示
const isSliderCaptchaShow = ref(false);
// 人类行为验证通过事件
const onSliderCaptchaSuccess = () => {
	isSliderCaptchaShow.value = false;
	register();
}
const register = ()=>{
	Account.register(registerForm.value).then((res)=>{
		if(res.data.result===1){
			ElNotification({
				title: "注册成功",
				message: res.data.message,
				type: "success",
				duration: 3000
			});
			router.push({name:"Login"})
		}
		else{
			ElNotification({
				title: "很遗憾",
				message: res.data.message,
				type: "error",
				duration: 3000
			})
		}
	}).catch((err)=>{
		console.log("Error",err);
		ElNotification({
				title: "很遗憾",
				message: err.message,
				type: "error",
				duration: 3000
		})
	})
}
onMounted(() => {
	// 监听enter事件
	document.onkeydown = (e) => {
		e = window.event || e;
		if (route.name=="Regitser" && (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter")) {
			submit(registerFormRef.value);
		}
	};
});
</script>