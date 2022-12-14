<template>
   <div class="clearfix" style="height: 100vh;">
      <Header style="height: 64px;" />
      <div class="client-body">
         <Main/>
         <div v-if="loading">
            <SandboxLoading style="margin-top:100vh"/>
         </div>
         <div v-else class="content" id="recommend">
            <div class="left-content-wrap">
               <div class="left-content">
                  <el-tabs v-model="activeName" @tab-change="curPage = 1">
                     <el-tab-pane label="为你推荐" name="count">
                        <WorksResCard v-for="(item, index) in recommendByCount.slice(itemIndex, itemIndex + 5)" :key="index"
                           :item="item" />
                     </el-tab-pane>
                     <el-tab-pane label="最新论文" name="date">
                        <WorksResCard v-for="(item, index) in recommendByDate.slice(itemIndex, itemIndex + 5)" :key="index"
                           :item="item" />
                     </el-tab-pane>
                     <div class="pag">
                        <el-pagination layout="prev, pager, next" :total="25" :page-size="5" @current-change="goHeader"
                           v-model:current-page="curPage" />
                     </div>
                  </el-tabs>
               </div>
            </div>
            <div class="right-content-wrap">
               <div class="right-content">
                  <div class="right-menu">
                     <div class="menu-card" @click="toClaimPortal">
                        <div class="menu-card-left"></div>
                        <span class="route-name">认领门户</span>
                     </div>
                     <div class="menu-card" @click="toCollection">
                        <div class="menu-card-left"></div>
                        <span class="route-name">收藏夹</span>
                     </div>
                     <div class="menu-card" @click="toFollowList">
                        <div class="menu-card-left"></div>
                        <span class="route-name">关注列表</span>
                     </div>
                     <div class="menu-card" @click="toChat">
                        <div class="menu-card-left"></div>
                        <span class="route-name">学术助手</span>
                     </div>
                  </div>
                  <div class="right-yiyan">
                        <div class="yiyan">一言</div>
                     <div class="text">{{ oneWord.hitokoto }}</div>
                     <div class="text">{{ oneWord.from_who }}</div>
                     <div class="text">{{ oneWord.from }}</div>
                  </div>
               </div>
            </div>
         </div>
         <div class="client-footer">
            <p>京ICP备2022007189号-2</p>
            <p>Copyright © 2021-2022 Super2021.</p>
            <p>All Rights Reserved. Super2021 版权所有</p>
         </div>
      </div>
   </div>
</template>
<script setup>
import Main from "./Main.vue";
import { Search } from "../../api/search.js";
import WorksResCard from "../search/WorksResCard.vue";
import SandboxLoading from "../../components/Loading/SandboxLoading.vue";
import { useRouter } from "vue-router";
const recommendByCount = ref([]);
const recommendByDate = ref([]);
const activeName = ref("count");
const oneWord = ref({});
const curPage = ref(1);
const loading = ref(true);
const router = useRouter();
const itemIndex = computed(() => {
   return (curPage.value - 1) * 5;
})
const getOneWord = () => {
   fetch("https://v1.hitokoto.cn?c=i")
      .then(res => res.json())
      .then(data => {
         console.log("OneWord", data);
         oneWord.value = data;
      });
}
const goHeader = () => {
   document.getElementById("recommend")
      .scrollIntoView({ behavior: 'smooth' });
}
const toCollection = () => {
    router.push({ name: "Collection" });
}
const toChat = () => {
    router.push({ name: "Chat" });
}
const toFollowList = () => {
    router.push({ name: "FollowList" });
}
const toClaimPortal = () => {
    router.push({ name: "ClaimPortal" });
}
onMounted(() => {
   Search.getRecommendedView({}).then((res) => {
      if (res.data.result == 1) {
         recommendByCount.value = res.data.recommended_work_list_by_cited_count[0].results;
         recommendByDate.value = res.data.recommended_work_list_by_publication_date[0].results;
         loading.value = false;
      }
   })
   getOneWord();
})
</script>
<style lang="scss" scoped>
.clearfix::before,
.clearfix::after {
   content: '';
   display: table;
   clear: both;
}
.client-body {
   margin-top: 64px;
   height: calc(100vh - 64px);
}
.client-footer {
   padding: 2rem;
   text-align: center;
   background-color: whitesmoke;
   color: gray;
   font-size: small;
}
.el-card{
   background-color: #f0f0f0;
}
:deep(.is-active) {
    color: rgb(162, 143, 42) !important;
}
:deep(.el-tabs__active-bar) {
    background-color: rgb(162, 143, 42);
}

:deep(.el-tabs__item:hover) {
    color: rgb(162, 143, 42);
}
.content {
   position: relative;
   z-index: 1;
   background-color: whitesmoke;
   display: flex;

   .left-content-wrap {
      flex: 1;
      .left-content {
         margin: 0 5vw;
         height: 100%;
      }

      .pag {
         display: flex;
         margin: 1rem;
         justify-content: center;
      }

      :deep(.el-tabs__item) {
         font-size: 18px;
         font-weight: 800;
      }

      :deep(.el-tabs__content) {
         padding-right: 2vw;
         overflow: visible;
      }
   }
   .right-content-wrap {
      width: 30vw;
      .right-content {
         width: 80%;
         margin: 3.5rem auto;
         text-align: center;
         .right-menu{
            width: 100%;
            border-radius: 2px;
            box-shadow: 3px 3px 3px 3px #dedede;
            .menu-card{
               margin: 5px 0px 5px 0px;
               position: relative;
               padding: 17px 0 7px 20px;
               border-radius: 2px;
               height: 70px;
               background-color: #f0f0f0;
               box-shadow: 3px 3px 0px 0px #cfcfcf;
            }
            .menu-card:hover {
               background-color: #c2c2c2;
            }
            .menu-card-left{
               position: absolute;
               width: 7px;
               height: 30px;
               left: 0;
               top: 20px;
               background-color: black;
            }
            .route-name{
               font-size: 20px;
               font-weight: 800;
               text-align: left;
               display: flex;
               align-items: center;
               height: 80%;
               width: 100%;
               cursor: pointer;
            }
            .route-name:hover{
               color: white;
            }
         }
         .right-yiyan{
            margin-top: 2rem;
            border-radius: 2px;
            box-shadow: 3px 3px 3px 3px #dedede;
            padding: 1rem;
            padding-top: 10px;
            .yiyan {
            font-weight: 800;
            font-size: 20px;
            padding: 1rem;
            text-align: center;
            border-bottom: #f0f0f0 3px solid;
         }

         .text {
            margin-top: 1rem;
            font-size: 1.2rem;
            line-height: 1.5rem;
            font-weight: bold;
            color: rgba(121, 116, 116, 0.9);
         }
         }

         .text:last-child {
            margin-bottom: 1rem;
         }
      }
   }
   @media screen and (max-width: 1120px) {
      .right-content-wrap {
         display: none;
      }
   }
}
</style>