<template>
   <div class="clearfix" style="height: 100vh;">
      <Header style="height: 64px;" />
      <div class="client-body">
         <div class="main">
            <div class="slogen">
               <div class="slogen-title">Make Academia Visible</div>
               <div class="slogen-dis">
                  上亿级数据，毫秒级响应<br/>
                  从引用图表到专家关系网络，构建专业可视化的学术成果分享平台
               </div>
            </div>
            <SearchVue class="search" />
            <div class="intro">
               <div class="box">
                  <WorkCountVue />
                  <div class="title">论文</div>
                  <div class="data">{{ outputWork.toFixed(0) }}</div>
               </div>
               <div class="box">
                  <AuthorCountVue />
                  <div class="title">学者</div>
                  <div class="data">{{ outputAuthor.toFixed(0) }}</div>
               </div>
               <div class="box">
                  <VenueCountVue />
                  <div class="title">期刊</div>
                  <div class="data">{{ outputVenue.toFixed(0) }}</div>
               </div>
               <div class="box">
                  <InstitutionCountVue />
                  <div class="title">机构</div>
                  <div class="data">{{ outputInstitution.toFixed(0) }}</div>
               </div>
               <div class="box">
                  <ConceptCountVue />
                  <div class="title">领域</div>
                  <div class="data">{{ outputConcept.toFixed(0) }}</div>
               </div>
            </div>
            <div class="earth">
               <iframe frameborder="0" width="810" height="610" src="https://scholar.super2021.com/earth/">
               </iframe>
            </div>
         </div>
         <div v-if="loading">
            loading...
         </div>
         <div v-else class="content" id="recommend">
            <div class="left-content-wrap">
               <div class="left-content">
                  <el-tabs v-model="activeName" class="demo-tabs" @tab-change="curPage = 1">
                     <el-tab-pane label="为你推荐" name="count">
                        <WorksResCard v-for="(item, index) in recommendByCount.slice(itemIndex, itemIndex + 5)" :key="index"
                           :item="item" />
                     </el-tab-pane>
                     <el-tab-pane label="最新论文" name="date">
                        <WorksResCard v-for="(item, index) in recommendByDate.slice(itemIndex, itemIndex + 5)" :key="index"
                           :item="item" />
                     </el-tab-pane>
                     <div class="pag">
                        <el-pagination layout="prev, pager, next" :total="15" :page-size="5" @current-change="goHeader"
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
import Header from "../components/Header/index.vue"
import SearchVue from "../components/SearchInput/Search.vue";
import { Search } from "../api/search.js";
import WorksResCard from "./search/WorksResCard.vue";
import { TransitionPresets, useTransition } from "@vueuse/core";
import WorkCountVue from "./icon/WorkCount.vue";
import AuthorCountVue from "./icon/AuthorCount.vue";
import VenueCountVue from "./icon/VenueCount.vue";
import InstitutionCountVue from "./icon/InstitutionCount.vue";
import ConceptCountVue from "./icon/ConceptCount.vue";
const recommendByCount = ref([]);
const recommendByDate = ref([]);
const authorCount = ref(0);
const conceptCount = ref(0);
const institutionCount = ref(0);
const workCount = ref(0);
const venueCount = ref(0);
const activeName = ref("count");
const oneWord = ref({});
const curPage = ref(1);
const loading = ref(true);
const itemIndex = computed(() => {
   return (curPage.value - 1) * 5;
})
const outputAuthor = useTransition(authorCount, {
   duration: 1000,
   transition: TransitionPresets.linear,
})
const outputInstitution = useTransition(institutionCount, {
   duration: 1000,
   transition: TransitionPresets.linear,
})
const outputWork = useTransition(workCount, {
   duration: 1000,
   transition: TransitionPresets.linear,
})
const outputVenue = useTransition(venueCount, {
   duration: 1000,
   transition: TransitionPresets.linear,
})
const outputConcept = useTransition(conceptCount, {
   duration: 1000,
   transition: TransitionPresets.linear,
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
   Search.getDataView({}).then((res) => {
      if (res.data.result == 1) {
         recommendByCount.value = res.data.recommended_work_list_by_cited_count[0].results;
         recommendByDate.value = res.data.recommended_work_list_by_publication_date[0].results;
         authorCount.value = res.data.author_count;
         conceptCount.value = res.data.concepts_count;
         institutionCount.value = res.data.institutions_count;
         workCount.value = res.data.work_count;
         venueCount.value = res.data.venues_count;
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

.main {
   height: 100%;
   background-color: #040d21;
   background-size: cover;
   position: sticky;
   z-index: 0;
   overflow: hidden;
   .slogen {
      position: absolute;
      left: 6vw;
      top: calc(30vh - 140px);
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

   .search {
      position: absolute;
      left: 5vw;
      top: 40vh;
      width: 45vw;
   }

   .intro {
      position: absolute;
      top: 58vh;
      left: 5vw;
      width: 45%;
      display: flex;
      justify-content: space-between;

      .box {
         width: 110px;
         .title {
            font-size: 20px;
            margin-top: 10px;
            font-weight: 400;
            text-align: center;
            color: #a2b3ff;
         }

         .data {
            font-size: large;
            font-weight: 900;
            color: rgb(207, 198, 198);
            margin-top: 10px;
            text-align: center;
         }
      }
   }

   .earth {
      position: absolute;
      top: 5vh;
      right: -2vw;
      z-index: -2;
      overflow: hidden;
   }

   @media screen and (max-width:992px) {
      .main {
         height: 100vh;
      }

      .search {
         width: 88vw;
      }

      .intro {
         display: none;
      }

      .earth {
         left:50%;
         margin-left: -400px;
         overflow: hidden;
      }
   }

   @media screen and (min-height: 794px) {
      .earth {
         display: block;
         top: 15vh;
      }
   }
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
      }
   }

   .right-content-wrap {
      width: 30vw;

      .right-content {
         width: 80%;
         margin: 2rem auto;
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