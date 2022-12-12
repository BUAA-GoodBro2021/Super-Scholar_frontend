<template>
    <el-row style="width:100%;height:100%;padding:0px" align="middle">
        <el-col :sm="12" :md="12" :xl="6">
            <el-button type="primary" class="btn" size="large" :disabled="!paperInfo.open_access.is_oa" @click="download"><el-icon size="large"><Download /></el-icon></el-button>
        </el-col>
        <el-col :sm="12" :md="12" :xl="6">
            <el-button type="success" class="btn" size="large"><el-icon size="large"><Star /></el-icon></el-button>
        </el-col>
        <el-col :sm="12" :md="12" :xl="6">
            <el-button type="danger" class="btn" size="large" @click="openAlex"><el-icon size="large"><View /></el-icon></el-button>
        </el-col>
        <el-col :sm="12" :md="12" :xl="6">
            <el-button type="warning"  class="btn" size="large"><el-icon size="large"><Share /></el-icon></el-button>
        </el-col>
    </el-row>
</template>
<script setup>

import {
Download,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from '@element-plus/icons-vue'

const props = defineProps({
    paperInfo: Object,
  });
function download(){
    if(!props.paperInfo.open_access.oa_url)
        return;
    window.open(props.paperInfo.open_access.oa_url);
}
function openAlex(){
    window.open(props.paperInfo.id);
}
</script>
<style>
.btn{
    border-radius:0px;
    border:2px black solid;
    transition: all 0.1s;
}
.btn:hover{
    border:2px white solid;
}
.card{
    border-radius:0px;
    box-shadow: 0 0.3125rem 0.5rem rgb(0 0 0 / 10%);
}
</style>