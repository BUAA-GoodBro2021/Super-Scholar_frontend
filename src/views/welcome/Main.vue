<template>
    <div class="main">
            <div class="slogen">
               <div class="slogen-title">Make Academia Visible</div>
               <div class="slogen-dis">
                  上亿级数据，毫秒级响应<br/>
                  从引用图表到专家关系网络，构建专业可视化的学术成果分享平台
               </div>
            </div>
            <SearchVue 
               class="search" 
               @final-search="jumpToSearchDetailPage"   
            />
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
</template>
<script setup>
import { TransitionPresets, useTransition } from "@vueuse/core";
import { Search } from "../../api/search.js";
import { useRouter } from 'vue-router';
import SearchVue from "../../components/SearchInput/Search.vue";
import WorkCountVue from "../icon/WorkCount.vue";
import AuthorCountVue from "../icon/AuthorCount.vue";
import VenueCountVue from "../icon/VenueCount.vue";
import InstitutionCountVue from "../icon/InstitutionCount.vue";
import ConceptCountVue from "../icon/ConceptCount.vue";
const authorCount = ref(0);
const conceptCount = ref(0);
const institutionCount = ref(0);
const workCount = ref(0);
const venueCount = ref(0);

const router = useRouter();
const jumpToSearchDetailPage = (searchText, searchEntityType) => {
   console.log("主页搜索的搜索文本和实体类型是: ", searchText, searchEntityType);
   router.push({
    name: "SearchDetail",
  });
};

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
onMounted(() => {
   Search.getDataView({}).then((res) => {
      if (res.data.result == 1) {
         authorCount.value = res.data.author_count;
         conceptCount.value = res.data.concepts_count;
         institutionCount.value = res.data.institutions_count;
         workCount.value = res.data.work_count;
         venueCount.value = res.data.venues_count;
      }
   })
})
</script>
<style lang="scss" scoped>
   @media screen and (min-height: 794px) {
      .earth {
         display: block;
         top: 15vh;
      }
   }
   .main {
   height: 100%;
   background-color: #040d21;
   background-size: cover;
   position: relative;
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
}
</style>