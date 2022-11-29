<template>
    <div class="brief_main_wrap">
        <div class="card_body">
            <ul>
                <li>
                    <div class="title_profile">
                        <span class="title">
                            {{paperInfo.display_name}}
                        </span>
                        <div class="areas" v-if="paperInfo.concepts">
                            <el-icon><UserFilled /></el-icon> &nbsp;
                            <span style="cursor: pointer;" v-for="(item, index) in paperInfo.concepts" :key="index">{{item.display_name}}<span v-if="index != paperInfo.concepts.length - 1">/&nbsp;</span></span>
                        </div>
                        <div class="areas" v-else>
                            <el-icon><Loading /></el-icon>
                            <span>{{'暂无作者信息'}}</span>
                        </div>
                        <div class="organization">
                            <el-icon><HomeFilled /></el-icon> &nbsp;
                            {{ }}
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import {
  Menu,
  Loading,
  UserFilled,
  Edit,
  HomeFilled,
User,
} from '@element-plus/icons-vue'
const props = defineProps({
    paperInfo: Object
})


onMounted(() => {
    
})

</script>
<style>

</style>