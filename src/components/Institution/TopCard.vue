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
                  : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
              "
              style="cursor: pointer"
            >
            </el-avatar>
          </div>
        </li>
        <li
          style="min-width: 60%; height: 100%; max-width: 80%"
          class="title-profile-li"
        >
          <div class="title_profile">
            <div class="title-profile-block">
              <!-- 机构名称 -->
              <span class="name">
                <div style="display: flex; align-items: center">
                  {{ institutionInfo.display_name }}
                </div>
              </span>
              <span class="name">
                <div style="display: flex; align-items: center">
                  {{ institutionInfo.international.display_name.zh }}
                </div>
              </span>
              <!-- 机构主页地址 -->
              <div class="organization">
                <el-icon>
                  <HomeFilled />
                </el-icon>
                &nbsp;
                <span v-if="openAlexAccount == 1">{{
                  institutionInfo.homepage_url
                    ? institutionInfo.homepage_url
                    : "暂无机构主页地址"
                }}</span>
                <span v-else>
                  主页地址：{{ institutionInfo.homepage_url }}
                </span>
              </div>
              <div class="organization">
                所在地：{{ institutionInfo.country_code }}
              </div>
              <div class="organization">
                总论文数：{{ institutionInfo.works_count }}
              </div>
              <div class="organization">
                论文总引用数：{{ institutionInfo.cited_by_count }}
              </div>
              <!-- 机构相关领域 -->
              <div class="card-concepts clearfix">
                <div
                  class="card-concepts-wrap"
                  v-for="(
                    concept, conceptIndex
                  ) in institutionInfo.x_concepts.slice(0, 11)"
                  @click="handleConceptBubbleClick(concept)"
                >
                  <i class="iconfont icon-menu"></i>
                  <div class="card-concept-context">
                    {{ concept.display_name }}
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
const props = defineProps({
  institutionInfo: Object,
});
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
  border-radius: 20px;
  box-shadow: 3px 3px 3px 3px #dedede;
  height: 100%;

  display: flex;
  flex-direction: column;
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
  cursor: pointer;
  text-align: left;
}

.title_profile {
  font-size: 23px;
  height: 55%;
  line-height: 100%;
  cursor: pointer;
  text-align: left;
  display: block;
}

.title-profile-block {
  display: block;
  height: 60%;
}
.title-profile-li {
  padding: 20px;
}

.organization {
  font-size: 15px;
  height: 30%;
  margin-bottom: 5px;
  line-height: 100%;
  text-align: left;
  /* cursor: pointer; */
  display: flex;
  align-items: center;
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
  border: 1.6px solid black;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
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
