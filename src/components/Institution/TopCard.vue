<template>
  <div class="name_card">
    <div class="card_body">
      <ul>
        <!-- 机构的image（如果有的话） -->
        <li style="vertical-align: middle">
          <div class="avatar_wrap">
            <el-avatar
              :size="110"
              :src="
                institutionInfo.image_url
                  ? institutionInfo.image_url
                  : institutionImage
              "
            >
            </el-avatar>
          </div>
        </li>
        <li class="title-profile-li">
          <div class="title_profile">
            <div class="title-profile-block">
              <!-- 机构名称 -->
              <div class="name">
                <span class="institution-display-name">
                  {{ institutionInfo.display_name }}
                </span>
                <span
                  class="institution-display-name"
                  v-if="
                    getChineseName(institutionInfo.international.display_name)
                  "
                >
                  （{{
                    getChineseName(institutionInfo.international.display_name)
                  }}）
                </span>
              </div>
              <!-- 机构主页地址 -->
              <div
                v-if="institutionInfo.homepage_url"
                class="organization canClick"
              >
                <el-icon>
                  <Notification />
                </el-icon>
                &nbsp;
                <span @click="gotoHomePage">
                  主页地址：{{ institutionInfo.homepage_url }}
                </span>
              </div>
              <div v-if="institutionInfo.geo" class="organization">
                <el-icon>
                  <PriceTag />
                </el-icon>
                &nbsp;
                <span>
                  所在地：
                  {{
                    institutionInfo.geo.city +
                    ", " +
                    institutionInfo.geo.country
                  }}
                </span>
              </div>
              <div class="organization">
                总论文数：{{  institutionInfo.works_count }}
              </div>
              <div class="organization">
                论文总引用数：{{ institutionInfo.cited_by_count }}
              </div>
              <!-- 机构相关领域 -->
              <div class="concept">
                <div class="card-concepts clearfix">
                  <div
                    class="card-concepts-wrap canClick"
                    v-for="(
                      concept, conceptIndex
                    ) in institutionInfo.x_concepts.slice(0, 11)"
                    @click="gotoConcept(concept)"
                  >
                    <div class="card-concept-context">
                      {{ concept.display_name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import institutionImage from "../../assets/images/institution.png";
const router = useRouter();
const props = defineProps({
  institutionInfo: Object,
});

const gotoHomePage = () => {
  window.open(props.institutionInfo.homepage_url);
};

const gotoConcept = (concept) => {
  let { href } = router.resolve({
    name: "ConceptDetail",
    params: {
      tokenid: concept.id.substring(21),
    },
  });
  window.open(href, "_blank");
};

const getChineseName = (name) => {
  if (name == null) {
    return null;
  }
  return name["zh-cn"] || name["zh-hans"] || name.zh;
};
</script>

<style scoped>
.avatar_wrap {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.name_card {
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

.card_body {
  height: 100%;
  width: 90%;
}

.card_body ul {
  margin: 0;
  height: 100%;
}

.card_body li {
  list-style: none;
  margin-right: 20px;
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}

.name {
  font-size: 30px;
  height: 40%;
  line-height: 100%;
  text-align: left;
  margin: 3% 0%;
}

.institution-display-name {
  margin: 1% 0%;
  font-weight: bold;
}

.title_profile {
  font-size: 23px;
  height: 55%;
  line-height: 100%;
  text-align: left;
  display: block;
}

.title-profile-block {
  display: block;
  height: 60%;
}

.title-profile-li {
  padding-left: 3rem;
  min-width: 60%;
  max-width: 80%;
}

.organization {
  font-size: 15px;
  height: 30%;
  margin-bottom: 10px;
  line-height: 100%;
  text-align: left;
  display: flex;
  align-items: center;
}

.canClick {
  cursor: pointer;
}

.canClick:hover {
  color: rgb(162, 143, 42);
}

.concept {
  font-size: 15px;
  /* color: rgb(162, 143, 42); */
  height: 73%;
  width: 100%;
  line-height: 20px;
  text-align: left;
  display: flex;
  word-break: break-all;
  word-wrap: break-word;
}

.card-concepts {
  height: auto;
  margin-bottom: 0.8rem;
}
.card-concepts .card-concepts-wrap {
  float: left;
  margin-right: 10px;
  margin-bottom: 5px;
  padding: 3px 5px;
  box-sizing: border-box;
  border: 1.6px solid;
  border-radius: 5px;
  font-size: 15px;
}

.card-concepts .card-concepts-wrap:hover {
  background-color: #f1f5fa;
}

.card-concepts .card-concepts-wrap i {
  display: inline-block;
  margin-right: 3px;
}
.card-concepts .card-concepts-wrap .card-concept-context {
  display: inline-block;
  text-transform: capitalize;
}

.clearfix::before,
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
</style>
