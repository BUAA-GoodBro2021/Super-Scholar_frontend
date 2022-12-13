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
                  <el-card>
                     <template #header>
                        <div class="yiyan">一言</div>
                     </template>
                     <div class="text">{{ oneWord.hitokoto }}</div>
                     <div class="text">{{ oneWord.from_who }}</div>
                     <div class="text">{{ oneWord.from }}</div>
                  </el-card>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>
<script setup>
import Main from "./Main.vue";
import { Search } from "../../api/search.js";
import WorksResCard from "../search/WorksResCard.vue";
import SandboxLoading from "../../components/Loading/SandboxLoading.vue";
const recommendByCount = ref([]);
const recommendByDate = ref([]);
const activeName = ref("count");
const oneWord = ref({});
const curPage = ref(1);
const loading = ref(true);
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
.el-card{
   background-color: #f0f0f0;
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
         margin: 3rem auto;
         text-align: center;

         .yiyan {
            font-weight: 800;
            text-align: center;
         }

         .text {
            margin-top: 1rem;
            font-size: large;
            font-weight: bold;
            color: rgba(121, 116, 116, 0.9);
         }

         .text:last-child {
            margin-bottom: 1rem;
         }
      }
   }
   @media screen and (max-width: 768px) {
      .right-content-wrap {
         display: none;
      }
   }
}
</style>