<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else class="common_layout">
    <!-- 上半部分：基本信息 -->
    <div class="top_card">
        <div class="pic">
            <el-image style="width: 100px; height: 100px" :src="conceptInfo.image_thumbnail_url" fit="fill" />
        </div>
        <div class="word">
            <div class="title">
                <span>{{conceptInfo.display_name}}</span>
            </div>
            <div class="description">
                <span>{{conceptInfo.description}}</span>
            </div>
            <div class="counts">
                <el-icon style="font-size: 1.1em; font-weight: bolder;"><Document /></el-icon>
                <span>&nbsp;论文数:&nbsp;{{conceptInfo.works_count}}&nbsp;&nbsp;</span>
                <el-icon style="font-size: 1.1em; font-weight: bolder;"><Link /></el-icon>
                <span>&nbsp;引用数:&nbsp;{{conceptInfo.cited_by_count}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="hrefs">
                    <a :href="conceptInfo.ids.openalex" style="color: rgb(0, 119, 194)" class="hrefs">
                        <i class="iconfont icon-menu"></i>
                        <span style="font-size: 1.3em">&nbsp;Openalex&nbsp;&nbsp;</span>
                    </a>
                    <a :href="conceptInfo.ids.wikipedia" style="color: rgb(212, 12, 3)" class="hrefs">
                        <i class="iconfont icon-menu"></i>
                        <span style="font-size: 1.3em">&nbsp;Wiki</span>
                    </a>
                </span>
            </div>
        </div>
    </div>
    <!-- 下半部分：机构的具体论文以及论文的每年发表数量的图表 -->
    <div class="article_data_wrap">
      <div class="left">
        <PaperAndData
          :concept-info="conceptInfo"
          :paper-list="conceptPaperList"
          :data-count-by-year="conceptInfo.counts_by_year"
          :pageTotalSize="pageTotalSize"
          @changePage="changePage"
        />
      </div>
      <div class="right">
          <div style="font-size: 1.4em; margin-top: 3vh; margin-left: 1vw; margin-bottom: 2vh">相关机构</div>
          <div v-for="(item, index) in conceptInfo.related_concepts" class="hbb">
              <a :href="item.id" target="_blank" class="href_box">
                    <span class="related_hrefs">{{item.display_name}}</span>
                    <el-icon class="arrow"><Right /></el-icon>
              </a>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Concept } from "../../api/concept";
import PaperAndData from "../../components/Concept/PaperAndData";

const route = useRoute();
const conceptid = route.params.tokenid;
const conceptInfo = ref();
const conceptPaperList = ref([]);
const associatedConceptList = ref([]);
const isLoading = ref(true);

const pageTotalSize = ref(10);
const countPerPage = 10;

onMounted(() => {
  Concept.GetConceptDetail({
    entity_type: "concepts",
    params: {
      id: conceptid,
    },
  })
    .then((res) => {
      if (res.data.result == 1) {
        console.log(conceptid)
        conceptInfo.value = res.data.single_data;
        console.log("displayname", conceptInfo.value.display_name)
        isLoading.value = false;
        UpdateAssociatedConcept(1);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  getPaperList({
    entity_type: "works",
    params: {
      filter: {
        "concepts.id": conceptid,
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
        "concepts.id": conceptid,
      },
      page: page,
      per_page: countPerPage,
    },
  };
  getPaperList(data);
};

const getPaperList = async (data) => {
  Concept.GetConceptPaperList(data)
    .then((res) => {
      if (res.data.result == 1) {
        pageTotalSize.value = res.data.list_of_data[0].meta.count;
        conceptPaperList.value = res.data.list_of_data[0].results;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const associatedConceptPageChange = (page) => {
  UpdateAssociatedConcept(page);
};

const UpdateAssociatedConcept = (page) => {
  associatedConceptList.value = [];
  for (
    let i = 5 * (page - 1);
    i < 5 * page && i < conceptInfo.value.related_concepts.length;
    i++
  ) {
    associatedConceptList.value.push(
      conceptInfo.value.related_concepts[i]
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
  /* box-shadow: 3px 6px 10px 5px #888888; */
}

.article_data_wrap .right {
  width: 30%;
  /* box-shadow: 3px 6px 10px 5px #888888; */
}
.paper_common_layout {
    background-color: rgb(247, 247, 247);
    border-radius: 3px;
}

@media (max-width: 1500px) {
  .top_card {
    width: 90%;
    /* border: 2px solid red; */
  }

  .article_data_wrap {
    width: 90%;
  }
}

@media (max-width: 1200px) {
  .top_card {
    width: 98%;
    /* border: 2px solid red; */
  }

  .article_data_wrap {
    width: 98%;
    flex-wrap: wrap;
  }

  .article_data_wrap .left {
    width: 100%;
    margin: 10px 0 10px 0;
    /* box-shadow: 3px 6px 10px 5px #888888; */
  }

  .article_data_wrap .right {
    width: 100%;
    /* box-shadow: 3px 6px 10px 5px #888888; */
  }
}

.title {
    font-size: 1.5em;
    /* margin-bottom: 2vh; */
    margin-top: 2vh;
}
.description {
    display: block;
    font-size: 1em;
    color: #999;
    height: auto;
    margin-top: 2vh;
    margin-bottom: 2vh;
}

.top_card {
    width: 90%;
    background-color: rgb(247, 247, 247);
    border-radius: 3px;
    box-shadow: 2px 2px 2px 2px #dedede;
    /* height: 100%; */
    margin-bottom: 3vh;
}

.counts {
    font-size: 0.9em;
    color: rgb(94, 94, 94);
    margin-bottom: 1vh;
}

.hrefs {
    display: inline-block;
    font-size: 12px;
    color: rgb(117, 117, 117);
    background-color: transparent;
    text-decoration: none;
}

.word {
    position: relative;
    left: 10%;
    width: 73vw !important;
    background-color: #fff;
    /* 30px */
    margin-left: 1.875rem;
    /* 15px */
    margin-top: 0.9375rem;
    padding: 0.9375rem;
    box-shadow: 0 0.3125rem 0.5rem rgb(0 0 0 / 10%);
    background: #fff;
    word-break: break-word;
    margin-bottom: 2vh;
    padding-left: 5vw;
}

.pic {
    position: absolute;
    left: 10vw;
    top: 14vh;
    background-color: rgb(0, 0, 0);
    border-radius: 50%;
    width: 120px;
    height: 120px;
    z-index: 10;
    overflow: hidden;
    border: #999 solid 1px;
}

.right {
    width: 90%;
    background-color: rgb(247, 247, 247);
    border-radius: 3px;
    box-shadow: 2px 2px 2px 2px #dedede;
    /* height: 100%; */
    margin-bottom: 4vh;
    height: auto;
}

.href_box {
    display: block;
    font-size: 1.3em;
    color: rgb(117, 117, 117);
    background-color: transparent;
    text-decoration: none;
    width: 90%;
    height: 5vh;
    padding-top: 2vh;
    padding-left: 1vw;
    transition: .2s;
}

.href_box:hover {
    color: rgb(64, 158, 255);
}

.arrow {
    float: right;
}

.hbb {
    background-color: transparent;
    transition: .2s;
}

.hbb:hover {
    background-color: white;
}
</style>
