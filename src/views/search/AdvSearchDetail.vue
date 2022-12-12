<template>
  <!-- 搜索详情页的总体页面 -->
  <div class="search-detail-container clearfix">
    <!-- 上部分，用户放置搜索框 -->
    <div class="search-area">
      <div class="search-area-handler">
        <!-- 折叠起来高度80 -->
        <div class="adv-search-card">
          <!-- 不会被删除的一行：搜索实体类型选择 -->
          <div class="adv-search-line clearfix">
            <!-- 这个就是单纯占位置的，因此绑定的数据也是随便绑定的 -->
            <ElSelect class="adv-select-relation hide" v-model="placeholderRelation">
              <ElOption 
                v-for="logicalRelation in advanceLogicalRelation"
                :label="logicalRelation.label"
                :value="logicalRelation.value"
              />
            </ElSelect>
            <!-- 得益于pinia，这里的store中的数据是响应式的 -->
            <ElSelect class="adv-select" v-model="searchStore.searchType">
              <ElOption 
                v-for="option in advanceEntityTypeFilter"
                :label="option.label"
                :value="option.value" 
              />
            </ElSelect>
            <!-- 绑定pinia中的 searchInputText -->
            <AdvSearchInput class="adv-search-input" v-model="searchStore.searchInputText" />
            <template v-if="advanceCardExpanded">
              <div class="adv-search-btn" @click="initFilterLine">
                <i class="iconfont icon-add"></i>
              </div>
              <div class="adv-search-btn hide">
                <i class="iconfont icon-sub1"></i>
              </div>
            </template>
            <div v-else style="margin-left: 10px; display: inline-block;">
              <button class="adv-search-final-btn" @click="handleAdvanceSearch">
                Search
                <span></span>
              </button>
            </div>
          </div>

          <!-- 可以被删除的筛选行单元的数组 -->
          <div 
            class="adv-search-line clearfix"
            v-if="advanceCardExpanded"
            v-for="(filterLine, index) in advanceFilterResult[searchStore.searchType]" 
            :key=index
          >
            <!-- 
              这里要区分 el-select 和 el-option 的双向绑定
              所有的 逻辑关系 下拉栏中 
              >>> el-option 始终绑定的是同一个数据源 advanceLogicalRelation（因为选项本身不会改变）
              >>> el-select 双向绑定的是该筛选栏对象filterLine的 logicalType 键值
                  当然，这个键值必须是advanceLogicalRelation中的一个label，
                  这样 el-select 才会根据label自动显示value
              所有的 字段筛选类型切换 下拉栏中 
              >>> el-option 始终绑定的是同一个数据源 advanceSecondLevelFilter（因为选项本身不会改变）
              >>> el-select 双向绑定的是该筛选栏对象filterLine的 category 键值
                  当然，这个键值必须是advanceSecondLevelFilter中的一个label，
                  这样 el-select 才会根据label自动显示value
              所有的 input 框，双向绑定着 该筛选栏对象filterLine的 content 键值
             -->
            <ElSelect class="adv-select-relation" v-model="filterLine.logicalType">
              <ElOption 
                v-for="logicalRelation in advanceLogicalRelation"
                :label="logicalRelation.label"
                :value="logicalRelation.value"
              />
            </ElSelect>
            <ElSelect class="adv-select" v-model="filterLine.category">
              <ElOption 
                v-for="option in advanceSecondLevelFilter[searchStore.searchType]"
                :label="option.label"
                :value="option.value" 
              />
            </ElSelect>
            <AdvSearchInput class="adv-search-input" v-model="filterLine.content" />
            <div class="adv-search-btn" @click="addFilterLine(index)">
              <i class="iconfont icon-add"></i>
            </div>
            <div class="adv-search-btn" @click="deleteFilterLine(index)">
              <i class="iconfont icon-sub1"></i>
            </div>
          </div>

          <!-- 如果是论文，支持根据 publication_year 的起始终止进行筛选 -->
          <div 
            class="adv-search-line clearfix" 
            v-if="advanceCardExpanded && searchStore.searchType === 'works'"
          >
            <div class="date-picker-title">
              发布日期
            </div>
            <ElDatePicker 
              v-model="publicationDateRange"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              :shortcuts="shortcuts"
            />

            <div style="margin-left: 120px; display: inline-block;">
              <button class="adv-search-final-btn" @click="handleAdvanceSearch">
                Search
                <span></span>
              </button>
            </div>
          </div>
        </div>
        <div
          class="expand-btn clearfix"
          @click="advanceCardExpanded = !advanceCardExpanded"
        >
          <i 
            class="iconfont icon-arrowup expand-btn-icon"
            :class="{rotate: !advanceCardExpanded}"
          ></i>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
