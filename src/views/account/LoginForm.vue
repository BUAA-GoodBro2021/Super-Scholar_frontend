<template>
	<div>
		<el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
			<el-form-item prop="username">
				<el-input v-model="loginForm.username" placeholder="用户名">
					<template #prefix>
						<el-icon class="el-input__icon"><user /></el-icon>
					</template>
				</el-input>
			</el-form-item>
			<el-form-item prop="password">
				<el-input type="password" v-model="loginForm.password" placeholder="密码" show-password autocomplete="new-password">
					<template #prefix>
						<el-icon class="el-input__icon"><lock /></el-icon>
					</template>
				</el-input>
			</el-form-item>
		</el-form>
		<div class="login-btn">
			<el-button :icon="CirclePlus" round @click="register()" size="large">注册</el-button>
			<el-button :icon="UserFilled" round @click="submit(loginFormRef)" size="large" type="primary" :disabled="disabled">
				登录
			</el-button>
		</div>
		<!-- 该组件是要直接插入到 整个页面的 body中的，所以要利用 vue3 新组件 teleport -->
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
import { CirclePlus, UserFilled } from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";
import {useGlobalStore} from "../../stores/global.js";
import { useSearchStore } from "../../stores/search.js";
import { Account } from "../../api/account";
import { getTimeState } from "../../utils";
import i18n from "../../language/index"
const globalStore = useGlobalStore();
const searchStore = useSearchStore();
const router = useRouter();
const loginFormRef = ref();
const validateName = (rule,value,callback)=>{
	if(!value.length){
		callback(new Error("请输入用户名"))
	}else{
		callback();
	}
}
const validatePassword = (rule,value,callback)=>{
	if(!value.length){
		callback(new Error("请输入密码"))
	}else{
		callback();
	}
}
const loginRules = ref({
	username: [{validator:validateName, trigger: "blur" }],
	password: [{validator:validatePassword, trigger: "blur" }]
});
const loginForm = ref({
    username:"",
    password:""
})
// 控制人类行为验证窗口显示
const isSliderCaptchaShow = ref(false);
// 人类行为验证通过事件
const onSliderCaptchaSuccess = () => {
	isSliderCaptchaShow.value = false;
	login();
}
// 禁用登录按钮
const disabled = computed(()=>{
	return !(loginForm.value.username.length && loginForm.value.password.length);
})
const login = ()=>{
	Account.login(loginForm.value).then((res)=>{
		if(res.data.result===1){
			globalStore.setToken(res.data.token);
			globalStore.setUserInfo(res.data.user);
			res.data.history_list.forEach(element => {
				searchStore.addHistory(element);
			})
			ElNotification({
				title: getTimeState(),
				message: `${i18n.global.t("header.welcome")},${res.data.user.username}`,
				type: "success",
				duration: 3000
			});
			router.push({name:"Welcome"})
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
		ElNotification({
				title: "很遗憾",
				message: err.message,
				type: "error",
				duration: 3000
			})
	})
}
// 提交前进行表单验权
const submit = (formRef)=>{
	console.log("FORMREF",formRef)
	formRef.validate((valid)=>{
		if(valid) isSliderCaptchaShow.value = true
	})
}
const register = ()=>{
	router.push({name:"Register"});
}
onMounted(() => {
	// 监听enter事件
	document.onkeydown = (e) => {
		e = window.event || e;
		if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
			submit(loginFormRef.value);
		}
	};
});
</script>