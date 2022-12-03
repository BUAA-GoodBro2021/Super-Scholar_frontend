<template>
   	<div class="login-container flx-center">
		<div class="login-box">
			<div class="login-left">
				<img src="@/assets/images/login_left0.png" alt="login" />
			</div>
			<div class="login-form">
				<div class="login-logo">
					<img class="login-icon" src="/icon.png" alt="" />
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
	position: relative;
	min-width: 550px;
	height: 100%;
	min-height: 500px;
	background-color: #eeeeee;
	background-image: url("../../assets/images/login_bg.svg");
	background-position: 50%;
	background-size: 100% 100%;
	background-size: cover;
}
.login-register {
	font-size: 12px;
	color:#409eff;
	margin-left: 10px;
}
.flx-center {
    display: flex;
    align-items: center;
    justify-content: center;
}
@media (max-width:768px){
	.login-box{
		.login-left{
			display: none;
		}
	}
}
.login-box {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 96%;
		height: 94%;
		padding: 0 50px;
		background-color: hsl(0deg 0% 100% / 80%);
		border-radius: 10px;
		.login-left {
			width: 800px;
			img {
				width: 100%;
				height: 100%;
			}
		}
		.login-form {
			width: 420px;
			padding: 50px 40px 45px;
			border-radius: 10px;
			box-shadow: 0 0.7px 1.7px rgba(0, 0, 0, 0.248);
			backdrop-filter: blur(6px);
			&:hover {
				box-shadow: 2px 3px 7px rgb(0 0 0 / 20%);
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
				width: 100%;
				margin-top: 40px;
				white-space: nowrap;
				.el-button {
					width: 185px;
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
				}
			}
		}
	}
</style>