<template>
    <div v-loading="isLoading" class="common_layout">
      <!-- 上半部分：基本信息 -->
      <div class="top_card">
        <TopCard v-if="journalInfo" :journalInfo="journalInfo" />
      </div>
      <!-- 下半部分：机构的具体论文以及论文的每年发表数量的图表 -->
      <div class="article_data_wrap">
        <div class="left">
          <!-- <PaperAndData
            :institution-info="institutionInfo"
            :paper-list="institutionPaperList"
            :data-count-by-year="institutionInfo.counts_by_year"
            :pageTotalSize="pageTotalSize"
            @changePage="changePage"
          /> -->
          <PaperList v-if="journalInfo" :filter="{'host_venue.id': 'V1983995261'}"></PaperList>
        </div>
      </div>
      <!-- <div style="white-space: pre">
        {{ journalInfo }}
      </div> -->
    </div>
  </template>
  
  <script setup>
  import { Search } from "../../api/search";
  import TopCard from "./TopCard.vue"
  import PaperList from "./PaperList.vue"
  
  const route = useRoute();
  const journalId = route.params.journalid;
  const journalInfo = ref();
  const journalPapers = ref([]);
  const isLoading = ref(true);
  
  
  onMounted(() => {
    Search.single({
      entity_type: "venues",
      params: {
        id: journalId,
      },
    })
    .then((res) => {
        journalInfo.value = res.data.single_data;
        isLoading.value = false;
        console.log(res.data.single_data)
    })
    .catch((err) => {
        console.log(err);
    });
  });
  
  
  </script>
  
  <style scoped>
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
  
  .article_data_wrap {
    width: 70%;
    height: 60%;
    display: flex;
  }
  
  @media (max-width: 1500px) {
    .top_card {
      width: 90%;
    }
  
    .article_data_wrap {
      width: 90%;
    }
  }
  
  @media (max-width: 1200px) {
    .top_card {
      width: 98%;
    }
  
    .article_data_wrap {
      width: 98%;
      flex-wrap: wrap;
    }
  }
  </style>
  