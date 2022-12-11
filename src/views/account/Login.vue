<template>
	<div class="login-container">
	<img src="/person.png" class="earth-img"/>
	<div class="login-form">
		<div class="login-logo">
			<img class="login-icon" src="/icon1.png" alt="" />
		</div>
		<router-view v-slot="{route,Component}">
			<transition name="fade" mode="out-in">
				<keep-alive>
					<component :is="Component"></component>
				</keep-alive>
			</transition>
		</router-view>
	</div>
	</div>
</template>
<script setup>
</script>
<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.login-container {
	background-color: #040d21;
	background-image: url("../../assets/images/login_bg.svg");
	background-position: 50%;
	background-size: 100% 100%;
	background-size: cover;
	position: relative;
	height:100%;
}
.earth-img{
	position: absolute;
	bottom: 0;
	right:0;
	z-index: 100;
	width: 300px;
}
.login-register {
	font-size: 12px;
	color:#409eff;
	margin-left: 10px;
}
.login-form {
		position: absolute;
		top:50%;
		left:50%;
		transform: translate(-50%, -50%);
		width: 420px;
		padding: 50px 40px 45px;
		border-radius: 10px;
		box-shadow: 0 0.7px 1.7px rgba(0, 0, 0, 0.248);
		backdrop-filter: blur(6px);
		&:hover {
			box-shadow: 0 0.7px 1.7px rgba(0, 0, 0, 0.248),
			0 1.7px 4.3px rgba(0, 0, 0, 0.355), 0 3.5px 8.9px rgba(0, 0, 0, 0.445),
			0 7.3px 18.3px rgba(0, 0, 0, 0.552), 0 20px 50px rgba(0, 0, 0, 0.8);
		}
		&:hover ~ .frosted-bg {
			filter: blur(10px);
		}
		.login-logo {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 45px;
			.login-icon {
				width: 200px;
				height: 100px;
			}
			.logo-text {
				padding: 0 0 0 25px;
				margin: 0;
				font-size: 42px;
				font-weight: bold;
				color: #34495e;
				white-space: nowrap;
			}
		}
		.el-form-item {
			margin-bottom: 40px;
		}
		.login-btn {
			display: flex;
			justify-content: space-between;
			background-color: transparent !important;
			width: 100%;
			margin-top: 40px;
			white-space: nowrap;
			.el-button {
				width: 185px;
				background-color: transparent;
			}
		}
		.register-btn{
			display: flex;
			justify-content: space-between;
			width: 100%;
			margin-top: 40px;
			white-space: nowrap;
			.el-button {
				width: 350px;
				background-color: transparent;
			}
		}
	}
.el-input__wrapper{
	background-color: transparent !important;
}
</style>