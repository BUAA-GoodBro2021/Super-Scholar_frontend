<template>
	<div class="login-container">
		<img src="/person.png" class="earth-img"/>
		<div class="login-box">
			<div class="slogen">
               <div class="slogen-title">Make Academia Visible</div>
               <div class="slogen-dis">
                  上亿级数据，毫秒级响应<br/>
                  从引用图表到专家关系网络，构建专业可视化的学术成果分享平台
				  {{width}}
               </div>
        </div>
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
	</div>
	<ParticleBackground/>
</template>
<script setup>
import ParticleBackground from '../../components/Background/ParticleBackground.vue';
const { width, height } = useWindowSize();
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
	height:100%;
	.login-box{
		z-index: 2;
		position: absolute;
		width: 80%;
		height: 80%;
		top:50%;
		left:50%;
		transform: translate(-50%, -50%);
		border-radius: 10px;
		box-shadow: 0 0.7px 1.7px rgba(0, 0, 0, 0.248);
		box-sizing: border-box;
		backdrop-filter: blur(8px);
		&:hover {
			box-shadow: 0 0.7px 1.7px rgba(0, 0, 0, 0.248),
			0 1.7px 4.3px rgba(0, 0, 0, 0.355), 0 3.5px 8.9px rgba(0, 0, 0, 0.445),
			0 7.3px 18.3px rgba(0, 0, 0, 0.552), 0 20px 50px rgba(0, 0, 0, 0.8);
		}
		&:hover ~ .frosted-bg {
			filter: blur(10px);
		}
	}
}
.earth-img{
	position: absolute;
	bottom: 0;
	right:0;
	z-index: 1;
	width: 300px;
}
.slogen {
      position: absolute;
      left: 5%;
      top: calc(50% - 40px);
      &-title {
         font-size: 40px;
         font-weight: 900;
         color: white;
      }
      &-dis {
         margin-top: 5vh;
         font-size: 20px;
         font-weight: 200;
         color: #aab1b9;
         line-height: 30px;
      }
   }
.login-register {
	font-size: 12px;
	color:#409eff;
	margin-left: 10px;
}
.login-form {
		position: absolute;
		top:50%;
		left:80%;
		transform: translate(-50%, -50%);
		width: 420px;
		padding: 50px 40px 45px;
		border-radius: 10px;
		box-shadow: 0 0.7px 1.7px rgba(0, 0, 0, 0.248);
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
@media screen and (max-width:1260px) {
	.login-form{
		position: absolute;
		top:50%;
		left:50%;
		transform: translate(-50%, -50%);
	}
	.slogen{
		display: none;
	}
}
.el-input__wrapper{
	background-color: transparent !important;
}
</style>