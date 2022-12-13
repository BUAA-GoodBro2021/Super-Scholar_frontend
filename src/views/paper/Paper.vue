<template>
    <div class="common_layout">
        <div class="top_card">
            <div class=" name_card">
                <div style="display:flex">
                    <div style="width:70%">
                        <PaperBriefVue :paperInfo="paperInfo" v-if="paperInfo"/>
                    </div>
                    <div style="width:28%;margin-left:2%">
                        <PaperActionVue :paperInfo="paperInfo" v-if="paperInfo"></PaperActionVue>
                    </div>
                </div>
            </div>
        </div>
        <div style="width:70%;display:flex;margin:20px;overflow:visible;">
            <div style="width:70%">
                <el-card v-if="paperInfo" style="margin-bottom:25px" class="card">
                    <div slot="header">
                        <span class="title">摘要</span>
                    </div>
                    <el-divider></el-divider>
                    <span style="font-size:16px;line-height: 26px;font-family:'Times New Roman', Times, serif">
                        {{paperInfo.abstract}}
                    </span>
                </el-card>
                <el-card class="card">
                    <PaperDetailVue v-if="paperId && paperInfo" :paperId="paperId"  :paperInfo="paperInfo" />
                </el-card>
            </div>
            <div style="width:28%;height:100%;margin-left:2%;height:100%;overflow:visible">
                <div v-if="paperInfo" style="overflow:visible">
                    <PaperRelatedVue :paperInfo="paperInfo" v-if="paperId" :paperId="paperId"/>
                </div>
            </div>
        </div>
    </div>
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
.title {
    font-size: 18px;
    font-weight: 800;
    text-align: left;
    width: 90%;
    height: 40px;
    line-height: 40px;
}
.common_layout {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(230, 230, 230, 0.234);
    padding-bottom: 1%;
  }
  
  .top_card {
    width: 70%;
    margin: 0.5% 0 0.5% 0;
    height: 40%;
  }
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
.name_card {
    padding-top:40px;
    width: 100%;
    background-color: white;
    box-shadow: 3px 3px 3px 3px #dedede;
    height: 100%;
    font-family: "Times New Roman", Times, "Microsoft YaHei", serif;
    padding:40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
.href_box {
    display: block;
    font-size: 1.1em;
    color: rgb(117, 117, 117);
    background-color: transparent;
    text-decoration: none;
    width: 90%;
    height: 3vh;
    padding-top: 2vh;
    padding-left: 1vw;
    transition: .2s;
}

.href_box:hover {
    color: rgb(64, 158, 255);
}
.card{
    border-radius:0px;
    box-shadow: 3px 3px 3px 3px #dedede;
    
}
</style>