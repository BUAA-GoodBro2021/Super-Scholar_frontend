<template>
    <el-container style="align-items: center;">
        <el-header height="auto" class="article_top_bg">
            <el-container>
                <el-main>
                    <PaperBriefVue :paperInfo="paperInfo" v-if="paperInfo"/>
                </el-main>
                <el-aside width="20%">
                    <PaperActionVue></PaperActionVue>
                </el-aside>
            </el-container>
        </el-header>
        <el-container style="width:80%">
            <el-main>
                <el-card v-if="paperInfo" style="margin-bottom:25px">
                    <div slot="header">
                        <span>摘要</span>
                    </div>
                    <el-divider></el-divider>
                    <span style="font-size:16px;line-height: 20px;">
                        {{paperInfo.abstract}}
                    </span>
                </el-card>
                <el-card>
                    <PaperDetailVue v-if="paperId && paperInfo" :paperId="paperId"  :paperInfo="paperInfo" />
                </el-card>
            </el-main>
            <el-aside width="30%">
                <el-card shadow="always"  v-if="paperInfo" style="margin:20px;">
                    <PaperRelatedVue :paperInfo="paperInfo" v-if="paperId" :paperId="paperId"/>
                </el-card>
            </el-aside>
        </el-container>
    </el-container>
</template>
<script setup>
import PaperBriefVue from './PaperBrief.vue';
import PaperActionVue from './PaperAction.vue';
import PaperDetailVue from './PaperDetail.vue';
import PaperRelatedVue from './PaperRelated.vue';
import { Search } from "../../api/search";

import {useRouter, useRoute} from 'vue-router'
const route = useRoute()
const paperId = route.params.paperid
const paperInfo = ref()




onMounted(() => {
    Search.single(
        {
            entity_type: "works",
            params: {
                id: paperId
            }
        }
    ).then((res)=>{
        paperInfo.value = res.data.single_data
        })
    })

</script>
<style scoped>

@keyframes dropdown{
    0%{opacity: 0;}
    100%{opacity: 1;}
}
.article_top_bg{
    box-shadow: 0px 0px 5px inset skyblue;
    animation: dropdown 1s 1;
    width: 100%;
    padding-left: 10%;
    padding-right: 10%;
}
.article_top_warp{
    width: 80%;
}
.article_brief_wrap{
}

.article_data_wrap{
    width: 80%;
    min-height: 68vh;
    height: auto;
    display: flex;
}
.article_data_bg{
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 68vh;
    height: auto;
    background-color: rgba(230, 230, 230, 0.234);
    display: flex;
    padding: 20px 20px 0px 20px;
    border-radius: 5px 5px 0px 0px;
    box-shadow: 0px 2px 4px inset skyblue;
}

.article_data_wrap .left{
    width: 70%;
    margin-right: 20px;
    box-shadow: 0px 0px 10px skyblue;
    border-radius: 10px 10px 0px 0px;
}

.article_data_wrap .right{
    width: 30%;
    box-shadow: 0px 0px 10px skyblue;
    border-radius: 10px 10px 0px 0px;
}
</style>