const AND_LABLE_VALUE = 1;
const OR_LABLE_VALUE = 2;
const NOT_LABLE_VALUE = 3;
const shortcuts = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: 'Last 3 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
];
</script>

<script setup>
import { Search } from '../../api/search';
import { reactive, ref, watch } from 'vue';
import { ElDatePicker, ElNotification, ElOption, ElSelect } from 'element-plus';
import { useSearchStore } from '../../stores/search';
import AdvSearchInput from '../../components/SearchInput/AdvSearch.vue';

const searchStore = useSearchStore();
const placeholderRelation = ref("AND");

const publicationDateRange = ref('');

// 高级检索筛选卡片是否展开
const advanceCardExpanded = ref(true);

// 高级检索第一行：实体类型筛选
const advanceEntityTypeFilter = reactive([
  {
    label: '论文',
    value: 'works',
  },
  {
    label: '作者',
    value: 'authors',
  },
  {
    label: '期刊/会议',
    value: 'venues',
  },
  {
    label: '机构',
    value: 'institutions',
  },
  {
    label: '领域',
    value: 'concepts',
  },
]);
// 高级检索第二行以后的第一个筛选框：逻辑关系
const advanceLogicalRelation = reactive([
  {
    label: 'AND',
    value: AND_LABLE_VALUE,
  },
  {
    label: 'OR',
    value: OR_LABLE_VALUE,
  },
  {
    label: 'NOT',
    value: NOT_LABLE_VALUE,
  },
]);
// 高级检索第二行以后的第二个筛选快：每个实体内部的二级字段
const advanceSecondLevelFilter = reactive({
  "works": [
    {
      label: "作者",
      value: "authorships.author.display_name",
    },
    {
      label: "机构",
      value: "authorships.institutions.display_name",
    },
    {
      label: "文献来源",
      value: "host_venue.display_name",
    },
    {
      label: "机构所属国家",
      value: "authorships.institutions.country_code",
    },
    {
      label: "机构类型",
      value: "authorships.institutions.type",
    },
    {
      label: "领域",
      value: "concepts.display_name",
    },
    // 下面是在高级检索中独有的字段
  ],
  "authors": [
    {
      label: "机构",
      value: "last_known_institution.id",
    },
    {
      label: "机构所属国家",
      value: "last_known_institution.country_code",
    },
    {
      label: "机构类型",
      value: "last_known_institution.type",
    },
    {
      label: "领域",
      value: "x_concepts.id",
    },
  ],
  "venues": [
    {
      label: "ISSN版本号",
      value: "issn",
    },
    {
      label: "领域",
      value: "x_concepts.id",
    },
  ],
  "institutions": [
    {
      label: "机构所属国家",
      value: "country_code",
    },
    {
      label: "机构类型",
      value: "type",
    },
    {
      label: "领域",
      value: "x_concepts.id",
    },
  ],
  "concepts": [
    {
      label: "父级概念",
      value: "ancestors.id",
    },
    {
      label: "概念层级",
      value: "level",
    },
  ],
});
// 总的筛选结果
const advanceFilterResult = reactive({
  "works": [
    // 默认含有 作者 和 领域 两个项目
    {
      category: "authorships.author.display_name",
      content: "",
      logicalType: AND_LABLE_VALUE,
    },
    {
      category: "concepts.display_name",
      content: "",
      logicalType: AND_LABLE_VALUE,
    },
  ],
  "authors": [
    // 默认含有 机构 和 领域 两个项目
    {
      category: "last_known_institution.id",
      content: "",
      logicalType: AND_LABLE_VALUE,
    },
    {
      category: "x_concepts.id",
      content: "",
      logicalType: AND_LABLE_VALUE,
    },
  ],
  "venues": [
    // 默认含有 ISSN版本号 和 领域 两个项目
    {
      category: "issn",
      content: "",
      logicalType: AND_LABLE_VALUE,
    },
    {
      category: "x_concepts.id",
      content: "",
      logicalType: AND_LABLE_VALUE,
    },
  ],
  "institutions": [
    // 默认含有 机构所属国家 和 领域 两个项目
    {
      category: "country_code",
      content: "",
      logicalType: AND_LABLE_VALUE,
    },
    {
      category: "x_concepts.id",
      content: "",
      logicalType: AND_LABLE_VALUE,
    },
  ],
  "concepts": [
    // 默认含有 父级概念 和 概念层级 两个项目
    {
      category: "ancestors.id",
      content: "",
      logicalType: AND_LABLE_VALUE,
    },
    {
      category: "level",
      content: "",
      logicalType: AND_LABLE_VALUE,
    },
  ],
});

