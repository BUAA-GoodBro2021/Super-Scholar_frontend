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
			<el-button :icon="UserFilled" round @click="isSliderCaptchaShow = true" size="large" type="primary" :loading="loading">
				登录
			</el-button>
			<el-button :icon="CirclePlus" round @click="register()" size="large">注册</el-button>
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
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";
import {useGlobalStore} from "../../stores/global.js";
import { Account } from "../../api/account";
import { getTimeState } from "../../utils";
import i18n from "../../language/index"
const globalStore = useGlobalStore();
const router = useRouter();
const loginFormRef = ref();
const loginRules = ref({
	username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
	password: [{ required: true, message: "请输入密码", trigger: "blur" }]
});
const loginForm = ref({
    username:"",
    password:""
})
const loading = ref(false);
// 控制人类行为验证窗口显示
const isSliderCaptchaShow = ref(false);
// 人类行为验证通过事件
const onSliderCaptchaSuccess = () => {
	isSliderCaptchaShow.value = false;
	login();
}

const login = ()=>{
	Account.login(loginForm.value).then((res)=>{
		if(res.data.result===1){
			globalStore.setToken(res.data.token);
			globalStore.setUserInfo(res.data.user);
			console.log(i18n);
			ElNotification({
				title: getTimeState(),
				message: `${i18n.global.t("header.welcome")},${res.data.user.username}`,
				type: "success",
				duration: 3000
			});
			router.push(`/user/${res.data.token}`);
		}
		else{
			ElNotification({
				title: "很遗憾",
				message: res.data.message,
				type: "error",
				duration: 3000
			})
			loginFormRef.value.resetFields();
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
const resetForm = (formEl)=>{
    if(!formEl) return;
    formEl.resetFields();
}
const register = ()=>{
	console.log("register")
	router.push({name:"Register"});
}
onMounted(() => {
	// 监听enter事件
	document.onkeydown = (e) => {
		e = window.event || e;
		if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
			isSliderCaptchaShow.value = true;
		}
	};
});
</script>