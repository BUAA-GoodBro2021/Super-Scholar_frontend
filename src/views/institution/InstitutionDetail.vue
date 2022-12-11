<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else class="common_layout">
    <!-- 上半部分：基本信息 -->
    <div class="top_card">
      <TopCard :institution-info="institutionInfo" />
    </div>
    <!-- 下半部分：机构的具体论文以及论文的每年发表数量的图表 -->
    <div class="article_data_wrap">
      <div class="left">
        <PaperAndData
          :institution-info="institutionInfo"
          :paper-list="institutionPaperList"
          :data-count-by-year="institutionInfo.counts_by_year"
          :pageTotalSize="pageTotalSize"
          @changePage="changePage"
        />
      </div>
      <div class="right">
        <Associated
          :institutionList="associatedInstituionList"
          :institutionTotalSize="institutionInfo.associated_institutions.length"
          @associated-institution-page-change="associatedInstitutionPageChange"
        />
      </div>
      <!-- <div style="white-space: pre">
        {{ institutionInfo }}
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { Institution } from "../../api/institution";
import TopCard from "../../components/Institution/TopCard.vue";
import PaperAndData from "../../components/Institution/PaperAndData.vue";
import Associated from "../../components/Institution/Associated.vue";

const route = useRoute();
const institutionid = route.params.institutionid;
const institutionInfo = ref();
const institutionPaperList = ref([]);
const associatedInstituionList = ref([]);
const isLoading = ref(true);

const pageTotalSize = ref(10);
const countPerPage = 10;

onMounted(() => {
  Institution.GetInstitutionDetail({
    entity_type: "institutions",
    params: {
      id: institutionid,
    },
  })
    .then((res) => {
      if (res.data.result == 1) {
        institutionInfo.value = res.data.single_data;
        isLoading.value = false;
        UpdateAssociatedInstitution(1);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  getPaperList({
    entity_type: "works",
    params: {
      filter: {
        "institutions.id": institutionid,
      },
      page: 1,
      per_page: countPerPage,
    },
  });
});

const changePage = async (page) => {
  let data = {
    entity_type: "works",
    params: {
      filter: {
        "institutions.id": institutionid,
      },
      page: page,
      per_page: countPerPage,
    },
  };
  getPaperList(data);
};

const getPaperList = async (data) => {
  Institution.GetInstitutionPaperList(data)
    .then((res) => {
      if (res.data.result == 1) {
        pageTotalSize.value = res.data.list_of_data[0].meta.count;
        institutionPaperList.value = res.data.list_of_data[0].results;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const associatedInstitutionPageChange = (page) => {
  UpdateAssociatedInstitution(page);
};

const UpdateAssociatedInstitution = (page) => {
  associatedInstituionList.value = [];
  for (
    let i = 15 * (page - 1);
    i < 15 * page && i < institutionInfo.value.associated_institutions.length;
    i++
  ) {
    associatedInstituionList.value.push(
      institutionInfo.value.associated_institutions[i]
    );
  }
};
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

.article_data_wrap .left {
  width: 68%;
  margin-right: 2%;
}

.article_data_wrap .right {
  width: 30%;
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

  .article_data_wrap .left {
    width: 100%;
    margin: 10px 0 10px 0;
  }

  .article_data_wrap .right {
    width: 100%;
  }
}
</style>