/**
 * 类型选择 input 行调用
 * 默认添加每一个实体类型第一个筛选选择项 和 AND 关系
 */
const initFilterLine = () => {
  advanceFilterResult[searchStore.searchType].push({
    category: advanceSecondLevelFilter[searchStore.searchType][0].value,
    content: "",
    logicalType: AND_LABLE_VALUE,
  });
}

/**
 * 筛选行单元 调用
 * 默认在筛选行单元的数组的最后添加一行 和 index 所在行一样的 筛选行
 * @param {number} index 点击按钮所在的筛选行的索引
 */
const addFilterLine = (index) => {
  if (advanceFilterResult[searchStore.searchType].length >= 8) {
    ElNotification({
      title: "添加失败",
      message: "请控制检索项在8条以内",
      type: "warning",
      duration: 3000
    });
    return;
  }
  advanceFilterResult[searchStore.searchType].push({
    category: advanceFilterResult[searchStore.searchType][index].category,
    content: "",
    logicalType: advanceFilterResult[searchStore.searchType][index].logicalType,
  });
}
/**
 * 筛选行单元 调用
 * 删除 index 所在的筛选行
 * @param {number} index 点击按钮所在的筛选行的索引
 */
const deleteFilterLine = (index) => {
  advanceFilterResult[searchStore.searchType].splice(index, 1);
}

const buildRelation = (filterLine) => {
  switch (filterLine.logicalType) {
    case AND_LABLE_VALUE:
      return filterLine.content + "&";
    case OR_LABLE_VALUE:
      return filterLine.content + "|";
    case NOT_LABLE_VALUE:
      return "!" + filterLine.content;
    default:
      console.error("Invalid logical type! 非法逻辑关系符");
      return "";
  }
}

const buildAdvanceFilterKey = () => {
  // 选择当前检索的实体类型对应的数据
  const advanceFilterData = advanceFilterResult[searchStore.searchType];
  let filter = {};
  for (let i = 0; i < advanceFilterData.length; i++) {
    const filterLine = advanceFilterData[i];
    // 如果说该行筛选文本不为空 JS 的 "" 布尔判断也是false
    if (filterLine.content) {
      // 如果说filter中早就有了这个字段
      if (filterLine.category in filter) {
        filter[filterLine.category] += buildRelation(filterLine);
      } else {
        // 新建字段，这里不能是 +=
        filter[filterLine.category] = buildRelation(filterLine);
      }
    }
  }
  for (let key of Object.keys(filter)) {
    // 去掉最后一个 '&' 字符或者 '|' 字符
    if (filter[key].charAt(filter[key].length - 1) === '&' || filter[key].charAt(filter[key].length - 1) === '|') {
      filter[key] = filter[key].slice(0, -1);
    }
  }
  if (searchStore.searchType === "works" && publicationDateRange.value) {
    // console.log(publicationDateRange.value);
    if (publicationDateRange.value[0]) {
      filter["from_publication_date"] = publicationDateRange.value[0];
    }
    if (publicationDateRange.value[1]) {
      filter["to_publication_date"] = publicationDateRange.value[1];
    }
  } 
  console.log("高级检索的filter对象: ", filter);
  return filter;
}

