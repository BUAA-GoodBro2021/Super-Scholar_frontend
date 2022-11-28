<template>
   <div>
	<el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" size="large">
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
			<el-input type="password1" v-model="registerForm.password1" placeholder="密码" show-password autocomplete="new-password">
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
		<el-button :icon="CirclePlus" round @click="register(registerFormRef)" size="large" type="primary" :loading="loading">
			注册
		</el-button>
	</div>
   </div>
</template>
<script setup>
import { CirclePlus } from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";
import {useGlobalStore} from "../../stores/global.js";
import { Account } from "../../api/account";
import i18n from "../../language/index"
const globalStore = useGlobalStore();
const router = useRouter();
const registerFormRef = ref();
const registerRules = ref({
	username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
	password1: [{ required: true, message: "请输入密码", trigger: "blur" }],
	password2: [{ required: true, message: "请确认密码", trigger: "blur" }],
   	email: [{ required: true, message: "请输入邮箱", trigger: "blur" }]
});
const registerForm = ref({
    username:"",
    password1:"",
	password2:"",
    email:"",
})
const loading = ref(false);
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
			registerFormRef.value.resetFields();
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
const resetForm = (formEl)=>{
    if(!formEl) return;
    formEl.resetFields();
}
onMounted(() => {
	// 监听enter事件
	// document.onkeydown = (e) => {
	// 	e = window.event || e;
	// 	if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
	// 		register(registerFormRef.value);
	// 	}
	// };
});
</script>