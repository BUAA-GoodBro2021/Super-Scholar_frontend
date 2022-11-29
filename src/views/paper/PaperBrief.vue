<template>
    <div class="brief_main_wrap">
        <div class="card_body">
            <ul>
                <li>
                    <div class="title_profile">
                        <span class="title">
                            {{paperInfo.display_name}}
                        </span>
                        <div class="organization">
                            <el-icon><HomeFilled /></el-icon> &nbsp;
                            {{ }}
                        </div>
                        <div class="areas" v-if="paperInfo.concepts">
                            <el-icon><Menu /></el-icon> &nbsp;
                            <span style="cursor: pointer;" v-for="(item, index) in paperInfo.concepts" :key="index">{{item.display_name}}<span v-if="index != paperInfo.concepts.length - 1">/&nbsp;</span></span>
                        </div>
                        <div class="areas" v-else>
                            <el-icon><Menu /></el-icon>
                            <span>{{'暂无领域信息'}}</span>
                        </div>
                    </div>
                </li>
                

                <li class="right-btn-wrap" v-if="personAccount != 1 && !is_follow"
                    style="float: right; vertical-align: middle;">
                    <el-button class="right-btn" type="primary"  size="large" plain>关注</el-button>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import {
  Menu,
  Edit,
  HomeFilled,
} from '@element-plus/icons-vue'
const props = defineProps({
    paperInfo: Object
})


onMounted(() => {
    
})

</script>
<style>
/* 整体的height和width由外层调整 */
.brief_main_wrap{
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.card_body {
    height: 80%;
    width: 100%;

}

.card_body ul {
    margin: 0;
    height: 100%;
}

.card_body li {
    list-style: none;
    margin-right: 20px;
    display: inline-block;
    height: 100%;
    vertical-align: middle;
}

.title_profile {
    height: 100%;
    margin-left: 30px;
}

.title {
    font-size: 40px;
    height: 20%;
    margin-bottom: 5%;
    line-height: 100%;
    cursor: pointer;
    text-align: left;
    display: block;
}

.organization {
    font-size: 18px;
    height: 13%;
    line-height: 100%;
    text-align: left;
    cursor: pointer;
}

.areas {
    font-size: 18px;
    color: #409eff;
    height: 13%;
    line-height: 100%;
    text-align: left;

    display: block;
    word-break: break-all;
    word-wrap: break-word;
}

.follow {
    font-size: 18px;
    color: grey;
}

.right-btn-wrap{
    height: 100%;
    width: 10%;
}

.right-btn{
    margin-top: 50%;
    font-size: 20px;
}
</style>