const handleAdvanceSearch = () => {
  if (searchStore.searchInputText) {
    advanceCardExpanded.value = false;
    var data = {
      "entity_type": searchStore.searchType,
      "params": {
        "filter": buildAdvanceFilterKey(),
        "page": 1,
        "per_page": 10,
        "search" : searchStore.searchInputText,
      }
    };
    console.log("高级搜索，前端发出的请求体");
    console.log(data);
    Search.getAdvanceSearchDataList(data)
    .then((res) => {
      if (res.data.result === 1) {
        console.log(res.data);
        // searchDataList.value = res.data.list_of_data[0].results;
        // totalSearchResNum.value = res.data.list_of_data[0].meta.count;
        // console.log(searchDataList);
        // ElNotification({
        //   title: "恭喜您",
        //   message: `搜索成功，用时 ${res.data.list_of_data[0].meta.db_response_time_ms / 1000} s`,
        //   type: "success",
        //   duration: 3000
        // });
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }
}

</script>

<style>
.el-tooltip__trigger {
  height: 40px;
}
.el-select .el-input {
  height: 100%;
}
.el-select .el-input .el-input__wrapper {
  border-radius: 0;
  border-right: none;
}
.el-select .el-input .el-input__inner {
  font-family: 'Times New Roman', Times, "Microsoft YaHei", serif;
  font-weight: bold;
  vertical-align: middle;
}

.el-date-editor.el-input__wrapper {
  height: 40px;
}
</style>

<style scoped>
.expand-btn {
  width: 5rem; 
  height: 1.1rem; 
  margin: 0 auto; 
  background-color: #fff; 
  padding: 0 2rem;
  transition: all 0.5s;
}
.expand-btn-icon {
  display: inline-block; 
}

.rotate {
  transform: rotate(180deg);
}

.adv-search-final-btn {
  border: none;
  display: inline-block;
  position: relative;
  z-index: 0;
  padding: 8px 2.2rem;
  height: 38px;
  font-size: 1rem;
  cursor: pointer;
  background: transparent;
  user-select: none;
  color: black;
  overflow: hidden;
}
.adv-search-final-btn span {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: -1;
  border: 5px solid black;
}
.adv-search-final-btn span::before {
  content: "";
  position: absolute;
  width: 8%;
  height: 500%;
  background: white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-60deg);
  transition: all 0.3s;
}
.adv-search-final-btn:hover span::before,
.adv-search-final-btn:focus span::before {
  transform: translate(-50%, -50%) rotate(-90deg);
  width: 100%;
  background: black;
}
.adv-search-final-btn:hover, 
.adv-search-final-btn:focus {
  color: white;
}


/* 这里的样式造成了在a标签中 图标i标签在hover时的变色 */
a, a:hover, a:focus {
  color: inherit;
  text-decoration: none;
  background-color: transparent;
}

/* 清除外边距折叠和高度塌陷 */
.clearfix::before,
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}

.rlist--inline {
  cursor: default;
  list-style: none;
  margin: 0;
  padding: 0;
}
.rlist--inline>li {
  display: inline-block;
}

.search-detail-container{
  box-sizing: border-box;
  /* background-color: rgb(228 228 231); */
  background-color: rgb(234, 234, 234);
  /* background-color: rgb(255, 255, 255); */
  font-family: Merriweather Sans,sans-serif;
  line-height: 1.4;
  word-wrap: break-word;
  /* 控制一些手机或平板设备上使用的文本溢出算法，使用一个百分数来确定文本放大程度。 */
  text-size-adjust: 100%;
}
/* #region 搜索区域 */
.search-area{
  /* background-color: rgb(147 197 253); */
  width: 100%;
  padding: 10px 20px;
}
.search-area-handler {
  width: 100%;
}

.adv-search-card {
  transition: all 0.5s;
}

.search-area-handler .adv-search-card .adv-select-relation {
  box-sizing: border-box;
  border-radius: 0 !important;
  width: 6rem;
  height: 40px;
}

.hide {
  visibility: hidden;
}

.search-area-handler .adv-search-card .adv-select {
  box-sizing: border-box;
  border-radius: 0 !important;
  width: 8rem;
  height: 40px;
}


.search-area-handler .adv-search-card {
  position: relative;
  width: 75%;
  margin: 0 auto;
  background-color: white;
  padding: 20px 50px;
}
.search-area-handler .adv-search-card .adv-search-line{
  width: 100%;
  margin: 20px 0;
  /* background-color: rgba(226, 241, 254, 0.6); */
}

.search-area .adv-search-input{
  display: inline-block;
  max-width: 58%;
  margin-right: 10px;
  /* margin: auto; */
}

.adv-search-btn {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  box-sizing: border-box;
  width: 40px;
  height: 40px;
  border: 2px solid rgb(234, 234, 234);
  border-radius: 9999px;
  margin: 0 10px;
  cursor: pointer;
}

.adv-search-btn > i{
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgb(150, 144, 144);
}

.date-picker-title {
  display: inline-block;
  width: 8rem;
  height: 40px;
  line-height: 40px;
  margin-left: 6rem;
  padding-left: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #606266;
}


/* #endregion 搜索区域结束 */

</style>