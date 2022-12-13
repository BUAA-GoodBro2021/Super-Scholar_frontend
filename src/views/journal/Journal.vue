<template>
    <div v-loading="isLoading" class="common_layout">
      <div class="top_card">
        <TopCard v-if="journalInfo" :journalInfo="journalInfo" />
      </div>
      <div class="article_data_wrap card">
        <div>
          <PaperList v-if="journalInfo" :filter="{'host_venue.id': journalId}"></PaperList>
        </div>
      </div>
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
  .card {
    padding-top:40px;
    width: 100%;
    background-color: white;
    box-shadow: 3px 3px 3px 3px #dedede;
    height: 100%;
    font-family: "Times New Roman", Times, "Microsoft YaHei", serif;
  
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
  