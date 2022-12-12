<template>
  <div id="PC_main">
    <el-container>
      <el-aside width="19vw">
        <div style="text-align: left">
          <el-button @click="clickButton" class="button" v-if="button.isCollapse">{{button.show[button.isCollapse]}}</el-button>
          <el-button @click="clickButton" class="button_" v-if="!button.isCollapse">{{button.show[button.isCollapse]}}</el-button>
        </div>
        <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            :collapse="button.isCollapse"
            @open="handleOpen"
            @close="handleClose"
            :router="true"
         >
            <el-menu-item index="/admin/ClaimApplication">
               <el-icon><document /></el-icon>
               <template #title>{{$t('header.claimApplication')}}</template>
            </el-menu-item>
            <el-menu-item index="/admin/SettledScholars">
               <el-icon><location /></el-icon>
               <template #title>{{$t('header.settledScholars')}}</template>
            </el-menu-item>
            <el-menu-item index="/admin/UploadArticle">
               <el-icon><setting /></el-icon>
               <template #title>{{$t('header.uploadArticle')}}</template>
            </el-menu-item>
         </el-menu>
      </el-aside>
      <el-main width="70vw">
        <el-col :span="24" class="content-wrapper">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </el-col>
      </el-main>
      <el-aside width="11vw"></el-aside>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ref,reactive } from 'vue';
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'

const button = reactive({
  isCollapse : 1,
  show: ['收起', '展开']
})
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

function clickButton(){
  button.isCollapse = 1 -button.isCollapse
}
</script>

<style scoped>
/* 内外边距清零 */
#PC_main {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: linear-gradient(70deg, rgb(221, 245, 255),rgb(255, 234, 237));
  /* background: linear-gradient(70deg, rgb(0, 0, 0),rgb(49, 49, 49)); */
  /* background: linear-gradient(70deg, rgba(199, 167, 23, 0.733),rgba(255, 235, 168, 0.76)); */
  /* background: linear-gradient(70deg, rgb(221, 245, 255),rgba(94, 204, 255, 0.836)); */
  height: 100%;
}
::v-deep .el-aside {
  height: 89vh;
}
::v-deep .el-menu {
  background-color: rgba(255, 255, 255, 0.4);
}
::v-deep .el-card {
  background-color: rgba(255, 255, 255, 0.8);
}
::v-deep .el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 80vh;
  background-color: rgb(231, 247, 253);
}
::v-deep .el-menu-item,
.el-submenu {
  text-align: left;
  background-color: rgb(231, 247, 253);
}
::v-deep .el-menu-item:hover,
.el-menu-item:active,
.el-submenu__title:hover,
.el-submenu__title:active {
  background-color: rgba(223, 223, 223, 0.898);
}
::v-deep .el-radio-button__inner {
  width: 6vh;
  height: 6vh;
  border-radius: 50% !important;
  text-align: left;
  margin-top: 5vh;
  padding: 2.2vh 0 0 1vh;
  background: rgba(255, 255, 255, 0.4);
}
::v-deep .el-radio-button__inner:hover {
  background-color: rgba(223, 223, 223, 0.898);
  color: #606266;
}
::v-deep .el-menu-item.is-active {
  color: #46c1fa;
}
::v-deep .el-tabs__item.is-active,
.el-tabs__item:hover {
  color: #46c1fa;
}
::v-deep .el-tabs__active-bar {
  background-color: #46c1fa;
}
::v-deep .el-submenu__title:hover {
  background-color: rgba(223, 223, 223, 0.898);
}
::v-deep .el-menu-item:active {
  color: #46c1fa;
}
::v-deep .el-menu-item:focus,
.el-menu-item:hover {
  background-color: rgb(209, 241, 255);
}
::v-deep .el-tabs__item:hover {
  color: #46c1fa;
}
#PC_main {
  /* background-image: url("../../assets/PCM/BG16.webp"); 68 12 */
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100%;
}
.opa {
  opacity: 80%;
}

.button {
  border-radius: 1px;
  width: 4vw;
  position: relative;
  left: 0.2vw;
  margin-top: 2vh;
  margin-bottom: 2vh;
  color: black;
  height: 4vh !important;
  background-color: rgb(232, 248, 255);
  /* background-color: rgba(245, 245, 245, 0.747);
  border-color: #c7c7c7; */
}
.button_ {
  border-radius: 1px;
  width: 13vw;
  position: relative;
  left: 0.2vw;
  margin-top: 2vh;
  margin-bottom: 2vh;
  color: black;
  height: 4vh !important;
  background-color: rgb(232, 248, 255);
  /* background-color: rgba(245, 245, 245, 0.747);
  border-color: #c7c7c7; */
}
.button:active{
  background-color: rgb(179, 232, 255);
}
.button_:active{
  background-color: rgb(179, 232, 255);
}
</style>
